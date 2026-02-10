import { useCallback, useRef, useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  Flex,
  HStack,
  // IconButton,
  Input,
  Slider,
  Text,
  VStack,
} from '@chakra-ui/react'

import {
  //  Camera,
  User,
} from 'lucide-react'

interface AvatarUploadProps {
  onSave?: (croppedImage: string) => void
  size?: number
}

export const AvatarUpload = ({ onSave, size = 128 }: AvatarUploadProps) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [savedImage, setSavedImage] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setImageSrc(reader.result as string)
        setZoom(1)
        setPosition({ x: 0, y: 0 })
        setIsModalOpen(true)
      }
      reader.readAsDataURL(file)
      e.target.value = ''
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!imageSrc) return
    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    },
    [isDragging, dragStart],
  )

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!imageSrc) return
    const touch = e.touches[0]
    setIsDragging(true)
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    })
  }

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging) return
      const touch = e.touches[0]
      setPosition({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y,
      })
    },
    [isDragging, dragStart],
  )

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  const getCroppedImage = useCallback(() => {
    if (!imageSrc) return

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.src = imageSrc

    img.onload = () => {
      const modalPreviewSize = 300
      const circleSize = size
      const scaleFactor = circleSize / modalPreviewSize

      canvas.width = circleSize
      canvas.height = circleSize

      ctx.beginPath()
      ctx.arc(circleSize / 2, circleSize / 2, circleSize / 2, 0, Math.PI * 2)
      ctx.closePath()
      ctx.clip()

      const previewHeight = modalPreviewSize
      const previewWidth = (img.width / img.height) * previewHeight

      const displayWidth = previewWidth * zoom
      const displayHeight = previewHeight * zoom

      const finalWidth = displayWidth * scaleFactor
      const finalHeight = displayHeight * scaleFactor

      const offsetX = (circleSize - finalWidth) / 2 + position.x * scaleFactor
      const offsetY = (circleSize - finalHeight) / 2 + position.y * scaleFactor

      ctx.drawImage(img, offsetX, offsetY, finalWidth, finalHeight)

      const croppedImageUrl = canvas.toDataURL('image/png')
      setSavedImage(croppedImageUrl)
      onSave?.(croppedImageUrl)
      setIsModalOpen(false)
    }
  }, [imageSrc, zoom, position, size, onSave])

  const handleCancel = () => {
    setImageSrc(null)
    setZoom(1)
    setPosition({ x: 0, y: 0 })
    setIsModalOpen(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <>
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        display="none"
      />

      <Box position="relative" width={`${size}px`} height={`${size}px`}>
        <Box
          position="relative"
          width="full"
          height="full"
          borderRadius="full"
          overflow="hidden"
          border={!savedImage ? '1.5px solid' : '0px'}
          borderColor="#0369a1"
          bg="gray.50"
        >
          {savedImage ? (
            <Box
              as="img"
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              src={savedImage}
              alt="Avatar"
              width="full"
              height="full"
              objectFit="cover"
            />
          ) : (
            <Flex
              width="full"
              height="full"
              alignItems="center"
              justifyContent="center"
              color="gray.400"
            >
              <User size={64} strokeWidth={1} color="#0369a1" />
            </Flex>
          )}
        </Box>
        {/* <IconButton
          position="absolute"
          bottom="1.5%"
          right="1.5%"
          size="sm"
          borderRadius="full"
          colorPalette="blue"
          aria-label="Upload image"
          onClick={() => fileInputRef.current?.click()}
          boxShadow="lg"
          zIndex={2}
        >
          <Camera size={16} />
        </IconButton>` */}
      </Box>

      <Dialog.Root
        open={isModalOpen}
        onOpenChange={(e) => {
          if (!e.open) handleCancel()
        }}
        size="lg"
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Adjust Your Avatar</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <VStack gap={6}>
                <Box
                  position="relative"
                  width="300px"
                  height="300px"
                  borderRadius="full"
                  overflow="hidden"
                  border="2px solid"
                  borderColor="#0369a1"
                  bg="gray.50"
                  cursor={
                    imageSrc ? (isDragging ? 'grabbing' : 'grab') : 'default'
                  }
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  ref={containerRef}
                  userSelect="none"
                  mx="auto"
                >
                  {imageSrc && (
                    <Box
                      as="img"
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      src={imageSrc}
                      alt="Avatar preview"
                      position="absolute"
                      top="50%"
                      left="50%"
                      transform={`translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(${zoom})`}
                      maxWidth="none"
                      height="100%"
                      pointerEvents="none"
                      draggable={false}
                    />
                  )}
                </Box>

                <Box width="full">
                  <HStack justify="space-between" mb={2}>
                    <Text fontSize="sm" fontWeight="medium" color="gray.700">
                      Zoom
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {Math.round(zoom * 100)}%
                    </Text>
                  </HStack>
                  <Slider.Root
                    value={[zoom]}
                    onValueChange={(details) => setZoom(details.value[0])}
                    min={0.5}
                    max={3}
                    step={0.1}
                  >
                    <Slider.Control>
                      <Slider.Track>
                        <Slider.Range />
                      </Slider.Track>
                      <Slider.Thumb index={0} />
                    </Slider.Control>
                  </Slider.Root>
                </Box>

                <Text fontSize="sm" color="gray.600" textAlign="center">
                  Drag the image to reposition • Use the slider to zoom
                </Text>
              </VStack>
            </Dialog.Body>
            <Dialog.Footer>
              <HStack gap={3} width="full">
                <Button flex={1} variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button flex={1} colorPalette="blue" onClick={getCroppedImage}>
                  Apply Changes
                </Button>
              </HStack>
            </Dialog.Footer>
            <Dialog.CloseTrigger />
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </>
  )
}

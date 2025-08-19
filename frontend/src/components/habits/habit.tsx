'use client'

import { Box, Flex, Spinner, Text } from '@chakra-ui/react'
import { Circle } from 'lucide-react'
import { motion } from 'framer-motion'
import { CheckMarkIcon } from '@/assets/icons/check-mark'

const MotionBox = motion.create(Box)

interface P {
  title: string
  description: string
  checked?: boolean
  isChecking: boolean
  onCheck: () => void
}

const Habit = ({
  title,
  description,
  checked = false,
  isChecking,
  onCheck,
}: P) => {
  const handleClick = () => {
    if (isChecking) return
    onCheck()
  }

  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      padding={2}
      flex={1}
      gap={2}
      borderRadius="lg"
      borderWidth="1px"
      borderColor="gray.200"
      position="relative"
      overflow="hidden"
      cursor={isChecking ? 'not-allowed' : 'pointer'}
      onClick={handleClick}
      opacity={isChecking ? 0.8 : 1}
      transition="opacity 0.2s"
      bg={checked ? 'linear-gradient(to left, #bbf7d0, #f0fdfa)' : 'white'}
    >
      {!isChecking && (
        <MotionBox
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          borderRadius="inherit"
          bg="green.400"
          zIndex={0}
          initial={false}
          animate={checked ? 'checked' : 'unchecked'}
          variants={{
            checked: { scale: [1, 1.5, 1], opacity: [0.3, 0, 0] },
            unchecked: { scale: 1, opacity: 0 },
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      )}

      <Flex gap={2} alignItems="center" zIndex={1}>
        <Box w="20px" h="20px" position="relative">
          {isChecking ? (
            <Spinner
              size="xs"
              color="gray.500"
              position="absolute"
              top="0"
              left="0"
              width="full"
              height="full"
            />
          ) : (
            <>
              <MotionBox
                initial={false}
                animate={checked ? 'checked' : 'unchecked'}
                variants={{
                  checked: { scale: 1, opacity: 1, rotate: 0 },
                  unchecked: { scale: 0, opacity: 0, rotate: -180 },
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                position="absolute"
                top="0"
                left="0"
              >
                <CheckMarkIcon strokeWidth={1} size="lg" color="green" />
              </MotionBox>

              <MotionBox
                initial={false}
                animate={!checked ? 'checked' : 'unchecked'}
                variants={{
                  checked: { scale: 1, opacity: 1, rotate: 0 },
                  unchecked: { scale: 0, opacity: 0, rotate: 180 },
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                position="absolute"
                top="0"
                left="0"
              >
                <Circle strokeWidth={1.5} size={20} color="gray" />
              </MotionBox>
            </>
          )}
        </Box>

        <Flex direction="column">
          <Text color="gray.800" fontSize={12}>
            {title}
          </Text>
          <Text color="gray.500" fontSize={10}>
            {description}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}

export { Habit }

import { Box, Card, Flex, Text } from '@chakra-ui/react'
import type { ReactNode } from 'react'

interface BadgeCardProps {
  icon: ReactNode
  title: string
  description: string
  isCompleted?: boolean
  isLocked?: boolean
  iconColor?: string
  iconBackground?: string
}

export const BadgeCard = ({
  icon,
  title,
  description,
  isCompleted = false,
  isLocked = false,
  iconColor = '#FF6B35',
  iconBackground = '#FF6B35',
}: BadgeCardProps) => {
  const cardBg = isLocked ? 'gray.50' : 'white'
  const cardBorderColor = isLocked ? 'gray.200' : 'gray.100'
  const titleColor = isLocked ? 'gray.400' : 'gray.800'
  const descriptionColor = isLocked ? 'gray.400' : 'gray.500'
  const finalIconBackground = isLocked ? 'gray.300' : iconBackground
  const finalIconColor = isLocked ? 'gray.500' : iconColor
  return (
    <Card.Root
      width={{ base: '150px', sm: '180px', md: '220px' }}
      height={{ base: '110px', sm: '150px', md: '180px' }}
      position="relative"
      cursor="pointer"
      transition="all 0.3s ease"
      _hover={{
        transform: 'translateY(-4px)',
        boxShadow:
          '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }}
      bg={cardBg}
      border="1px solid"
      borderColor={cardBorderColor}
      borderRadius="16px"
      boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
      overflow="hidden"
    >
      <Card.Body
        px={{ base: 3, sm: 4, md: 6 }}
        py={{ base: 5, sm: 7, md: 9 }}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={{ base: 2, sm: 2, md: 3 }}
        height="100%"
      >
        {/* Completion Indicator */}
        {isCompleted && (
          <Box
            position="absolute"
            top={4}
            right={4}
            width={3.5}
            height={3.5}
            borderRadius="full"
            bg="green.500"
            border="2px solid"
            borderColor="white"
            boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
          />
        )}

        {/* Icon Container */}
        <Flex
          align="center"
          justify="center"
          w={{ base: '44px', sm: '52px', md: '60px' }}
          h={{ base: '44px', sm: '52px', md: '60px' }}
          borderRadius="16px"
          bg={finalIconBackground}
          color={finalIconColor}
          mb={2}
          boxShadow={isLocked ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.15)'}
          position="relative"
          p={{ base: 2, sm: 3, md: 4 }}
          _before={
            isLocked
              ? {}
              : {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '16px',
                  background:
                    'linear-gradient(145deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)',
                  pointerEvents: 'none',
                }
          }
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            w="100%"
            h="100%"
          >
            {icon}
          </Box>
        </Flex>

        {/* Badge Title */}
        <Text
          fontSize="md"
          fontWeight="600"
          color={titleColor}
          textAlign="center"
          lineHeight="1.2"
          mb={1}
        >
          {title}
        </Text>

        {/* Badge Description */}
        <Text
          fontSize="sm"
          color={descriptionColor}
          textAlign="center"
          lineHeight="1.4"
          fontWeight="400"
          opacity={isLocked ? 0.7 : 1}
        >
          {description}
        </Text>
      </Card.Body>
    </Card.Root>
  )
}

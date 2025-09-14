import { Box, Flex, IconButton, Text, VStack } from '@chakra-ui/react'
import { AlertTriangle, ChevronLeft } from 'lucide-react'

interface P {
  circleSize?: number
  iconSize?: number
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

const AppNotFound = ({
  circleSize = 40,
  iconSize = 60,
  title = 'Nothing here yet!',
  description = 'Oops! Looks like this space is empty. Let’s fix that!',
  actionLabel = 'Back',
  onAction,
}: P) => {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      width="full"
      minH="60vh"
      px={4}
      bgGradient="linear(to-b, gray.50, gray.100)"
    >
      <VStack gap={2}>
        <Box
          width={circleSize}
          height={circleSize}
          rounded="full"
          bgGradient="linear(to-tr, yellow.200, yellow.400)"
          display="flex"
          justifyContent="center"
          alignItems="center"
          boxShadow="md"
        >
          <AlertTriangle size={iconSize} color="#B45309" />
        </Box>

        <Text
          fontSize="2xl"
          fontWeight="bold"
          color="gray.800"
          textAlign="center"
        >
          {title}
        </Text>

        <Text fontSize="md" color="gray.600" textAlign="center" maxW="md">
          {description}
        </Text>

        {onAction && (
          <IconButton
            aria-label={actionLabel}
            size="lg"
            colorScheme="yellow"
            variant="outline"
            borderRadius="xl"
            onClick={onAction}
          >
            <ChevronLeft />
          </IconButton>
        )}
      </VStack>
    </Flex>
  )
}

export { AppNotFound }

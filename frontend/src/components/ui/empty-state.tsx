import { Box, Flex, IconButton, Text } from '@chakra-ui/react'
import { List, Plus } from 'lucide-react'

interface P {
  circleSize?: number
  iconSize?: number
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

const AppEmptyState = ({
  circleSize = 32,
  iconSize = 48,
  title = 'Nothing here yet!',
  description = 'Start by creating your first item and begin your journey.',
  actionLabel = 'Create',
  onAction,
}: P) => {
  return (
    <Flex direction="column" gap={4} width="full">
      <Flex justifyContent="center">
        <Box
          width={circleSize}
          height={circleSize}
          rounded="full"
          bg="#e6effc"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <List size={iconSize} color="#a1a1aa" />
        </Box>
      </Flex>

      <Text textAlign="center" color="gray.700">
        {title}
      </Text>

      <Flex justifyContent="center" width="full">
        <Text
          textAlign="center"
          color="gray.500"
          maxWidth="400px"
          fontSize={14}
        >
          {description}
        </Text>
      </Flex>

      {onAction && (
        <Flex justifyContent="center" width="full">
          <IconButton
            p={4}
            variant="primary"
            borderRadius="lg"
            onClick={onAction}
          >
            <Plus />
            {actionLabel}
          </IconButton>
        </Flex>
      )}
    </Flex>
  )
}

export { AppEmptyState }

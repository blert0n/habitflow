import { Button, Flex } from '@chakra-ui/react'
import { memo } from 'react'

interface ActionButtonsProps {
  onSubmit: () => void
  onBack: () => void
}

export const ActionButtons = memo(
  ({ onSubmit, onBack }: ActionButtonsProps) => {
    return (
      <Flex gap={2} mt={2}>
        <Button
          size="xs"
          px={4}
          onClick={onSubmit}
          type="submit"
          colorScheme="green"
        >
          Create habit
        </Button>
        <Button variant="outline" size="xs" px={4} onClick={onBack} bg="white">
          Cancel
        </Button>
      </Flex>
    )
  },
)

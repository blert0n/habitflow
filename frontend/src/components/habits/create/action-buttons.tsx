import { Button, Flex } from '@chakra-ui/react'
import { memo } from 'react'

interface ActionButtonsProps {
  onSubmit: () => void
  onBack: () => void
  isValid: boolean
  isLoading: boolean
}

export const ActionButtons = memo(
  ({ onSubmit, onBack, isValid, isLoading }: ActionButtonsProps) => {
    return (
      <Flex gap={2} mt={2}>
        <Button
          variant="primary"
          size="xs"
          px={4}
          onClick={onSubmit}
          type="submit"
          disabled={!isValid || isLoading}
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

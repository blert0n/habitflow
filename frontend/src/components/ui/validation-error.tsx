import { Text } from '@chakra-ui/react'
import type { FieldError } from 'react-hook-form'

interface P {
  error?: FieldError
}
export const RenderValidationError = ({ error }: P) => {
  if (!error) return null
  return (
    <Text color="red.500" fontSize={12}>
      {error.message}
    </Text>
  )
}

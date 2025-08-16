import { Flex, Separator, Text } from '@chakra-ui/react'

interface P {
  text: string
}

const TextWithDivider = ({ text }: P) => {
  return (
    <Flex align="center" gap={3} w="full">
      <Separator flex={1} borderColor="gray.200" />
      <Text whiteSpace="nowrap" color="gray.500" fontSize={14}>
        {text}
      </Text>
      <Separator flex={1} borderColor="gray.200" />
    </Flex>
  )
}

export { TextWithDivider }

import { Flex, Text } from '@chakra-ui/react'

interface P {
  title: string
  text: string
  titleFontSize?: number
  textFontSize?: number
}

const HeaderWithText = ({
  title,
  text,
  titleFontSize = 18,
  textFontSize = 14,
}: P) => {
  return (
    <Flex direction="column">
      <Text fontSize={titleFontSize}>{title}</Text>
      <Text color="gray.500" fontSize={textFontSize}>
        {text}
      </Text>
    </Flex>
  )
}

export { HeaderWithText }

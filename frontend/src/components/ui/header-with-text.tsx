import { Flex, Text } from '@chakra-ui/react'
import type { TextProps } from '@chakra-ui/react'

interface P {
  title: string
  text?: string
  titleFontSize?: TextProps['fontSize']
  textFontSize?: TextProps['fontSize']
  hideText?: boolean
}

const DEFAULT_TITLE_SIZE: TextProps['fontSize'] = 18
const DEFAULT_TEXT_SIZE: TextProps['fontSize'] = 14

const HeaderWithText = ({
  title,
  text,
  titleFontSize = DEFAULT_TITLE_SIZE,
  textFontSize = DEFAULT_TEXT_SIZE,
  hideText = false,
}: P) => {
  return (
    <Flex direction="column">
      <Text fontSize={titleFontSize}>{title}</Text>
      {!hideText && (
        <Text color="gray.500" fontSize={textFontSize}>
          {text}
        </Text>
      )}
    </Flex>
  )
}

export { HeaderWithText }

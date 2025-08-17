import { Flex, Spinner } from '@chakra-ui/react'

const AppSpinner = () => {
  return (
    <Flex
      justifySelf="center"
      alignItems="center"
      justifyContent="center"
      w="full"
      height="full"
    >
      <Spinner size="lg" color="colorPalette.600" colorPalette="blue" />
    </Flex>
  )
}

export { AppSpinner }

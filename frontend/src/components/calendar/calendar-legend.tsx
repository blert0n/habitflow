import { Box, Separator, Text } from '@chakra-ui/react'

const CalendarLegend = () => {
  return (
    <Box
      bg="white"
      borderRadius="lg"
      borderWidth="1px"
      borderColor="gray.200"
      fontSize="sm"
      p={4}
      width="full"
      height={{ base: '', sm: 'full' }}
    >
      <Box mb={3}>
        <Text mb={1}>Legend</Text>
        <Separator />
      </Box>
      <Box mb={2} display="flex" alignItems="center" gap={2} cursor="pointer">
        <Box w="20px" h="20px" bg="red.500" rounded="full" />
        <Text color="gray.700">Morning exercise</Text>
      </Box>
      <Box mb={2} display="flex" alignItems="center" gap={2} cursor="pointer">
        <Box w="20px" h="20px" bg="green.500" rounded="full" />
        <Text color="gray.700">Read 30 minutes</Text>
      </Box>
      <Box mb={2} display="flex" alignItems="center" gap={2} cursor="pointer">
        <Box w="20px" h="20px" bg="blue.500" rounded="full" />
        <Text color="gray.700">Meditation</Text>
      </Box>
      <Box mb={2} display="flex" alignItems="center" gap={2} cursor="pointer">
        <Box w="20px" h="20px" bg="purple.500" rounded="full" />
        <Text color="gray.700">Drink 8 glasses of water</Text>
      </Box>
    </Box>
  )
}

export { CalendarLegend }

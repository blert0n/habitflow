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
      <Box mb={2} display="flex" alignItems="center" gap={2}>
        <Box w="20px" h="20px" bg="gray.900" rounded="full" />
        Selected Day
      </Box>
      <Box mb={2} display="flex" alignItems="center" gap={2} rounded="full">
        <Box
          w="20px"
          h="20px"
          bg="gray.100"
          rounded="full"
          border="1px solid"
          borderColor="gray.300"
        />
        Hover Day
      </Box>
      <Box mb={2} display="flex" alignItems="center" gap={2}>
        <Box w="20px" h="20px" bg="gray.400" rounded="full" />
        Other Month
      </Box>
    </Box>
  )
}

export { CalendarLegend }

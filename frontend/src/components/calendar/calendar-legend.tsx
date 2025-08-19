import { Box, Separator, Text } from '@chakra-ui/react'
import { AppEmptyState } from '../ui/empty-state'
import type { Habit } from '@/types/habits'

interface P {
  habits: Array<Habit>
}

const CalendarLegend = ({ habits }: P) => {
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
      {habits.map((habit) => (
        <Box
          key={habit.id}
          mb={2}
          display="flex"
          alignItems="center"
          gap={2}
          cursor="pointer"
        >
          <Box w="20px" h="20px" bg={habit.color} rounded="full" />
          <Text color="gray.700">{habit.name}</Text>
        </Box>
      ))}
      {habits.length === 0 && (
        <Box mb={2} display="flex" alignItems="center" gap={2} cursor="pointer">
          <AppEmptyState circleSize={12} iconSize={24} title="Calendar empty" />
        </Box>
      )}
    </Box>
  )
}

export { CalendarLegend }

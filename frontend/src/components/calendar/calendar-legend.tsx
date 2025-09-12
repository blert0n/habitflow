import { Box, Separator, Text } from '@chakra-ui/react'
import { AppEmptyState } from '../ui/empty-state'
import type { Habit } from '@/types/habits'

interface P {
  habits: Array<Habit & { selected: boolean }>
  onHabitVisibilityChange: (id: number) => void
}

const CalendarLegend = ({ habits, onHabitVisibilityChange }: P) => {
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
          <Box
            w="20px"
            h="20px"
            bg={habit.selected ? habit.color : 'gray.300'}
            rounded="full"
            display="flex"
            justifyContent="center"
            alignItems="center"
            _hover={{ scale: 1.1 }}
            onClick={() => {
              onHabitVisibilityChange(habit.id)
            }}
          >
            {habit.selected && (
              <Box w="8px" h="8px" bg="white" rounded="full" />
            )}
          </Box>
          <Text color={habit.selected ? 'gray.700' : 'gray.500'}>
            {habit.name}
          </Text>
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

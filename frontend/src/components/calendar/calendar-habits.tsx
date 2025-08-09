import { Box, Flex, Separator } from '@chakra-ui/react'
import dayjs from 'dayjs'
import { HeaderWithText } from '../ui/header-with-text'
import { Habit } from '../habits/habit'

const habits = [
  {
    title: 'Morning exercise',
    description: '30 minutes workout',
    checked: true,
  },
  {
    title: 'Read 30 minutes',
    description: 'Personal development',
    checked: true,
  },
  {
    title: 'Meditation',
    description: '10 minutes mindfulness',
    checked: false,
  },
  {
    title: 'Drink 8 glasses of water',
    description: 'Stay hydrated',
    checked: false,
  },
]

const CalendarHabits = () => {
  const date = dayjs()
  const today = `${date.format('DD MMM')}, ${date.format('YYYY')}`

  return (
    <Box
      bg="white"
      borderRadius="lg"
      borderWidth="1px"
      borderColor="gray.200"
      fontSize="sm"
      p={4}
      width="full"
    >
      <Box mb={3}>
        <HeaderWithText
          title={today}
          text="Today's habits"
          titleFontSize={14}
        />
        <Separator />
      </Box>
      <Flex direction="column" gap={2}>
        {habits.map((habit) => (
          <Habit
            key={habit.title}
            title={habit.title}
            description={habit.description}
            checked={habit.checked}
          />
        ))}
      </Flex>
    </Box>
  )
}

export { CalendarHabits }

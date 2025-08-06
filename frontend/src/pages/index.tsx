import { Flex } from '@chakra-ui/react/flex'
import { Text } from '@chakra-ui/react/text'
import { Separator } from '@chakra-ui/react'
import { HeaderWithText } from '../components/ui/header-with-text'
import { StatCards } from '../components/dashboard/stat-cards'
import { Habit } from '../components/habits/habit'
import { CalendarSm } from '../components/calendar/calendar-sm'
import { Note } from '../components/notes/note'
import { formatFriendlyDate } from '../util/dates'

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

const notes = [
  {
    title: 'Morning Routine Reflection',
    note: 'Felt great after the morning workout. Need to focus more on proper form during exercises.',
    date: new Date('2025-08-05T08:30:00'),
  },
  {
    title: 'Book Notes',
    note: 'Atomic Habits - Chapter 3: Small changes compound over time. Focus on systems, not goals.',
    date: new Date('2025-08-04T22:15:00'),
  },
  {
    title: 'Weekly Planning',
    note: 'Outlined goals for the upcoming week. Need to prioritize sleep and evening routines.',
    date: new Date('2025-07-29T19:45:00'),
  },
  {
    title: 'Evening Reflection',
    note: 'Felt distracted today. Will try the Pomodoro method tomorrow.',
    date: new Date('2025-08-01T21:05:00'),
  },
]

function App() {
  return (
    <div className="full-width" style={{ paddingBottom: '60px' }}>
      <Flex direction="column" gap={4} flex={1} width="full">
        <HeaderWithText
          title="Hello!"
          text="Let's build some great habits today!"
        />
        <StatCards />
        <Flex direction={{ base: 'column', md: 'row' }} gap={2}>
          <Flex
            direction="column"
            flex={1}
            padding={{ base: 4, md: 2 }}
            gap={2}
            bg="white"
            borderRadius="lg"
            borderWidth="1px"
            borderColor="gray.200"
            height={{ base: 'auto', md: '415px' }}
            overflowY={{ base: 'visible', md: 'auto' }}
          >
            <Text color="gray.800" fontSize={16}>
              Today's habits
            </Text>
            <Separator />
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
          </Flex>
          <Flex
            direction="column"
            justifyContent="space-between"
            flex={1}
            width="full"
            height={{ base: 'auto', md: '415px' }}
            overflowY={{ base: 'visible', md: 'auto' }}
          >
            <CalendarSm />
          </Flex>
        </Flex>
        <Flex
          direction="column"
          flex={1}
          padding={{ base: 4, md: 2 }}
          gap={2}
          bg="white"
          borderRadius="lg"
          borderWidth="1px"
          borderColor="gray.200"
        >
          <Text color="gray.800" fontSize={16}>
            Quck Notes
          </Text>
          <Separator />
          <Flex direction="column" gap={2}>
            {notes.map((note) => (
              <Note
                key={note.title}
                title={note.title}
                note={note.note}
                date={formatFriendlyDate(note.date)}
              />
            ))}
          </Flex>
        </Flex>
      </Flex>
    </div>
  )
}

export default App

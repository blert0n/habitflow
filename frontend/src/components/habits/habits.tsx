import { Flex } from '@chakra-ui/react/flex'
import { Button, HStack, SimpleGrid } from '@chakra-ui/react'
import { FilterIcon, Plus } from 'lucide-react'
import { useState } from 'react'
import { HeaderWithText } from '../ui/header-with-text'
import { ListHabit } from './list-habit'
import { Create } from './create/create'
import type { AllowedDayString } from './types'
import { useCategories } from '@/hooks/useCategories'

const MOCK_HABITS = [
  {
    id: 1,
    name: 'Morning Exercise',
    categoryId: 1,
    description: 'Do a quick workout to wake up and get energized.',
    selectedDays: ['Mon', 'Wed', 'Fri'],
    frequency: 'DTSTART:20250817T050000Z\nRRULE:FREQ=WEEKLY;BYDAY=MO,WE,FR',
  },
  {
    id: 2,
    name: 'Read 30 mins',
    categoryId: 3,
    description: 'Read a book or article for at least 30 minutes.',
    selectedDays: ['Tuesday', 'Thursday', 'Sat'],
    frequency: 'DTSTART:20250817T050000Z\nRRULE:FREQ=WEEKLY;BYDAY=TU,TH,SA',
  },
  {
    id: 3,
    name: 'Meditation',
    categoryId: 4,
    description: 'Spend some quiet time meditating or breathing deeply.',
    selectedDays: ['Sun', 'Mon', 'Wed', 'Fri'],
    frequency: 'DTSTART:20250817T050000Z\nRRULE:FREQ=WEEKLY;BYDAY=SU,MO,WE,FR',
  },
  {
    id: 4,
    name: 'Drink Water',
    categoryId: 4,
    description: 'Make sure to drink enough water throughout the day.',
    selectedDays: [],
    isDaily: true,
    frequency: 'DTSTART:20250817T050000Z\nRRULE:FREQ=DAILY',
  },
  {
    id: 5,
    name: 'Sleep 8 hours',
    categoryId: 3,
    description: 'Pick up a book and read for half an hour.',
    selectedDays: [],
    isDaily: true,
    frequency: 'DTSTART:20250817T050000Z\nRRULE:FREQ=DAILY',
  },
  {
    id: 6,
    name: 'Journal Writing',
    categoryId: 4,
    description: 'Write down your thoughts, plans, or feelings daily.',
    selectedDays: ['Sunday', 'Tuesday', 'Thursday', 'Sat'],
    frequency: 'DTSTART:20250817T050000Z\nRRULE:FREQ=WEEKLY;BYDAY=SU,TU,TH,SA',
  },
]

const Habits = () => {
  const [showCreateView, setShowCreateView] = useState(true)
  const { categories } = useCategories()

  if (showCreateView) {
    return (
      <Create
        onBack={() => {
          setShowCreateView(false)
        }}
      />
    )
  }
  return (
    <Flex direction="column" height="100%">
      <Flex
        justify="space-between"
        alignItems={{ base: 'start', sm: 'space-between' }}
        marginBottom={4}
        direction={{ base: 'column', sm: 'row' }}
        gap={2}
      >
        <HeaderWithText
          title="All habits"
          text="Manage and track all of your habits"
        />
        <Flex gap={4}>
          <HStack>
            <Button bg="white" variant="outline" size="sm">
              <FilterIcon /> Filter
            </Button>
            <Button
              bg="brand.primary"
              size="xs"
              onClick={() => {
                setShowCreateView(true)
              }}
            >
              <Plus /> New habit
            </Button>
          </HStack>
        </Flex>
      </Flex>
      <SimpleGrid
        columns={{ base: 2, sm: 3 }}
        columnGap="2"
        rowGap="4"
        minChildWidth={{ base: 'full', sm: '256px' }}
      >
        {MOCK_HABITS.map((habit) => (
          <ListHabit
            key={habit.id}
            title={habit.name}
            text={habit.description}
            selectedDays={habit.selectedDays as Array<AllowedDayString>}
            isDaily={habit.isDaily}
            category={categories.find(
              (category) => category.id === habit.categoryId,
            )}
          />
        ))}
      </SimpleGrid>
    </Flex>
  )
}

export { Habits }

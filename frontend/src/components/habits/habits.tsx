import { Flex } from '@chakra-ui/react/flex'
import { Button, HStack, SimpleGrid } from '@chakra-ui/react'
import { FilterIcon, Plus } from 'lucide-react'
import { useState } from 'react'
import { HeaderWithText } from '../ui/header-with-text'
import { ListHabit } from './list-habit'
import { Create } from './create/create'

const MOCK_HABITS = [
  {
    id: 1,
    name: 'Morning Exercise',
  },
  {
    id: 2,
    name: 'Read 30 mins',
  },
  {
    id: 3,
    name: 'Meditation',
  },
  {
    id: 4,
    name: 'Drink Water',
  },
  {
    id: 5,
    name: 'Read 30 minutes',
  },
  {
    id: 6,
    name: 'Sleep 8 Hours',
  },
  {
    id: 7,
    name: 'Sleep 8 Hours',
  },
  {
    id: 8,
    name: 'Sleep 8 Hours',
  },
]

const Habits = () => {
  const [showCreateView, setShowCreateView] = useState(true)

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
            text="description"
            category={1}
          />
        ))}
      </SimpleGrid>
    </Flex>
  )
}

export { Habits }

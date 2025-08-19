import { Flex } from '@chakra-ui/react/flex'
import { Button, HStack, SimpleGrid } from '@chakra-ui/react'
import { FilterIcon, Plus } from 'lucide-react'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { HeaderWithText } from '../ui/header-with-text'
import { ListHabit } from './list-habit'
import { Create } from './create/create'
import { LoadingHabit } from './loading-habit'
import { EmptyState } from './empty-state'
import type { CreateHabitPayload, Habit } from '@/types/habits'
import { useCategories } from '@/hooks/useCategories'
import { client } from '@/util/client'

const Habits = () => {
  const [showCreateView, setShowCreateView] = useState(false)
  const { categories } = useCategories()

  const { data: habits, isLoading: isLoadingHabits } = useQuery<
    Array<Habit>,
    Error
  >({
    queryKey: ['listHabits'],
    queryFn: () => client('/habits'),
  })

  const queryClient = useQueryClient()

  const createHabitMutation = useMutation({
    mutationFn: (newHabit: CreateHabitPayload) =>
      client('/habits', {
        method: 'POST',
        body: JSON.stringify(newHabit),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listHabits'] })
      setShowCreateView(false)
    },
  })
  const deleteHabitMutation = useMutation({
    mutationFn: (id: number) =>
      client('/habits', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listHabits'] })
    },
  })

  if (showCreateView) {
    return (
      <Create
        onCreate={(data) => createHabitMutation.mutate(data)}
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
        {isLoadingHabits &&
          Array.from({ length: 6 }).map((_, index) => (
            <LoadingHabit key={index} />
          ))}

        {!isLoadingHabits && !habits?.length && (
          <EmptyState
            toggleCreateView={() => {
              setShowCreateView((prev) => !prev)
            }}
          />
        )}
        {!isLoadingHabits &&
          (habits?.length ?? 0) > 0 &&
          (habits ?? []).map((habit) => (
            <ListHabit
              key={habit.id}
              title={habit.name}
              text={habit.description}
              selectedDays={habit.selectedDays ?? []}
              isDaily={habit.isDaily}
              category={categories.find(
                (category) => category.id === habit.categoryid,
              )}
              onDelete={() => {
                deleteHabitMutation.mutate(habit.id)
              }}
            />
          ))}
      </SimpleGrid>
    </Flex>
  )
}

export { Habits }

import { Flex } from '@chakra-ui/react/flex'
import { Button, HStack, SimpleGrid } from '@chakra-ui/react'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { HeaderWithText } from '../ui/header-with-text'
import { toaster } from '../ui/toaster'
import { ListHabit } from './list-habit'
import { Create } from './create/create'
import { LoadingHabit } from './loading-habit'
import { EmptyState } from './empty-state'
import type {
  CreateHabitPayload,
  EditHabitPayload,
  Habit,
} from '@/types/habits'
import { useCategories } from '@/hooks/useCategories'
import { client } from '@/util/client'

const Habits = () => {
  const [showCreateView, setShowCreateView] = useState(false)
  const { categories } = useCategories()
  const [editing, setEditing] = useState<Habit | undefined>()

  const { data: habits, isLoading: isLoadingHabits } = useQuery<
    Array<Habit>,
    Error
  >({
    queryKey: ['listHabits'],
    queryFn: () => client('/habits/list'),
  })

  const queryClient = useQueryClient()

  const createHabitMutation = useMutation({
    mutationFn: (newHabit: CreateHabitPayload) =>
      client('/habits/create', {
        method: 'POST',
        body: JSON.stringify(newHabit),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listHabits'] })
      setShowCreateView(false)
      setEditing(undefined)
      toaster.create({
        type: 'success',
        title: 'Habit created successfully.',
      })
    },
    onError: () => {
      setShowCreateView(false)
      setEditing(undefined)
      toaster.create({
        type: 'Failed to create the habit',
        title: 'Habit created successfully.',
      })
    },
  })

  const editHabitMutation = useMutation({
    mutationFn: (editedHabit: EditHabitPayload) =>
      client('/habits/edit', {
        method: 'POST',
        body: JSON.stringify(editedHabit),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listHabits'] })
      setShowCreateView(false)
      setEditing(undefined)
      toaster.create({
        type: 'success',
        title: 'Habit updated successfully.',
      })
    },
    onError: () => {
      setShowCreateView(false)
      setEditing(undefined)
      toaster.create({
        type: 'error',
        title: 'Failed to update the habit.',
      })
    },
  })

  const deleteHabitMutation = useMutation({
    mutationFn: (id: number) =>
      client('/habits/delete', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listHabits'] })
      toaster.create({
        type: 'success',
        title: 'Habit deleted successfully.',
      })
    },
    onError: () => {
      toaster.create({
        type: 'success',
        title: 'Failed to delete the habit',
      })
    },
  })

  const isLoading =
    createHabitMutation.isPending ||
    editHabitMutation.isPending ||
    deleteHabitMutation.isPending

  if (showCreateView || editing) {
    return (
      <Create
        editing={editing}
        onSubmit={(data) => {
          editing?.id
            ? editHabitMutation.mutate({
                id: editing.id,
                ...data,
              })
            : createHabitMutation.mutate(data)
        }}
        onBack={() => {
          setShowCreateView(false)
          setEditing(undefined)
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
      {!isLoadingHabits && !habits?.length && !isLoading && (
        <EmptyState
          toggleCreateView={() => {
            setShowCreateView((prev) => !prev)
          }}
        />
      )}
      <SimpleGrid
        columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
        gap={2}
        justifyContent="start"
      >
        {(isLoadingHabits || isLoading) &&
          Array.from({ length: 6 }).map((_, index) => (
            <LoadingHabit key={index} />
          ))}

        {!isLoadingHabits &&
          (habits?.length ?? 0) > 0 &&
          !isLoading &&
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
              onEdit={() => {
                setEditing(habit)
              }}
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

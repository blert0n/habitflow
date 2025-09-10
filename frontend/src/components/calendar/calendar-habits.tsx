import { Box, Flex, Separator } from '@chakra-ui/react'
import { HeaderWithText } from '../ui/header-with-text'
import { Habit } from '../habits/habit'
import { Pagination } from '../ui/pagination'
import { HabitSkeletonSm } from '../habits/loading-habit-sm'
import { AppEmptyState } from '../ui/empty-state'
import type { Dayjs } from 'dayjs'
import type { HabitsByDate } from '@/types/habits'
import { useCompleteHabits } from '@/hooks/useCompleteHabits'

interface P {
  date: Dayjs
  habits?: HabitsByDate['data']
  total?: number
  page: number
  isLoading?: boolean
  onPageChange: (page: number) => void
}

const CalendarHabits = ({
  date,
  habits,
  page,
  isLoading,
  total,
  onPageChange,
}: P) => {
  const today = `${date.format('DD MMM')}, ${date.format('YYYY')}`
  const { checkingId, isChecking, onCheck, onCheckingIdChange } =
    useCompleteHabits()

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
        {isLoading && <HabitSkeletonSm count={4} />}
        {!isLoading && (habits?.length ?? 0) > 0 && (
          <>
            {habits?.map((habit) => (
              <Habit
                id={habit.id}
                key={habit.id}
                title={habit.name}
                description={habit.description}
                checked={habit.isCompleted}
                isChecking={isChecking && checkingId === habit.id}
                onCheck={() => {
                  onCheckingIdChange(habit.id, date)
                  onCheck(habit.id, habit.isCompleted, date)
                }}
              />
            ))}
            <Pagination
              totalCount={total ?? 0}
              page={page}
              pageSize={5}
              hideNumbers
              onPageChange={(newPage) => {
                onPageChange(newPage)
              }}
            />
          </>
        )}
        {!isLoading && !habits?.length && (
          <AppEmptyState
            circleSize={12}
            iconSize={24}
            title="Nothing planned yet 😴"
            description="Good day for a fresh start! Create a habit and take a step toward your goals."
          />
        )}
      </Flex>
    </Box>
  )
}

export { CalendarHabits }

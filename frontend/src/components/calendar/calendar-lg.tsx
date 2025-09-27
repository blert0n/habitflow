import { Flex } from '@chakra-ui/react/flex'
import { Spacer } from '@chakra-ui/react/spacer'
import { Box } from '@chakra-ui/react'
import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { CalendarDayLg } from './calendar-day-lg'
import { CalendarLegend } from './calendar-legend'
import { CalendarHabits } from './calendar-habits'
import { CalendarDayLgSkeleton } from './calendar-day-lg-skeleton'
import {
  DateHeaderMonthView,
  DateHeaderWeekView,
  HabitListWeekView,
} from './day-headers'
import { DayView } from './day-view'
import type { Habit, HabitsByDate, HabitsMatrix } from '@/types/habits'
import { HeaderWithText } from '@/components/ui/header-with-text'
import { CalendarHeader } from '@/components/calendar/calendar-header'
import { useCalendar } from '@/hooks/useCalendar'
import { ISO_WEEK_DAYS, NORMALIZED_FORMAT } from '@/util/dates'
import { client } from '@/util/client'

type SelectedHabit = Habit & { selected: boolean }

const getUniqueHabits = (matrix?: HabitsMatrix): Array<SelectedHabit> => {
  if (!matrix) return []
  const allHabits = Object.values(matrix).flat()
  const uniqueHabits = new Map<number | string, SelectedHabit>()

  for (const habit of allHabits) {
    uniqueHabits.set(habit.id, { ...habit, selected: true })
  }

  return Array.from(uniqueHabits.values())
}

const CalendarLg = () => {
  const [habitsDate, setHabitsDate] = useState(dayjs())
  const [page, setPage] = useState(1)

  const { data: habitsByDate, isLoading: isLoadingByDate } = useQuery<
    HabitsByDate,
    Error
  >({
    queryKey: ['habits', habitsDate, page],
    queryFn: () =>
      client(
        `/habits/by-date?date=${habitsDate.format('YYYY-MM-DD')}&page=${page}`,
      ),
    staleTime: 1000 * 60 * 5,
  })

  const {
    view,
    currentDate,
    handleMonthChange,
    handleNextMonth,
    handlePrevMonth,
    handleYearChange,
    calendarMatrix,
    selectedDate,
    handleSelectedDateChange,
    handleViewChange,
  } = useCalendar({})

  const allDays = calendarMatrix.flat()

  const startMatrixDate = allDays.at(0)?.subtract(1, 'day').format('YYYY-MM-DD')
  const endMatrixDate = allDays.at(-1)?.add(1, 'day').format('YYYY-MM-DD')

  const { data: habitsMatrix, isLoading: isLoadingMatrix } = useQuery<
    HabitsMatrix,
    Error
  >({
    queryKey: ['habitsMatrix', startMatrixDate, endMatrixDate],
    queryFn: () =>
      client(
        `/habits/matrix?startDate=${startMatrixDate}&endDate=${endMatrixDate}`,
      ),
    staleTime: 1000 * 60 * 5,
  })

  const activeHabits = useMemo(
    () => getUniqueHabits(habitsMatrix),
    [habitsMatrix],
  )

  const [visibleHabits, setVisibleHabits] = useState(activeHabits)

  useEffect(() => {
    setVisibleHabits(activeHabits)
  }, [activeHabits])

  const onHabitVisibilityChange = (id: number) => {
    setVisibleHabits((prev) =>
      prev.map((habit) => {
        if (habit.id !== id) return habit
        return {
          ...habit,
          selected: !habit.selected,
        }
      }),
    )
  }

  return (
    <Flex direction="column" marginBottom={4} height="100%">
      <HeaderWithText title="Calendar" text="Track your habits across time!" />
      <Spacer marginBottom={4} />
      <Flex
        gap={4}
        height="100%"
        direction={{ base: 'column-reverse', lg: 'row' }}
      >
        <Box
          flex={{ base: 'none', lg: 2 }}
          bg="white"
          borderRadius="lg"
          borderWidth="1px"
          borderColor="gray.200"
          p={3}
          display="flex"
          flexDirection="column"
          height="100%"
          overflowX="auto"
          minW={0}
        >
          <Box mb={3}>
            <CalendarHeader
              view={view}
              currentDate={currentDate}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onMonthChange={handleMonthChange}
              onYearChange={handleYearChange}
              onViewChange={(updatedView) => {
                handleViewChange(updatedView)
              }}
            />
          </Box>
          <Flex justify="center" gap={1} mb={2}>
            {view === 'Day' && (
              <DayView
                habits={habitsMatrix?.[currentDate.format(NORMALIZED_FORMAT)]}
                date={currentDate.format(NORMALIZED_FORMAT)}
              />
            )}
            {view === 'Week' && (
              <Box
                flex={1}
                bg="white"
                display="grid"
                gridTemplateColumns={{
                  base: '80px repeat(7, 1fr)',
                  sm: '100px repeat(7, 1fr)',
                  md: '120px repeat(7, 1fr)',
                  lg: '140px repeat(7, 1fr)',
                }}
                gridAutoRows="1fr"
                gap={1}
                gapY={3}
                height="100%"
                overflowX="auto"
                py={4}
                textAlign="center"
                alignItems="center"
                justifyItems="center"
                minW="100%"
                w="100%"
              >
                <HabitListWeekView habits={visibleHabits} />
                {allDays.map((day, index) => (
                  <DateHeaderWeekView
                    key={`date-header-${index}`}
                    date={day}
                    habits={habitsMatrix?.[day.format(NORMALIZED_FORMAT)]}
                    visibleHabits={visibleHabits}
                  />
                ))}
              </Box>
            )}
            {view === 'Month' &&
              ISO_WEEK_DAYS.map((day) => (
                <DateHeaderMonthView key={day} day={day} />
              ))}
          </Flex>

          {view === 'Month' && (
            <Box
              flex={1}
              bg="white"
              display="grid"
              gridTemplateColumns="repeat(7, 1fr)"
              gridAutoRows="1fr"
              gap={1}
              gapY={3}
              height="100%"
              overflowX="auto"
              py={4}
            >
              {isLoadingMatrix
                ? allDays.map((day) => (
                    <CalendarDayLgSkeleton key={day.toISOString()} />
                  ))
                : allDays.map((day) => (
                    <CalendarDayLg
                      key={day.toISOString()}
                      day={day}
                      currentDate={currentDate}
                      selectedDate={selectedDate}
                      habits={habitsMatrix?.[day.format('YYYY-MM-DD')] ?? []}
                      visibleHabits={visibleHabits}
                      onSelect={(date) => {
                        handleSelectedDateChange(date)
                        setHabitsDate(date)
                        setPage(1)
                      }}
                    />
                  ))}
            </Box>
          )}
        </Box>
        {view !== 'Day' && (
          <Flex
            flex={1}
            gap={4}
            minWidth={0}
            width="full"
            direction={{ base: 'column', md: 'row', lg: 'column' }}
            mb={{ base: 4, lg: 0 }}
            maxW={{ base: '100%', lg: '320px' }}
            alignItems="stretch"
          >
            <Box flex={1} display="flex">
              <CalendarHabits
                date={habitsDate}
                habits={habitsByDate?.data}
                total={habitsByDate?.totalCount}
                page={page}
                onPageChange={(newPage) => {
                  setPage(newPage)
                }}
                isLoading={isLoadingByDate}
              />
            </Box>
            <Box flex={1} display="flex">
              <CalendarLegend
                habits={visibleHabits}
                onHabitVisibilityChange={onHabitVisibilityChange}
              />
            </Box>
          </Flex>
        )}
      </Flex>
    </Flex>
  )
}

export { CalendarLg }

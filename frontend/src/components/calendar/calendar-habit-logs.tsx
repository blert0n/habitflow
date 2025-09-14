import { Box, Flex, Spacer, Text } from '@chakra-ui/react'
import dayjs from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import { useEffect } from 'react'
import { CalendarHeader } from './calendar-header'
import { CalendarDayLog } from './calendar-day-log'
import type { Dayjs } from 'dayjs'
import type { HabitLog } from '@/types/habits'
import { useCalendar } from '@/hooks/useCalendar'
import { NORMALIZED_FORMAT, WEEK_DAYS } from '@/util/dates'

dayjs.extend(isSameOrBefore)

interface CalendarHabitLogsProps {
  selectedDate?: Dayjs | null
  onDateChange?: (date: Dayjs) => void
  completionLogs?: Record<string, HabitLog>
}

const CalendarHabitLogs = ({
  selectedDate,
  onDateChange,
  completionLogs,
}: CalendarHabitLogsProps) => {
  const {
    currentDate,
    calendarMatrix,
    handleMonthChange,
    handleNextMonth,
    handlePrevMonth,
    handleYearChange,
  } = useCalendar({
    initialDate: selectedDate ?? dayjs(),
  })

  useEffect(() => {
    onDateChange?.(currentDate)
  }, [currentDate, onDateChange])

  const getStatusForDate = (
    date: string,
  ): 'not-scheduled' | 'completed' | 'missed' | 'yet' => {
    const today = dayjs().startOf('day')
    const targetDate = dayjs(date, NORMALIZED_FORMAT)

    if (!completionLogs) return 'not-scheduled'

    if (date in completionLogs && targetDate.isAfter(today)) return 'yet'

    if (!(date in completionLogs)) return 'not-scheduled'
    return completionLogs[date].completed ? 'completed' : 'missed'
  }

  return (
    <Box bg="white" flex={1} p={4} borderRadius="lg" overflowY="hidden">
      <CalendarHeader
        currentDate={currentDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onMonthChange={handleMonthChange}
        onYearChange={handleYearChange}
      />
      <Spacer marginTop={4} />
      <Box
        maxWidth={{ base: 'full', sm: '500px' }}
        height={{ base: 'auto', md: '415px' }}
        margin="auto"
      >
        <Flex direction="column" gap={2} overflowY="hidden">
          <Flex justify="center" mb={6} gap={1}>
            {WEEK_DAYS.map((day) => (
              <Box key={day} w={{ base: 'full', sm: 12 }}>
                <Text
                  key={day}
                  fontSize="xs"
                  textAlign="center"
                  color="gray.500"
                >
                  {day}
                </Text>
              </Box>
            ))}
          </Flex>
          {calendarMatrix.map((week, rowIndex) => (
            <Flex key={rowIndex} justify="center" gap={1}>
              {week.map((day) => {
                const markStatus = getStatusForDate(
                  day.format(NORMALIZED_FORMAT),
                )
                return (
                  <Box key={day.toISOString()} w={{ base: 'full', sm: 12 }}>
                    <CalendarDayLog
                      day={day}
                      currentDate={currentDate}
                      markStatus={markStatus}
                    />
                  </Box>
                )
              })}
            </Flex>
          ))}
        </Flex>
      </Box>
    </Box>
  )
}

export { CalendarHabitLogs }

import { Box, Flex, Spacer, Text } from '@chakra-ui/react'
import dayjs from 'dayjs'
import { CalendarDay } from './calendar-day'
import { CalendarHeader } from './calendar-header'
import type { Dayjs } from 'dayjs'
import { useCalendar } from '@/hooks/useCalendar'
import { WEEK_DAYS } from '@/util/dates'

interface CalendarSmProps {
  selectedDate?: Dayjs | null
  onDateChange?: (date: Dayjs) => void
}

const CalendarSm = ({ selectedDate, onDateChange }: CalendarSmProps) => {
  const {
    currentDate,
    calendarMatrix,
    handleMonthChange,
    handleNextMonth,
    handlePrevMonth,
    handleYearChange,
    handleSelectedDateChange,
    selectedDate: calendarSelectedDate,
  } = useCalendar({ initialDate: selectedDate ?? dayjs() })

  return (
    <Box
      bg="white"
      flex={1}
      p={4}
      borderRadius="lg"
      borderWidth="1px"
      borderColor="gray.200"
    >
      <CalendarHeader
        currentDate={currentDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onMonthChange={handleMonthChange}
        onYearChange={handleYearChange}
      />
      <Spacer marginTop={4} />

      <Flex justify="center" mb={6} gap={1}>
        {WEEK_DAYS.map((day) => (
          <Text
            key={day}
            fontSize="xs"
            flex="1"
            maxW="1/7"
            textAlign="center"
            color="gray.500"
          >
            {day}
          </Text>
        ))}
      </Flex>

      <Flex direction="column" gap={2} overflowY="hidden">
        {calendarMatrix.map((week, rowIndex) => (
          <Flex key={rowIndex} justify="center" gap={1}>
            {week.map((day) => (
              <Box key={day.toISOString()} flex="1" maxW="1/7">
                <CalendarDay
                  day={day}
                  currentDate={currentDate}
                  selectedDate={calendarSelectedDate}
                  onSelect={(date) => {
                    onDateChange?.(date)
                    handleSelectedDateChange(date)
                  }}
                />
              </Box>
            ))}
          </Flex>
        ))}
      </Flex>
    </Box>
  )
}

export { CalendarSm }

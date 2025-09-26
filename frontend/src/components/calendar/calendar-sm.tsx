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
      borderRadius="xl"
      borderWidth="1px"
      borderColor="gray.200"
      overflowY="auto"
      overflowX="visible"
      transition="all 0.2s ease"
    >
      <CalendarHeader
        currentDate={currentDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onMonthChange={handleMonthChange}
        onYearChange={handleYearChange}
      />
      <Spacer marginTop={4} />

      <Flex justify="center" mb={4} gap={1}>
        {WEEK_DAYS.map((day) => (
          <Box
            key={day}
            flex="1"
            maxW="1/7"
            py={2}
            borderBottom="2px solid"
            borderColor="gray.100"
            position="relative"
            _after={{
              content: '""',
              position: 'absolute',
              bottom: '-2px',
              left: '20%',
              right: '20%',
              height: '2px',
              background:
                'linear-gradient(to right, transparent, #e4e4e7, transparent)',
            }}
          >
            <Text
              fontSize="xs"
              textAlign="center"
              color="gray.600"
              fontWeight="semibold"
              letterSpacing="wide"
            >
              {day}
            </Text>
          </Box>
        ))}
      </Flex>

      <Flex direction="column" gap={3} overflow="visible" px={2}>
        {calendarMatrix.map((week, rowIndex) => (
          <Flex key={rowIndex} justify="center" gap={2} overflow="visible">
            {week.map((day) => (
              <Box
                key={day.toISOString()}
                flex="1"
                maxW="1/7"
                position="relative"
                overflow="visible"
                px={1}
              >
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

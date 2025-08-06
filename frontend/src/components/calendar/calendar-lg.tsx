import { Flex } from '@chakra-ui/react/flex'
import { Spacer } from '@chakra-ui/react/spacer'
import { Box, Separator } from '@chakra-ui/react'
import { CalendarDayLg } from './calendar-day-lg'
import { CalendarLegend } from './calendar-legend'
import { CalendarHabits } from './calendar-habits'
import { HeaderWithText } from '@/components/ui/header-with-text'
import { CalendarHeader } from '@/components/calendar/calendar-header'
import { useCalendar } from '@/hooks/useCalendar'
import { WEEK_DAYS } from '@/util/dates'

const CalendarLg = () => {
  const {
    currentDate,
    handleMonthChange,
    handleNextMonth,
    handlePrevMonth,
    handleYearChange,
    calendarMatrix,
    selectedDate,
  } = useCalendar()

  const allDays = calendarMatrix.flat()

  return (
    <Flex direction="column" marginY={4} height="100%">
      <HeaderWithText title="Calendar" text="Track your habits across time!" />
      <Spacer marginBottom={4} />
      <Flex gap={4} height="100%" direction={{ base: 'column', md: 'row' }}>
        <Flex
          flex={1}
          gap={2}
          minWidth={0}
          width="full"
          justifyContent="space-between"
          direction={{ base: 'row', md: 'column' }}
          mb={{ base: 4, md: 0 }}
        >
          <CalendarHabits />
          <CalendarLegend />
        </Flex>
        <Box
          flex={{ base: 'none', midMd: 2 }}
          bg="white"
          borderRadius="lg"
          borderWidth="1px"
          borderColor="gray.200"
          p={3}
          display="flex"
          flexDirection="column"
          height="100%"
        >
          <CalendarHeader
            currentDate={currentDate}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onMonthChange={handleMonthChange}
            onYearChange={handleYearChange}
          />
          <Separator marginY={3} />
          {/* Weekday Labels */}
          <Flex justify="center" gap={1} mb={2}>
            {WEEK_DAYS.map((day) => (
              <Box
                key={day}
                padding={1}
                w="100%"
                textAlign="center"
                fontWeight="semibold"
                color="gray.700"
              >
                {day}
              </Box>
            ))}
          </Flex>
          <Box
            flex={1}
            bg="white"
            display="grid"
            gridTemplateColumns="repeat(7, 1fr)"
            gridAutoRows="1fr"
            gap={1}
            height="100%"
            overflow="hidden"
          >
            {allDays.map((day) => (
              <CalendarDayLg
                key={day.toISOString()}
                day={day}
                currentDate={currentDate}
                selectedDate={selectedDate}
              />
            ))}
          </Box>
        </Box>
      </Flex>
    </Flex>
  )
}

export { CalendarLg }

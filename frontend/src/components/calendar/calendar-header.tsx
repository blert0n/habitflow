'use client'

import { Flex, IconButton, Text } from '@chakra-ui/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'
import { MonthPopover } from './month-popover'
import { YearPopover } from './year-popover'

interface CalendarHeaderProps {
  currentDate: Date
  onPrevMonth: () => void
  onNextMonth: () => void
  onMonthChange: (month: number) => void
  onYearChange: (year: number) => void
}

const CalendarHeader = ({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onMonthChange,
  onYearChange,
}: CalendarHeaderProps) => {
  return (
    <Flex justify="space-between" align="center">
      <Flex gap={1}>
        <MonthPopover
          selectedMonth={currentDate.getMonth()}
          onSelect={onMonthChange}
        >
          <Text fontSize="md" fontWeight="medium" cursor="pointer">
            {format(currentDate, 'MMMM')}
          </Text>
        </MonthPopover>
        <YearPopover
          selectedYear={currentDate.getFullYear()}
          onChange={onYearChange}
        >
          <Text fontSize="md" fontWeight="medium" cursor="pointer">
            {format(currentDate, 'yyyy')}
          </Text>
        </YearPopover>
      </Flex>
      <Flex gap={1}>
        <IconButton
          aria-label="Previous month"
          size="sm"
          variant="ghost"
          onClick={onPrevMonth}
        >
          <ChevronLeft size={16} />
        </IconButton>
        <IconButton
          aria-label="Next month"
          size="sm"
          variant="ghost"
          onClick={onNextMonth}
        >
          <ChevronRight size={16} />
        </IconButton>
      </Flex>
    </Flex>
  )
}

export { CalendarHeader }

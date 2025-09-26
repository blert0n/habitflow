'use client'

import { Flex, IconButton, Text } from '@chakra-ui/react'
import dayjs from 'dayjs'
import { MonthPopover } from './month-popover'
import { YearPopover } from './year-popover'
import type { Dayjs } from 'dayjs'
import { LeftArrowIcon } from '@/assets/icons/back-arrow'
import { RightArrowIcon } from '@/assets/icons/right-arrow'

interface CalendarHeaderProps {
  currentDate: Dayjs
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
  const date = dayjs(currentDate)

  return (
    <Flex justify="space-between" align="center">
      <Flex gap={1}>
        <MonthPopover
          selectedMonth={currentDate.month()}
          onSelect={onMonthChange}
        >
          <Text fontSize="md" fontWeight="medium" cursor="pointer">
            {date.format('MMMM')}
          </Text>
        </MonthPopover>
        <YearPopover selectedYear={currentDate.year()} onChange={onYearChange}>
          <Text fontSize="md" fontWeight="medium" cursor="pointer">
            {date.format('YYYY')}
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
          <LeftArrowIcon boxSize="16px" />
        </IconButton>
        <IconButton
          aria-label="Next month"
          size="sm"
          variant="ghost"
          onClick={onNextMonth}
        >
          <RightArrowIcon boxSize="16px" />
        </IconButton>
      </Flex>
    </Flex>
  )
}

export { CalendarHeader }

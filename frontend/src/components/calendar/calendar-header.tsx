'use client'

import { Button, Flex, IconButton, Text } from '@chakra-ui/react'
import dayjs from 'dayjs'
import { MonthPopover } from './month-popover'
import { YearPopover } from './year-popover'
import type { Dayjs } from 'dayjs'
import type { View } from '@/types/calendar'
import { LeftArrowIcon } from '@/assets/icons/back-arrow'
import { RightArrowIcon } from '@/assets/icons/right-arrow'

interface CalendarHeaderProps {
  view?: View
  currentDate: Dayjs
  onPrevMonth: () => void
  onNextMonth: () => void
  onMonthChange: (month: number) => void
  onYearChange: (year: number) => void
  onViewChange?: (view: View) => void
}

const CalendarHeader = ({
  view: activeView,
  currentDate,
  onPrevMonth,
  onNextMonth,
  onMonthChange,
  onYearChange,
  onViewChange,
}: CalendarHeaderProps) => {
  const date = dayjs(currentDate)

  const renderDateHeader = () => {
    if (activeView === 'Week') {
      const startOfWeek = date.startOf('isoWeek')
      const endOfWeek = date.endOf('isoWeek')

      return (
        <Text fontSize="md" fontWeight="medium">
          {startOfWeek.format('MMM DD')} - {endOfWeek.format('MMM DD')}
        </Text>
      )
    }

    if (activeView === 'Day') {
      return (
        <Text fontSize="md" fontWeight="medium">
          {date.format('DD MMMM')}
        </Text>
      )
    }

    return (
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
    )
  }

  return (
    <Flex justify="space-between" align="center">
      {renderDateHeader()}
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
        {activeView &&
          ['Day', 'Week', 'Month'].map((view) => (
            <Button
              key={view}
              size="xs"
              borderRadius="lg"
              variant={view === activeView ? 'primary' : 'outline'}
              onClick={() => {
                onViewChange?.(view as View)
              }}
            >
              {view}
            </Button>
          ))}
      </Flex>
    </Flex>
  )
}

export { CalendarHeader }

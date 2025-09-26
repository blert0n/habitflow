'use client'

import { Box } from '@chakra-ui/react'
import type { Dayjs } from 'dayjs'

interface P {
  day: Dayjs
  currentDate: Dayjs
  selectedDate?: Dayjs | null
  onSelect: (day: Dayjs) => void
}

export const CalendarDay = ({
  day,
  currentDate,
  selectedDate,
  onSelect,
}: P) => {
  const isCurrentMonth = day.isSame(currentDate, 'month')
  const isSelected = selectedDate
    ? day.isSame(selectedDate, 'day')
    : day.isSame(currentDate, 'day')
  const isToday = day.isSame(new Date(), 'day')

  return (
    <Box
      as="button"
      onClick={() => onSelect(day)}
      w="100%"
      aspectRatio={2}
      fontSize="xs"
      fontWeight={isCurrentMonth ? 'semibold' : 'medium'}
      bg={isSelected ? 'brand.primary' : 'transparent'}
      border="1px solid"
      borderColor={
        isSelected ? 'brand.primary' : isToday ? 'blue.300' : 'transparent'
      }
      boxShadow={isSelected ? 'md' : isToday ? 'sm' : 'none'}
      colorScheme="blackAlpha"
      _hover={{
        bg: isSelected
          ? 'brand.primary'
          : isCurrentMonth
            ? 'gray.50'
            : 'gray.25',
        transform: 'translateY(-1px)',
        boxShadow: isSelected ? 'lg' : 'sm',
      }}
      color={
        isSelected
          ? 'white'
          : isToday
            ? 'blue.600'
            : isCurrentMonth
              ? 'gray.800'
              : 'gray.400'
      }
      rounded="lg"
      transition="all 0.2s ease"
      opacity={isCurrentMonth ? 1 : 0.6}
      position="relative"
    >
      {day.format('D')}
    </Box>
  )
}

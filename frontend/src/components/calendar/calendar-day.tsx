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

  return (
    <Box
      as="button"
      onClick={() => onSelect(day)}
      w="100%"
      aspectRatio={2}
      fontSize="xs"
      fontWeight={isCurrentMonth ? 'medium' : 'normal'}
      bg={isSelected ? 'gray.900' : 'transparent'}
      colorScheme="blackAlpha"
      _hover={{ bg: isSelected ? 'gray.900' : 'gray.100' }}
      color={isSelected ? 'white' : isCurrentMonth ? 'gray.900' : 'gray.400'}
      rounded="full"
    >
      {day.format('D')}
    </Box>
  )
}

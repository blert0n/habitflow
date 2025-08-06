'use client'

import { Box } from '@chakra-ui/react'
import { format, isSameDay, isSameMonth } from 'date-fns'

interface P {
  day: Date
  currentDate: Date
  selectedDate: Date | null
  onSelect: (day: Date) => void
}

export const CalendarDay = ({
  day,
  currentDate,
  selectedDate,
  onSelect,
}: P) => {
  const iscurrentDate = isSameMonth(day, currentDate)
  const isSelected = selectedDate && isSameDay(day, selectedDate)

  return (
    <Box
      as="button"
      onClick={() => onSelect(day)}
      w="100%"
      aspectRatio={2}
      fontSize="xs"
      fontWeight={iscurrentDate ? 'medium' : 'normal'}
      bg={isSelected ? 'gray.900' : 'transparent'}
      colorScheme="blackAlpha"
      _hover={{ bg: isSelected ? 'gray.900' : 'gray.100' }}
      color={isSelected ? 'white' : iscurrentDate ? 'gray.900' : 'gray.400'}
      rounded="full"
    >
      {format(day, 'd')}
    </Box>
  )
}

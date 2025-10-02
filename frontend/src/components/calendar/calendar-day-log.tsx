'use client'

import { Box } from '@chakra-ui/react'
import type { Dayjs } from 'dayjs'

interface P {
  day: Dayjs
  currentDate: Dayjs
  markStatus: 'completed' | 'missed' | 'not-scheduled' | 'yet'
  onClick?: () => void
}

const backgroundColorMapper = {
  completed: 'brand.primary',
  missed: 'gray.200',
  'not-scheduled': 'white',
  yet: '#BBDEFB',
}
const textColorMapper = {
  completed: 'white',
  missed: 'gray.500',
  'not-scheduled': 'gray.500',
  yet: 'white',
}

export const CalendarDayLog = ({
  day,
  currentDate,
  markStatus,
  onClick,
}: P) => {
  const isCurrentMonth = day.isSame(currentDate, 'month')

  return (
    <Box
      as="button"
      w={{ base: 'full', sm: 12 }}
      h={{ base: 12, sm: 12 }}
      fontSize="xs"
      fontWeight={isCurrentMonth ? 'medium' : 'normal'}
      colorScheme="blackAlpha"
      backgroundColor={backgroundColorMapper[markStatus]}
      color={textColorMapper[markStatus]}
      borderRadius="2xl"
      opacity={isCurrentMonth ? 1 : 0}
      border="1px solid #e4e4e7"
      _hover={{ cursor: 'pointer' }}
      onClick={() => {
        onClick?.()
      }}
    >
      {day.format('D')}
    </Box>
  )
}

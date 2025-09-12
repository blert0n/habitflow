'use client'

import { Box, Flex, Text } from '@chakra-ui/react'
import dayjs from 'dayjs'
import type { Habit } from '@/types/habits'
import type { Dayjs } from 'dayjs'

interface P {
  day: Dayjs
  currentDate: Dayjs
  selectedDate?: Dayjs | null
  habits?: Array<Habit>
  visibleHabits?: Array<Habit & { selected: boolean }>
  onSelect?: (date: Dayjs) => void
}

export const CalendarDayLg = ({
  day,
  currentDate,
  selectedDate,
  habits,
  visibleHabits,
  onSelect,
}: P) => {
  const isToday = day.isSame(dayjs(), 'day')
  const isCurrentDate = day.isSame(currentDate, 'month')

  const isSelected = selectedDate
    ? day.isSame(selectedDate, 'day') && day.isSame(selectedDate, 'month')
    : isToday

  const date = dayjs(day).format('D')

  return (
    <Flex
      width="100%"
      height={{ base: '85px', sm: '100px' }}
      fontSize="xs"
      fontWeight={isCurrentDate ? 'medium' : 'normal'}
      colorScheme="blackAlpha"
      bg={isCurrentDate ? 'white' : 'gray.100'}
      borderRadius="md"
      cursor="pointer"
      transition="background-color 0.2s ease"
      borderWidth="1px"
      borderColor="gray.200"
      _hover={{ borderColor: 'gray' }}
      direction="column"
      gap={1}
      padding={1}
      onClick={() => {
        onSelect?.(day)
      }}
    >
      <Text
        color={isSelected ? 'white' : isCurrentDate ? 'gray.900' : 'gray.400'}
        bg={isSelected ? 'brand.primary' : isCurrentDate ? 'white' : 'gray.100'}
        width="fit-content"
        paddingX={{ base: 1, sm: 2 }}
        paddingY={{ base: 1 / 2, sm: 2 }}
        rounded="full"
      >
        {date}
      </Text>
      <Box
        display="grid"
        gridTemplateColumns={{ base: 'repeat(4, 8px)', sm: 'repeat(4, 12px)' }}
        gap="2px"
      >
        {(habits ?? []).map((habit) => {
          const visible = visibleHabits?.find(
            (visibleHabit) => visibleHabit.id === habit.id,
          )?.selected
          if (!visible) return null
          return (
            <Box
              key={`${currentDate.format('YYYY-MM-DD')}-${habit.id}`}
              boxSize={{ base: '8px', sm: '12px' }}
              borderRadius="full"
              bg={habit.color}
            />
          )
        })}
      </Box>
    </Flex>
  )
}

'use client'

import { Box, Flex, Text } from '@chakra-ui/react'
import dayjs from 'dayjs'
import tinycolor from 'tinycolor2'
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
  const isTodayInCurrentMonth = isToday && isCurrentDate && !isSelected

  const totalVisibleHabits =
    habits?.filter(
      (habit) => visibleHabits?.find((vh) => vh.id === habit.id)?.selected,
    ).length ?? 0
  const completedHabits =
    habits?.filter(
      (habit) =>
        visibleHabits?.find((vh) => vh.id === habit.id)?.selected &&
        habit.isCompleted,
    ).length ?? 0

  return (
    <Flex
      width="100%"
      height={{ base: '110px', sm: '130px' }}
      fontSize="xs"
      fontWeight={isCurrentDate ? 'medium' : 'normal'}
      colorScheme="blackAlpha"
      bg={isCurrentDate ? 'white' : 'gray.100'}
      border="1px solid"
      borderColor={isCurrentDate ? 'gray.200' : 'gray.200'}
      borderRadius={{ base: 'lg', sm: 'xl' }}
      p={{ base: 0.5, sm: 2 }}
      boxShadow={isCurrentDate ? 'sm' : 'none'}
      cursor="pointer"
      transition="all 0.2s ease"
      // opacity={isCurrentDate ? 1 : 0.8}
      _hover={{
        transform: {
          base: 'none',
          sm: isCurrentDate ? 'translateY(-2px)' : 'none',
        },
        boxShadow: { base: 'sm', sm: isCurrentDate ? 'md' : 'none' },
        borderColor: isCurrentDate ? 'blue.200' : 'gray.200',
        bg: isCurrentDate ? '#fafbff' : 'gray.50',
        opacity: isCurrentDate ? 1 : 0.9,
      }}
      direction="column"
      gap={{ base: 1, sm: 2 }}
      onClick={() => {
        onSelect?.(day)
      }}
    >
      {/* Date Number */}
      <Flex justify="space-between" align="center" p={{ base: 1, sm: 0 }}>
        <Text
          color={
            isSelected
              ? 'white'
              : isTodayInCurrentMonth
                ? 'blue.600'
                : isCurrentDate
                  ? 'gray.900'
                  : 'gray.500'
          }
          bg={isSelected ? 'brand.primary' : 'transparent'}
          border="1px solid"
          borderColor={
            isSelected
              ? 'brand.primary'
              : isTodayInCurrentMonth
                ? 'blue.300'
                : 'transparent'
          }
          width="fit-content"
          minWidth={{ base: '20px', sm: '24px' }}
          height={{ base: '20px', sm: '24px' }}
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize={{ base: 'xs', sm: 'sm' }}
          fontWeight={isCurrentDate ? 'semibold' : 'medium'}
          rounded="full"
        >
          {date}
        </Text>
      </Flex>

      {/* Habits Dots */}
      <Box flex={1} display="flex" alignItems="center" p={{ base: 1, sm: 0 }}>
        <Box
          display="grid"
          gridTemplateColumns={{
            base: 'repeat(3, 10px)',
            sm: 'repeat(4, 10px)',
          }}
          gap={{ base: '3px', sm: '3px' }}
          width="100%"
        >
          {(habits ?? []).slice(0, 6).map((habit) => {
            const visible = visibleHabits?.find(
              (visibleHabit) => visibleHabit.id === habit.id,
            )?.selected
            if (!visible) return null

            const primaryColor = habit.color
            const light = tinycolor(primaryColor).brighten(15).toString()
            const dark = tinycolor(primaryColor).darken(10).toString()
            const gradient = `linear-gradient(135deg, ${light}, ${dark})`

            return (
              <Box
                key={`${currentDate.format('YYYY-MM-DD')}-${habit.id}`}
                width="100%"
                aspectRatio="1"
                borderRadius="full"
                bgGradient={gradient}
                boxShadow={{ base: 'xs', sm: 'sm' }}
              />
            )
          })}
        </Box>
      </Box>

      {/* Completion Indicator */}
      {totalVisibleHabits > 0 && (
        <Box
          mt="auto"
          px={{ base: 1.5, sm: 2 }}
          py={{ base: 0.5, sm: 1 }}
          bg={
            completedHabits === totalVisibleHabits
              ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05))'
              : completedHabits > 0
                ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(251, 191, 36, 0.05))'
                : 'linear-gradient(135deg, rgba(156, 163, 175, 0.1), rgba(156, 163, 175, 0.05))'
          }
          borderRadius="full"
          border="1px solid"
          borderColor={
            completedHabits === totalVisibleHabits
              ? 'rgba(34, 197, 94, 0.2)'
              : completedHabits > 0
                ? 'rgba(251, 191, 36, 0.2)'
                : 'rgba(156, 163, 175, 0.2)'
          }
        >
          <Text
            fontSize={{ base: '12px', sm: '10px' }}
            fontWeight="medium"
            color={
              completedHabits === totalVisibleHabits
                ? 'green.700'
                : completedHabits > 0
                  ? 'yellow.700'
                  : 'gray.600'
            }
            textAlign="center"
            lineHeight="1"
          >
            {completedHabits}/{totalVisibleHabits}
          </Text>
        </Box>
      )}
    </Flex>
  )
}

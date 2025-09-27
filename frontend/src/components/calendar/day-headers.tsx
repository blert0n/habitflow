import { Box, Flex, Text } from '@chakra-ui/react'
import tinycolor from 'tinycolor2'
import dayjs from 'dayjs'
import type { Habit } from '@/types/habits'
import type { Dayjs } from 'dayjs'
import { CheckMarkGradientIcon } from '@/assets/icons/check-mark-gradient'
import { MinusGrayIcon } from '@/assets/icons/minus-gray'
import { XMarkGradientIcon } from '@/assets/icons/x-mark-gradient'
import { QuestionMarkGradientIcon } from '@/assets/icons/question-mark-gradient'
import { WindIcon } from '@/assets/icons/wind-icon'

type SelectedHabit = Habit & { selected: boolean }

export const DateHeaderMonthView = ({ day }: { day: string }) => {
  return (
    <Box
      key={day}
      padding={1}
      w="100%"
      textAlign="center"
      fontWeight="semibold"
      color="gray.500"
      borderBottom="2px solid transparent"
      borderImage="linear-gradient(to right, #e4e4e7, transparent)"
      borderImageSlice={1}
    >
      {day}
    </Box>
  )
}
export const DateHeaderWeekView = ({
  date,
  habits,
  visibleHabits,
}: {
  date: Dayjs
  habits?: Array<Habit>
  visibleHabits?: Array<SelectedHabit>
}) => {
  const allHabitsCompleted =
    habits && habits.length > 0 && habits.every((habit) => habit.isCompleted)

  return (
    <Flex
      width="full"
      direction="column"
      padding={1}
      gap={1}
      bg={allHabitsCompleted ? '#effbf5' : 'transparent'}
      border={allHabitsCompleted ? '1px solid #d1fae5' : 'none'}
      borderRadius="lg"
      transition="all 0.2s ease"
    >
      <Flex
        key={date.toISOString()}
        padding={1}
        w="100%"
        textAlign="center"
        fontWeight="semibold"
        color="gray.500"
        borderImageSlice={1}
        direction="column"
        justify="center"
        alignItems="center"
        flex="1"
        minH="64px"
      >
        <Text fontSize="sm">{date.format('dddd')}</Text>
        <Text
          fontSize="sm"
          color={allHabitsCompleted ? '#059669' : 'gray.500'}
          fontWeight={allHabitsCompleted ? 'bold' : 'semibold'}
          transition="color 0.2s ease"
        >
          {date.get('date')}
        </Text>
      </Flex>

      {visibleHabits?.length === 0 && (
        <Flex
          alignItems="center"
          justifyContent="center"
          p={2}
          fontSize="sm"
          borderRadius="md"
          flex="1"
          minH="64px"
        >
          <WindIcon size={40} />
        </Flex>
      )}

      {visibleHabits
        ?.filter((habit) => habit.selected)
        .map((habit) => {
          const matchedHabit = habits?.find(
            (scheduledHabit) => scheduledHabit.id === habit.id,
          )
          const isPastDay = date.isBefore(dayjs(), 'day')

          return (
            <Flex
              key={habit.id}
              alignItems="center"
              justifyContent="center"
              p={2}
              fontSize="sm"
              borderRadius="md"
              flex="1"
              minH="64px"
            >
              {matchedHabit && (
                <Box
                  boxSize={10}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  {matchedHabit.isCompleted && (
                    <CheckMarkGradientIcon
                      size={40}
                      lightColor="#34d399"
                      darkColor="#059669"
                      gradientId={`checkmark-${habit.id}`}
                    />
                  )}
                  {!matchedHabit.isCompleted && !isPastDay && (
                    <QuestionMarkGradientIcon
                      size={40}
                      lightColor="#60a5fa"
                      darkColor="#2563eb"
                      gradientId={`question-${habit.id}`}
                    />
                  )}
                  {!matchedHabit.isCompleted && isPastDay && (
                    <XMarkGradientIcon
                      size={40}
                      lightColor="#f87171"
                      darkColor="#dc2626"
                      gradientId={`xmark-${habit.id}`}
                    />
                  )}
                </Box>
              )}
              {!matchedHabit && (
                <Box
                  boxSize={10}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <MinusGrayIcon size={40} />
                </Box>
              )}
            </Flex>
          )
        })}
    </Flex>
  )
}

export const HabitListWeekView = ({
  habits,
}: {
  habits: Array<SelectedHabit>
}) => {
  return (
    <Flex width="full" direction="column" padding={1}>
      <Flex
        padding={1}
        w="100%"
        textAlign="center"
        fontWeight="semibold"
        color="gray.500"
        borderImageSlice={1}
        direction="column"
        justify="center"
        alignItems="center"
        flex="1"
        minH="64px"
      >
        <Text fontSize="xs">Habits</Text>
      </Flex>
      {habits.length === 0 && (
        <Flex
          alignItems="center"
          justifyContent="center"
          p={2}
          fontSize="sm"
          borderRadius="md"
          flex="1"
          minH="64px"
        >
          <WindIcon size={40} />
        </Flex>
      )}
      <Flex direction="column" gap={1} flex={1}>
        {habits
          .filter((habit) => habit.selected)
          .map((habit) => {
            const primaryColor = habit.color
            const light = tinycolor(primaryColor)
              .lighten(20)
              .saturate(10)
              .toString()
            const dark = tinycolor(primaryColor)
              .darken(20)
              .saturate(15)
              .toString()
            const gradient = `linear-gradient(135deg, ${light}, ${dark})`

            return (
              <Flex
                key={habit.id}
                alignItems="center"
                justifyContent="center"
                p={2}
                fontSize="xxs"
                borderRadius="md"
                flex="1"
                minH="64px"
                position="relative"
                direction="column"
              >
                <Box
                  w="14px"
                  h="14px"
                  bgGradient={habit.selected ? gradient : ''}
                  rounded="full"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  _hover={{ scale: 1.1 }}
                  mr={2}
                />
                <Text
                  textAlign="center"
                  width="full"
                  fontSize="xs"
                  fontWeight="semibold"
                  color="gray.600"
                >
                  {habit.name}
                </Text>
              </Flex>
            )
          })}
      </Flex>
    </Flex>
  )
}

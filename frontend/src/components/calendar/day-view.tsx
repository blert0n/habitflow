import { Box, Flex, Spinner, Text } from '@chakra-ui/react'
import tinycolor from 'tinycolor2'
import dayjs from 'dayjs'
import type { Habit } from '@/types/habits'
import { AfternoonIcon } from '@/assets/icons/afternoon-icon'
import { MorningIcon } from '@/assets/icons/morning-icon'
import { NightIcon } from '@/assets/icons/night-icon'
import { getStartDayjsFromRRule } from '@/util/rrule'
import { useCompleteHabits } from '@/hooks/useCompleteHabits'

const DAY_PARTS = [
  {
    time: 'Morning',
    Icon: <MorningIcon size={28} />,
    label: 'Morning habits (6:00 AM - 12:00 PM)',
  },
  {
    time: 'Afternoon',
    Icon: <AfternoonIcon size={28} />,
    label: 'Afternoon habits (12:00 PM - 06:00 PM)',
  },
  {
    time: 'Evening',
    Icon: <NightIcon size={28} />,
    label: 'Evening habits (6:00 PM - 11:00 PM)',
  },
]

const getTimePartForHabit = (
  habit: Habit,
): 'Morning' | 'Afternoon' | 'Evening' => {
  try {
    const startTime = getStartDayjsFromRRule(habit.frequency)
    if (!startTime) return 'Morning'

    const hour = startTime.hour()

    if (hour >= 6 && hour < 12) return 'Morning'
    if (hour >= 12 && hour < 18) return 'Afternoon'
    return 'Evening'
  } catch (error) {
    console.error('Error parsing habit frequency:', error)
    return 'Morning'
  }
}

export const DayView = ({
  habits = [],
  date,
}: {
  habits?: Array<Habit>
  date: string
}) => {
  const { isChecking, checkingId, onCheck } = useCompleteHabits()

  const habitsByTimePart = habits.reduce(
    (acc, habit) => {
      const timePart = getTimePartForHabit(habit)
      const startTime = getStartDayjsFromRRule(habit.frequency)
      const habitWithTime = {
        ...habit,
        startTime,
        timeMinutes: startTime ? startTime.hour() * 60 + startTime.minute() : 0,
      }
      acc[timePart] = acc[timePart] ?? []
      acc[timePart].push(habitWithTime)
      return acc
    },
    {} as Record<
      string,
      Array<Habit & { startTime: dayjs.Dayjs | null; timeMinutes: number }>
    >,
  )

  return (
    <Flex w="full" direction="column" gap={6}>
      {DAY_PARTS.map((part) => {
        const partHabits = habitsByTimePart[part.time] ?? []

        return (
          <Box key={part.time}>
            <Flex alignItems="center" gap={2} mb={3}>
              {part.Icon}
              <Text color="gray.600" fontWeight="semibold" fontSize="sm">
                {part.label}
              </Text>
            </Flex>

            {partHabits.length > 0 ? (
              <Flex direction="column" gap={2} ml={8}>
                {partHabits
                  .sort((a, b) => a.timeMinutes - b.timeMinutes)
                  .map((habit) => {
                    const timeStr = habit.startTime
                      ? habit.startTime.format('h:mm A')
                      : 'No time'

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
                        align="center"
                        justify="space-between"
                        p={3}
                        bg="gray.50"
                        borderRadius="sm"
                        borderLeft="4px"
                        borderLeftStyle={habit.isCompleted ? 'solid' : 'dashed'}
                        borderLeftColor={habit.color}
                      >
                        <Flex align="center" gap={3}>
                          <Box
                            w="14px"
                            h="14px"
                            bgGradient={gradient}
                            rounded="full"
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            _hover={{ scale: 1.1 }}
                            mr={2}
                          />{' '}
                          <Flex direction="column" gap={0.5}>
                            <Text fontWeight="medium" color="gray.800">
                              {habit.name}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                              {timeStr}
                            </Text>
                          </Flex>
                        </Flex>
                        {habit.isCompleted && (
                          <Text
                            fontSize="xs"
                            color="white"
                            backgroundColor="#22c55e"
                            px={2}
                            rounded="full"
                            _hover={{ cursor: 'pointer', scale: 1.1 }}
                            onClick={() => {
                              if (isChecking) return
                              onCheck(habit.id, habit.isCompleted, dayjs(date))
                            }}
                            opacity={
                              isChecking && checkingId === habit.id ? 0.6 : 1
                            }
                            display="flex"
                            gap={1}
                            alignItems="center"
                          >
                            {isChecking && checkingId === habit.id && (
                              <Spinner size="xs" />
                            )}
                            Completed
                          </Text>
                        )}
                        {!habit.isCompleted && (
                          <Text
                            fontSize="xs"
                            color="white"
                            backgroundColor="gray.400"
                            px={2}
                            rounded="full"
                            _hover={{ cursor: 'pointer', scale: 1.1 }}
                            onClick={() => {
                              if (isChecking) return
                              onCheck(habit.id, habit.isCompleted, dayjs(date))
                            }}
                            opacity={
                              isChecking && checkingId === habit.id ? 0.6 : 1
                            }
                            display="flex"
                            gap={1}
                            alignItems="center"
                          >
                            {isChecking && checkingId === habit.id && (
                              <Spinner size="xs" />
                            )}
                            Mark as complete
                          </Text>
                        )}
                      </Flex>
                    )
                  })}
              </Flex>
            ) : (
              <Text ml={8} fontSize="sm" color="gray.400" fontStyle="italic">
                No habits scheduled for this time
              </Text>
            )}
          </Box>
        )
      })}
    </Flex>
  )
}

import { Flex, Text } from '@chakra-ui/react'
import { normalizeDay } from './helpers'
import type { AllowedDayString } from '@/types/habits'
import { ALL_ALLOWED_DAYS } from '@/types/habits'
import { ISO_WEEK_DAYS } from '@/util/dates'

interface ScheduledWeekDaysProps {
  activeColor?: string
  selectedDays?: Array<AllowedDayString>
  isRandom?: boolean
  interactive?: boolean
  boxSize?: number
  isDaily?: boolean
  onDayClick?: (index: number, day: AllowedDayString) => void
}

const getRandomSelectedDays = (count: number): Array<AllowedDayString> => {
  const shuffled = [...ALL_ALLOWED_DAYS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

const ScheduledWeekDays = ({
  activeColor = 'gray.900',
  selectedDays,
  isRandom = false,
  boxSize = 6,
  interactive = false,
  isDaily = false,
  onDayClick,
}: ScheduledWeekDaysProps) => {
  const daysToUse = isRandom
    ? getRandomSelectedDays(Math.floor(Math.random() * 7) + 1)
    : (selectedDays ?? [])

  const normalizedSelected = new Set(daysToUse.map(normalizeDay))

  return (
    <Flex gap={1} wrap="wrap">
      {ISO_WEEK_DAYS.map((day, index) => {
        const isSelected =
          normalizedSelected.has(normalizeDay(day as AllowedDayString)) ||
          isDaily
        return (
          <Flex
            key={day}
            alignItems="center"
            justifyContent="center"
            bg={isSelected ? activeColor : 'gray.400'}
            w={boxSize}
            h={boxSize}
            borderRadius="md"
            cursor={interactive ? 'pointer' : 'default'}
            userSelect="none"
            onClick={() => {
              if (interactive && onDayClick) {
                onDayClick(index + 1, day as AllowedDayString)
              }
            }}
            _hover={
              interactive
                ? { bg: isSelected ? 'gray.700' : 'gray.500' }
                : undefined
            }
          >
            <Text fontSize="xs" color="white">
              {day[0]}
            </Text>
          </Flex>
        )
      })}
    </Flex>
  )
}

export { ScheduledWeekDays }

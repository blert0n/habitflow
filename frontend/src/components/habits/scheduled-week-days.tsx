import { Flex, Text } from '@chakra-ui/react'
import type { AllowedDayString } from '@/types/habits'
import { weekdayMap } from '@/util/dates'

interface ScheduledWeekDaysProps {
  activeColor?: string
  selectedDays?: Array<AllowedDayString>
  interactive?: boolean
  boxSize?: number
  isDaily?: boolean
  onDayClick?: (index: number, day: AllowedDayString) => void
}

const ScheduledWeekDays = ({
  activeColor = 'gray.900',
  selectedDays,
  boxSize = 6,
  interactive = false,
  isDaily = false,
  onDayClick,
}: ScheduledWeekDaysProps) => {
  const normalizedSelected = new Set(selectedDays)

  return (
    <Flex gap={1} wrap="wrap">
      {weekdayMap
        .sort((a, b) => a.order - b.order)
        .map((day) => {
          const isSelected =
            normalizedSelected.has(day.label as AllowedDayString) || isDaily
          return (
            <Flex
              key={day.label}
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
                  onDayClick(day.index, day.label as AllowedDayString)
                }
              }}
              _hover={
                interactive
                  ? { bg: isSelected ? 'gray.700' : 'gray.500' }
                  : undefined
              }
            >
              <Text fontSize="xs" color="white">
                {day.label[0]}
              </Text>
            </Flex>
          )
        })}
    </Flex>
  )
}

export { ScheduledWeekDays }

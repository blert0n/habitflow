import { Button, Flex, Text } from '@chakra-ui/react'
import { memo, useMemo } from 'react'
import { ScheduledWeekDays } from '../scheduled-week-days'
import type { AllowedDayString } from '@/types/habits'
import type { WeekdayIndex } from '@/util/dates'
import { weekdayMap } from '@/util/dates'

interface FrequencyFieldsProps {
  activeColor?: string
  frequency: 'daily' | 'weekly'
  daysOfWeek: Array<WeekdayIndex>
  toggleDayOfWeek: (day: WeekdayIndex) => void
  onChange: (value: 'daily' | 'weekly') => void
}

export const FrequencyFields = memo(
  ({
    activeColor,
    frequency,
    daysOfWeek,
    toggleDayOfWeek,
    onChange,
  }: FrequencyFieldsProps) => {
    const selectedDaysLabels = useMemo(
      () =>
        daysOfWeek.map(
          (dayIndex) =>
            weekdayMap.find((weekDay) => weekDay.index === dayIndex)?.label,
        ) as Array<AllowedDayString>,
      [daysOfWeek],
    )

    return (
      <Flex
        direction="column"
        paddingX={4}
        paddingY={6}
        paddingBottom={2}
        gap={2}
      >
        <Text mb={2}>Frequency & Schedule</Text>
        <Flex gap={2} mb={2} direction="column">
          <Text color="gray.700" fontSize={14}>
            Frequency
          </Text>
          <Flex gap={2}>
            <Button
              variant={frequency === 'daily' ? 'primary' : 'outline'}
              onClick={() => onChange('daily')}
              size="xs"
              width={{ smDown: '50%', sm: '200px' }}
            >
              Daily
            </Button>
            <Button
              variant={frequency === 'weekly' ? 'primary' : 'outline'}
              onClick={() => onChange('weekly')}
              size="xs"
              width={{ smDown: '50%', sm: '200px' }}
            >
              Weekly
            </Button>
          </Flex>
        </Flex>
        {frequency === 'weekly' && (
          <>
            <Text color="gray.700" fontSize={14}>
              Days of the week
            </Text>
            <ScheduledWeekDays
              activeColor={activeColor}
              interactive
              boxSize={7}
              selectedDays={selectedDaysLabels}
              // @ts-ignore its fine
              onDayClick={toggleDayOfWeek}
            />
          </>
        )}
      </Flex>
    )
  },
)

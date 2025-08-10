import { Button, Flex, Text } from '@chakra-ui/react'
import { memo, useMemo } from 'react'
import { ScheduledWeekDays } from '../scheduled-week-days'
import type { AllowedDayString } from '../types'
import type { WeekdayIndex } from '@/util/dates'
import { weekdayMap } from '@/util/dates'

interface FrequencyFieldsProps {
  frequency: 'daily' | 'weekly'
  daysOfWeek: Array<WeekdayIndex>
  toggleDayOfWeek: (day: WeekdayIndex) => void
  onChange: (value: 'daily' | 'weekly') => void
}

export const FrequencyFields = memo(
  ({
    frequency,
    daysOfWeek,
    toggleDayOfWeek,
    onChange,
  }: FrequencyFieldsProps) => {
    const selectedDaysLabels = useMemo(
      () =>
        daysOfWeek.map(
          (day) => weekdayMap[day].label,
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
              onClick={() => onChange('daily')}
              size="xs"
              width={{ smDown: '50%', sm: '200px' }}
            >
              Daily
            </Button>
            <Button
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

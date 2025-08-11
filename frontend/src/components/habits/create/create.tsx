import dayjs from 'dayjs'
import { useCallback, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Box, Flex, IconButton } from '@chakra-ui/react'
import { ArrowLeft } from 'lucide-react'
import { HeaderWithText } from '../../ui/header-with-text'
import { ListHabit } from '../list-habit'
import { ExcludeDates } from '../exclude-dates'
import { BasicInfoFields } from './basic-info-fields'
import { FrequencyFields } from './frequency'
import { ScheduleFields } from './schedule-fields'
import { EndsOnFields } from './ends-on-fields'
import { ActionButtons } from './action-buttons'
import type { AllowedDayString, HabitForm } from '../types'
import type { WeekdayIndex } from '@/util/dates'
import { weekdayMap } from '@/util/dates'
import { buildRRule } from '@/util/rrule'
import { useCategories } from '@/hooks/useCategories'

export const Create = ({ onBack }: { onBack: () => void }) => {
  const [endsOn, setEndsOn] = useState<'Never' | 'On' | 'After'>('Never')
  const { handleSubmit, control, setValue } = useForm<HabitForm>({
    defaultValues: {
      name: '',
      description: '',
      category: 0,
      icon: '',
      startDate: dayjs(),
      time: dayjs().hour(7).minute(0),
      frequency: 'daily',
      daysOfWeek: [],
    },
    shouldUnregister: false,
  })

  const { getCategory } = useCategories()

  const habitName = useWatch({ control, name: 'name' })
  const habitDescription = useWatch({ control, name: 'description' })
  const category = useWatch({ control, name: 'category' })
  const frequency = useWatch({ control, name: 'frequency' })
  const daysOfWeek = useWatch({ control, name: 'daysOfWeek' })

  const selectedCategory = getCategory(category)

  const onSubmit = (data: HabitForm) => {
    const rrule = buildRRule({
      startDate: data.startDate,
      time: data.time,
      days: data.daysOfWeek,
      frequency: data.frequency,
    })
    console.log('Saving Habit:', { ...data, rrule })
  }

  const toggleDayOfWeek = useCallback(
    (day: WeekdayIndex) => {
      if (daysOfWeek.includes(day)) {
        setValue(
          'daysOfWeek',
          daysOfWeek.filter((d) => d !== day),
          { shouldValidate: true },
        )
        return
      }
      setValue('daysOfWeek', [...daysOfWeek, day], {
        shouldValidate: true,
      })
    },
    [daysOfWeek, setValue],
  )

  return (
    <Flex direction="column" height="100%">
      <Flex mb={4} gap={2} alignItems="center">
        <IconButton
          variant="ghost"
          aria-label="Go back"
          onClick={onBack}
          _hover={{ transform: 'scale(1.1)' }}
        >
          <ArrowLeft />
        </IconButton>
        <HeaderWithText
          title="Create a new habit"
          text="Set up a new habit to track your progress"
        />
      </Flex>

      <ListHabit
        title={habitName}
        text={habitDescription}
        category={selectedCategory}
        selectedDays={
          daysOfWeek.map(
            (dayIndex) => weekdayMap[dayIndex].label,
          ) as Array<AllowedDayString>
        }
        isDaily={frequency === 'daily'}
      />

      <BasicInfoFields
        control={control}
        onCategorySelect={(value) => setValue('category', value)}
      />

      <Box bg="white" borderRadius="lg" borderWidth={1} borderColor="gray.200">
        <FrequencyFields
          activeColor={selectedCategory?.backgroundGradient}
          frequency={frequency}
          daysOfWeek={daysOfWeek}
          toggleDayOfWeek={toggleDayOfWeek}
          onChange={(value) => setValue('frequency', value)}
        />

        <ScheduleFields control={control} />

        <EndsOnFields endsOn={endsOn} setEndsOn={setEndsOn} />

        <ExcludeDates />
      </Box>

      <ActionButtons onSubmit={handleSubmit(onSubmit)} onBack={onBack} />
    </Flex>
  )
}

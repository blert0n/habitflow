import dayjs from 'dayjs'
import { useCallback } from 'react'
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
import type {
  AllowedDayString,
  CreateHabitPayload,
  HabitForm,
} from '@/types/habits'
import type { WeekdayIndex } from '@/util/dates'
import { weekdayMap } from '@/util/dates'
import { buildRRule } from '@/util/rrule'
import { useCategories } from '@/hooks/useCategories'

interface P {
  onCreate: (payload: CreateHabitPayload) => void
  onBack: () => void
}

export const Create = ({ onCreate, onBack }: P) => {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { isValid, isSubmitting, isLoading },
  } = useForm<HabitForm>({
    defaultValues: {
      name: '',
      description: '',
      category: 0,
      icon: '',
      startDate: dayjs(),
      time: dayjs().hour(7).minute(0),
      frequency: 'daily',
      daysOfWeek: [],
      color: '#2563eb',
      count: 0,
      endsOn: 'Never',
      until: null,
      excludedDates: [],
    },
    shouldUnregister: false,
  })

  const { getCategory, backgroundGradient } = useCategories()

  const habitName = useWatch({ control, name: 'name' })
  const habitDescription = useWatch({ control, name: 'description' })
  const category = useWatch({ control, name: 'category' })
  const frequency = useWatch({ control, name: 'frequency' })
  const daysOfWeek = useWatch({ control, name: 'daysOfWeek' })
  const endsOn = useWatch({ control, name: 'endsOn' })
  const excludedDates = useWatch({ control, name: 'excludedDates' })

  const selectedCategory = getCategory(category)

  const onSubmit = (data: HabitForm) => {
    if (!isValid) return
    const rrule = buildRRule({
      startDate: data.startDate,
      time: data.time,
      days: data.daysOfWeek,
      frequency: data.frequency,
      endsOn: data.endsOn,
      count: data.count,
      until: data.until,
    })

    const payload = {
      name: data.name,
      description: data.description,
      categoryId: data.category,
      color: data.color,
      frequency: rrule,
      excludedDates: data.excludedDates.map((d) =>
        dayjs(d).format('YYYY-MM-DD'),
      ),
    }

    onCreate(payload)
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

      <BasicInfoFields control={control} />

      <Box bg="white" borderRadius="lg" borderWidth={1} borderColor="gray.200">
        <FrequencyFields
          activeColor={backgroundGradient}
          frequency={frequency}
          daysOfWeek={daysOfWeek}
          toggleDayOfWeek={toggleDayOfWeek}
          onChange={(value) => setValue('frequency', value)}
        />

        <ScheduleFields control={control} />

        <EndsOnFields ends={endsOn} control={control} />

        <ExcludeDates excludedDates={excludedDates} control={control} />
      </Box>

      <ActionButtons
        onSubmit={handleSubmit(onSubmit)}
        onBack={onBack}
        isValid={isValid}
        isLoading={isSubmitting || isLoading}
      />
    </Flex>
  )
}

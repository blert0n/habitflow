import type { WeekdayIndex } from '@/util/dates'
import type dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'

export type AllowedDayString =
  | 'Sunday'
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sun'
  | 'Mon'
  | 'Tue'
  | 'Wed'
  | 'Thu'
  | 'Fri'
  | 'Sat'

export const ALL_ALLOWED_DAYS: Array<AllowedDayString> = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
]

export interface HabitForm {
  name: string
  description: string
  category: number
  icon: string
  startDate: Dayjs
  time: Dayjs
  frequency: 'daily' | 'weekly'
  daysOfWeek: Array<WeekdayIndex>
  color: string
  endsOn: 'Never' | 'On' | 'After'
  until?: dayjs.Dayjs | null
  count?: number | null
  excludedDates: Array<Dayjs>
}

export interface CreateHabitPayload {
  name: string
  description: string
  categoryId: number
  color: string
  frequency: string
  excludedDates: Array<string>
}

export type EditHabitPayload = CreateHabitPayload & {
  id: number
}

export interface Habit {
  id: number
  name: string
  description: string
  createdat: string
  updatedat: string
  categoryid: number
  color: string
  frequency: string
  userid: number
  isDaily: boolean
  selectedDays: Array<AllowedDayString> | null
  excludedDates: Array<string>
}

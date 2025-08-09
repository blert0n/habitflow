import type { WeekdayIndex } from '@/util/dates'
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
}

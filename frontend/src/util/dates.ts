import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
import isYesterday from 'dayjs/plugin/isYesterday'
import isBetween from 'dayjs/plugin/isBetween'
import weekday from 'dayjs/plugin/weekday'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import isoWeek from 'dayjs/plugin/isoWeek'
import utc from 'dayjs/plugin/utc'
import { RRule } from 'rrule'
import type { ByWeekday } from 'rrule'
import type { Dayjs } from 'dayjs'

dayjs.extend(isToday)
dayjs.extend(isYesterday)
dayjs.extend(isBetween)
dayjs.extend(weekday)
dayjs.extend(localizedFormat)
dayjs.extend(advancedFormat)
dayjs.extend(utc)
dayjs.extend(isoWeek)

interface DayWithRRule {
  rule: ByWeekday
  label: string
  index: number
}

export type WeekdayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6

const MONTHS = Array.from({ length: 12 }, (_, i) =>
  dayjs().month(i).format('MMM'),
)

const NORMALIZED_FORMAT = 'YYYY-MM-DD'

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const ISO_WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const WEEK_DAYS_LONG = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

export const weekdayMap: Array<DayWithRRule> = [
  { rule: RRule.SU, label: 'Sunday', index: 0 },
  { rule: RRule.MO, label: 'Monday', index: 1 },
  { rule: RRule.TU, label: 'Tuesday', index: 2 },
  { rule: RRule.WE, label: 'Wednesday', index: 3 },
  { rule: RRule.TH, label: 'Thursday', index: 4 },
  { rule: RRule.FR, label: 'Friday', index: 5 },
  { rule: RRule.SA, label: 'Saturday', index: 6 },
  { rule: RRule.SU, label: 'Sunday', index: 7 },
]

const getCalendarMatrix = (
  currentMonth: Dayjs,
  view?: 'Month' | 'Week' | 'Day',
): Array<Array<Dayjs>> => {
  if (view === 'Week') {
    const startOfWeek = currentMonth.startOf('isoWeek')
    const week: Array<Dayjs> = []

    for (let i = 0; i < 7; i++) {
      week.push(startOfWeek.add(i, 'day'))
    }

    return [week]
  }

  // Default behavior for Month view
  const startDate = currentMonth.startOf('month').startOf('isoWeek')
  const endDate = currentMonth.endOf('month').endOf('isoWeek')

  const calendar: Array<Array<Dayjs>> = []
  let week: Array<Dayjs> = []
  let day = startDate

  while (day.isBefore(endDate) || day.isSame(endDate, 'day')) {
    for (let i = 0; i < 7; i++) {
      week.push(day)
      day = day.add(1, 'day')
    }
    calendar.push(week)
    week = []
  }

  return calendar
}

const formatFriendlyDate = (date: Dayjs | Date): string => {
  const d = dayjs(date, 'YYYY-MM-DD HH:mm:ss.SSSSSS', true)
  if (d.isToday()) {
    return `Today, ${d.format('h:mm a')}`
  }
  if (d.isYesterday()) {
    return `Yesterday, ${d.format('h:mm a')}`
  }
  return `${d.format('DD MMM')}, ${d.format('h:mm a')}`
}

const isDayInCurrentWeek = (day: Dayjs | Date, referenceDate: Dayjs | Date) => {
  const d = dayjs(day)
  const start = dayjs(referenceDate).startOf('week').add(1, 'day')
  const end = dayjs(referenceDate).endOf('week').add(1, 'day')
  return d.isBetween(start, end, 'day', '[]')
}

export {
  MONTHS,
  WEEK_DAYS,
  WEEK_DAYS_LONG,
  ISO_WEEK_DAYS,
  getCalendarMatrix,
  formatFriendlyDate,
  isDayInCurrentWeek,
  NORMALIZED_FORMAT,
}

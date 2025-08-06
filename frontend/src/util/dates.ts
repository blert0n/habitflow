import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  isToday,
  isWithinInterval,
  isYesterday,
  startOfMonth,
  startOfWeek,
} from 'date-fns'

const MONTHS = Array.from({ length: 12 }, (_, i) =>
  new Date(0, i).toLocaleString('en-US', { month: 'short' }),
)

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const WEEK_DAYS_LONG = [
  'Sunday',
  'Monday',
  'Tueday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

const getCalendarMatrix = (currentMonth: Date): Array<Array<Date>> => {
  const startDate = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 })
  const endDate = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 })

  const calendar: Array<Array<Date>> = []
  let week: Array<Date> = []
  let day = startDate

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      week.push(day)
      day = addDays(day, 1)
    }
    calendar.push(week)
    week = []
  }

  return calendar
}

const formatFriendlyDate = (date: Date): string => {
  if (isToday(date)) {
    return `Today, ${format(date, 'h:mm a')}`
  }

  if (isYesterday(date)) {
    return `Yesterday, ${format(date, 'h:mm a')}`
  }

  return `${format(date, 'dd MMM')}, ${format(date, 'h:mm a')}`
}

const isDayInCurrentWeek = (day: Date, referenceDate: Date) => {
  const weekStart = startOfWeek(referenceDate, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(referenceDate, { weekStartsOn: 1 })
  return isWithinInterval(day, { start: weekStart, end: weekEnd })
}

export {
  MONTHS,
  WEEK_DAYS,
  WEEK_DAYS_LONG,
  getCalendarMatrix,
  formatFriendlyDate,
  isDayInCurrentWeek,
}

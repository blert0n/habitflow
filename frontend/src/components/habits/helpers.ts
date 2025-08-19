import type { AllowedDayString } from '@/types/habits'

export const normalizeDay = (day: AllowedDayString): string => {
  const map: Record<AllowedDayString, string> = {
    Sunday: 'Sunday',
    Sun: 'Sunday',
    Monday: 'Monday',
    Mon: 'Monday',
    Tuesday: 'Tuesday',
    Tue: 'Tuesday',
    Wednesday: 'Wednesday',
    Wed: 'Wednesday',
    Thursday: 'Thursday',
    Thu: 'Thursday',
    Friday: 'Friday',
    Fri: 'Friday',
    Saturday: 'Saturday',
    Sat: 'Saturday',
  }
  return map[day]
}

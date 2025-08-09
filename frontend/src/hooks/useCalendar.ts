import dayjs from 'dayjs'
import { useCallback, useState } from 'react'
import type { Dayjs } from 'dayjs'
import { getCalendarMatrix } from '@/util/dates'

interface HookInput {
  initialDate?: Dayjs | null | undefined
}

interface UseCalendarReturn {
  currentDate: Dayjs
  selectedDate: Dayjs | null
  calendarMatrix: Array<Array<Dayjs>>
  handlePrevMonth: () => void
  handleNextMonth: () => void
  handleMonthChange: (month: number) => void
  handleYearChange: (year: number) => void
  handleSelectedDateChange: (date: Dayjs) => void
}

const useCalendar = ({ initialDate }: HookInput): UseCalendarReturn => {
  const [currentDate, setCurrentDate] = useState<Dayjs>(
    dayjs(initialDate ?? new Date()),
  )
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(
    initialDate ? dayjs(initialDate) : null,
  )

  const calendarMatrix = getCalendarMatrix(currentDate)

  const handlePrevMonth = useCallback(() => {
    setCurrentDate((prev) => prev.subtract(1, 'month'))
  }, [])

  const handleNextMonth = useCallback(() => {
    setCurrentDate((prev) => prev.add(1, 'month'))
  }, [])

  const handleMonthChange = useCallback((month: number) => {
    setCurrentDate((prev) => prev.month(month))
  }, [])

  const handleYearChange = useCallback((year: number) => {
    setCurrentDate((prev) => prev.year(year))
  }, [])

  const handleSelectedDateChange = useCallback((date: Dayjs) => {
    setSelectedDate(dayjs(date))
  }, [])

  return {
    currentDate,
    selectedDate,
    calendarMatrix,
    handlePrevMonth,
    handleNextMonth,
    handleMonthChange,
    handleYearChange,
    handleSelectedDateChange,
  }
}

export { useCalendar }

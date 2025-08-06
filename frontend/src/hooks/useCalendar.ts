import { addMonths, setMonth, setYear, subMonths } from 'date-fns'
import { useCallback, useState } from 'react'
import { getCalendarMatrix } from '@/util/dates'

const useCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())

  const calendarMatrix = getCalendarMatrix(currentDate)

  const handlePrevMonth = useCallback(() => {
    setCurrentDate((prev) => subMonths(prev, 1))
  }, [])

  const handleNextMonth = useCallback(() => {
    setCurrentDate((prev) => addMonths(prev, 1))
  }, [])

  const handleMonthChange = useCallback((month: number) => {
    setCurrentDate((prev) => setMonth(prev, month))
  }, [])

  const handleYearChange = useCallback((year: number) => {
    setCurrentDate((prev) => setYear(prev, year))
  }, [])

  const handleSelectedDateChange = useCallback((date: Date) => {
    setSelectedDate(date)
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

import dayjs from 'dayjs'
import { useCallback, useState } from 'react'
import type { Dayjs } from 'dayjs'
import { getCalendarMatrix } from '@/util/dates'

interface HookInput {
  initialDate?: Dayjs | null | undefined
}

type View = 'Day' | 'Week' | 'Month'

interface UseCalendarReturn {
  view: View
  currentDate: Dayjs
  selectedDate: Dayjs | null
  calendarMatrix: Array<Array<Dayjs>>
  handlePrevMonth: () => void
  handleNextMonth: () => void
  handleMonthChange: (month: number) => void
  handleYearChange: (year: number) => void
  handleSelectedDateChange: (date: Dayjs) => void
  handleViewChange: (view: View) => void
}

const useCalendar = ({ initialDate }: HookInput): UseCalendarReturn => {
  const [view, setView] = useState<View>('Month')
  const handleViewChange = (updatedView: View) => {
    setView(updatedView)
  }
  const [currentDate, setCurrentDate] = useState<Dayjs>(
    dayjs(initialDate ?? new Date()),
  )
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(
    initialDate ? dayjs(initialDate) : null,
  )

  const calendarMatrix = getCalendarMatrix(currentDate, view)

  const handlePrevMonth = useCallback(() => {
    setCurrentDate((prev) => {
      if (view === 'Day') return prev.subtract(1, 'day')
      if (view === 'Week') return prev.subtract(1, 'week')
      return prev.subtract(1, 'month')
    })
  }, [view])

  const handleNextMonth = useCallback(() => {
    setCurrentDate((prev) => {
      if (view === 'Day') return prev.add(1, 'day')
      if (view === 'Week') return prev.add(1, 'week')
      return prev.add(1, 'month')
    })
  }, [view])

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
    view,
    currentDate,
    selectedDate,
    calendarMatrix,
    handlePrevMonth,
    handleNextMonth,
    handleMonthChange,
    handleYearChange,
    handleSelectedDateChange,
    handleViewChange,
  }
}

export { useCalendar }

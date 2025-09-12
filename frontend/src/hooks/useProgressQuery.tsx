import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { ArrowDown, ArrowUp, Minus } from 'lucide-react'
import { client } from '@/util/client'

interface Progress {
  today_completed: number
  today_total: number
  weekly_completion_rate: number
  week_completions: number
  total_possible: number
  previous_week_rate?: number
}

interface WeekProgress {
  completion_percentage: string
  completion_rate: number
  completions: number
  date: string
  possible_completions: number
  week_end: string
  week_start: string
}

interface HookInput {
  includeLastWeek?: boolean
}

export const useProgressStats = ({
  includeLastWeek = false,
}: HookInput = {}) => {
  const today = dayjs()

  const { data: stats, isLoading } = useQuery<Progress>({
    queryKey: ['stats'],
    queryFn: () => client('/habits/progress'),
  })

  const { data: lastWeek } = useQuery<WeekProgress>({
    queryKey: ['lastWeekStats'],
    queryFn: () =>
      client(
        `/habits/progress/week?date=${today.subtract(1, 'week').format('YYYY-MM-DD')}`,
      ),
    enabled: includeLastWeek,
  })

  // Today progress
  const todayCompleted = stats?.today_completed ?? 0
  const todayTotal = stats?.today_total ?? 0
  const progressPercent =
    todayTotal > 0 ? Math.floor((todayCompleted / todayTotal) * 100) : 0

  // Weekly rate
  const weeklyRate = Number(stats?.weekly_completion_rate ?? 0)
  const weeklyPercent = Math.floor(weeklyRate * 100)

  let weeklyColor = 'red.500'
  if (weeklyPercent >= 75) {
    weeklyColor = 'brand.success'
  } else if (weeklyPercent >= 50) {
    weeklyColor = 'yellow.400'
  } else if (weeklyPercent >= 25) {
    weeklyColor = 'orange.400'
  } else {
    weeklyColor = 'red.500'
  }

  // Week-over-week trend
  const thisWeekRate = weeklyRate
  const lastWeekRate = Number(lastWeek?.completion_rate ?? 0)

  const thisWeekPercentage = Math.floor(thisWeekRate * 100)
  const lastWeekPercentage = Math.floor(lastWeekRate * 100)

  const weekRatesDifference = thisWeekPercentage - lastWeekPercentage

  const weekTrendRateColor = (() => {
    if (weekRatesDifference > 0) return 'brand.success'
    if (weekRatesDifference === 0) return 'gray.500'
    return 'red.500'
  })()

  const trendIcon = (() => {
    if (weekRatesDifference > 0)
      return <ArrowUp size={16} stroke="#1fa751" className="float-animation" />
    if (weekRatesDifference < 0)
      return <ArrowDown size={16} stroke="red" className="float-animation" />
    return <Minus size={16} />
  })()

  return {
    isLoading,
    todayCompleted,
    todayTotal,
    progressPercent,
    weeklyPercent,
    weeklyColor,
    weekRatesDifference,
    weekTrendRateColor,
    lastWeek,
    trendIcon,
  }
}

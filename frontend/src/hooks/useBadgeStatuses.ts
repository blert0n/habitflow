import { useQuery } from '@tanstack/react-query'
import type { HabitStats } from '@/utils/badge-calculator'
import { client } from '@/util/client'

import {
  calculateAllBadges,
  getTotalBadgeProgress,
} from '@/utils/badge-calculator'

export function useHabitStats() {
  return useQuery({
    queryKey: ['habitStats'],
    queryFn: () => client('/habits/stats'),
  })
}

export function useBadgeStatuses() {
  const {
    data: habitStats,
    isLoading,
    error,
  } = useQuery<{ stats: Array<HabitStats> }>({
    queryKey: ['habitStats'],
    queryFn: () => client(`/habits/stats`),
    retry: false,
  })

  const bestStreak = Math.max(
    ...(habitStats?.stats ?? []).map((stat) => stat.max_streak),
  )

  const totalCompletions = (habitStats?.stats ?? []).reduce(
    (accumulator, current) => accumulator + current.total_completions,
    0,
  )

  const badgeStatuses = calculateAllBadges(habitStats?.stats ?? [])
  const progress = getTotalBadgeProgress(habitStats?.stats ?? [])

  return {
    bestStreak,
    totalCompletions,
    badgeStatuses,
    progress,
    isLoading,
    error,
  }
}

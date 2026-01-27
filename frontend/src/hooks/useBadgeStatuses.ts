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

  const badgeStatuses = calculateAllBadges(habitStats?.stats ?? [])
  const progress = getTotalBadgeProgress(habitStats?.stats ?? [])

  return {
    badgeStatuses,
    progress,
    isLoading,
    error,
  }
}

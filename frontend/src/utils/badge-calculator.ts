import { streakAchievements } from '../data/streak-achievements'
import { completionAchievements } from '../data/completion-achievements'
import { gamificationAchievements } from '../data/gamification-achievements'

export interface HabitStats {
  habit_id: number
  max_streak: number
  total_completions: number
  created_at: string
  updated_at: string
}

export interface BadgeRequirement {
  type: 'streak' | 'completion' | 'habits_count' | 'badge_count'
  value: number
}

const allAchievements = [
  ...streakAchievements,
  ...completionAchievements,
  ...gamificationAchievements,
]

export const badgeRequirements: Record<string, BadgeRequirement> =
  allAchievements.reduce(
    (acc, achievement) => {
      acc[achievement.id] = {
        type: achievement.type,
        value: achievement.value,
      }
      return acc
    },
    {} as Record<string, BadgeRequirement>,
  )

export interface BadgeStatus {
  isCompleted: boolean
  isLocked: boolean
}

export function calculateBadgeStatus(
  badgeId: string,
  stats: Array<HabitStats>,
): BadgeStatus {
  const requirement = badgeRequirements[badgeId] as BadgeRequirement | undefined

  if (!requirement) {
    return { isCompleted: false, isLocked: true }
  }

  switch (requirement.type) {
    case 'streak': {
      const maxStreak = Math.max(...stats.map((s) => s.max_streak), 0)
      const isCompleted = maxStreak >= requirement.value
      const isLocked = maxStreak < requirement.value / 2
      return { isCompleted, isLocked }
    }

    case 'completion': {
      const totalCompletions = stats.reduce(
        (sum, s) => sum + s.total_completions,
        0,
      )
      const isCompleted = totalCompletions >= requirement.value
      const isLocked = totalCompletions < requirement.value / 2
      return { isCompleted, isLocked }
    }

    case 'habits_count': {
      const habitsWithCompletions = stats.filter(
        (s) => s.total_completions > 0,
      ).length
      const isCompleted = habitsWithCompletions >= requirement.value
      const isLocked = habitsWithCompletions < requirement.value / 2
      return { isCompleted, isLocked }
    }

    case 'badge_count': {
      return { isCompleted: false, isLocked: false }
    }

    default:
      return { isCompleted: false, isLocked: true }
  }
}

export function calculateAllBadges(stats: Array<HabitStats>) {
  const badgeStatuses: Record<string, BadgeStatus> = {}

  for (const badgeId of Object.keys(badgeRequirements)) {
    const requirement = badgeRequirements[badgeId]
    if (requirement.type !== 'badge_count') {
      badgeStatuses[badgeId] = calculateBadgeStatus(badgeId, stats)
    }
  }

  const earnedCount = Object.values(badgeStatuses).filter(
    (s) => s.isCompleted,
  ).length

  for (const badgeId of Object.keys(badgeRequirements)) {
    const requirement = badgeRequirements[badgeId]
    if (requirement.type === 'badge_count') {
      const isCompleted = earnedCount >= requirement.value
      const isLocked = earnedCount < requirement.value / 2
      badgeStatuses[badgeId] = { isCompleted, isLocked }
    }
  }

  return badgeStatuses
}

export function getTotalBadgeProgress(stats: Array<HabitStats>): {
  earned: number
  total: number
  percentage: number
} {
  const badgeStatuses = calculateAllBadges(stats)
  const total = Object.keys(badgeRequirements).length
  const earned = Object.values(badgeStatuses).filter(
    (s) => s.isCompleted,
  ).length
  const percentage = total > 0 ? Math.round((earned / total) * 100) : 0

  return { earned, total, percentage }
}

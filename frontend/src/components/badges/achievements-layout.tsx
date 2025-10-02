import { Award, Check, Flame } from 'lucide-react'
import { Box, Flex } from '@chakra-ui/react'
import { BadgeCard } from '@/components/badges/badge-card'
import { CategorySection } from '@/components/badges/category-section'
import { streakAchievements } from '@/data/streak-achievements'
import { completionAchievements } from '@/data/completion-achievements'
import { gamificationAchievements } from '@/data/gamification-achievements'

export const AchievementsLayout = () => {
  return (
    <Box>
      <Flex direction="column" width="full" alignItems="stretch">
        {/* Streak-Based Achievements */}
        <CategorySection
          title="Streak-Based Achievements"
          icon={<Flame size={16} />}
          iconColor="white"
          iconBackground="#FF6B35"
        >
          {streakAchievements.map((achievement) => (
            <BadgeCard
              key={achievement.id}
              icon={achievement.icon}
              title={achievement.title}
              description={achievement.description}
              isCompleted={achievement.isCompleted}
              isLocked={achievement.isLocked}
              iconColor={achievement.iconColor}
              iconBackground={achievement.iconBackground}
            />
          ))}
        </CategorySection>

        {/* Habit Completion Achievements */}
        <CategorySection
          title="Habit Completion Achievements"
          icon={<Check size={16} />}
          iconColor="white"
          iconBackground="#10B981"
        >
          {completionAchievements.map((achievement) => (
            <BadgeCard
              key={achievement.id}
              icon={achievement.icon}
              title={achievement.title}
              description={achievement.description}
              isCompleted={achievement.isCompleted}
              isLocked={achievement.isLocked}
              iconColor={achievement.iconColor}
              iconBackground={achievement.iconBackground}
            />
          ))}
        </CategorySection>

        {/* Gamification & Fun */}
        <CategorySection
          title="Gamification & Fun"
          icon={<Award size={16} />}
          iconColor="white"
          iconBackground="#EC4899"
        >
          {gamificationAchievements.map((achievement) => (
            <BadgeCard
              key={achievement.id}
              icon={achievement.icon}
              title={achievement.title}
              description={achievement.description}
              isCompleted={achievement.isCompleted}
              isLocked={achievement.isLocked}
              iconColor={achievement.iconColor}
              iconBackground={achievement.iconBackground}
            />
          ))}
        </CategorySection>
      </Flex>
    </Box>
  )
}

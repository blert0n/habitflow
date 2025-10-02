import { Calendar, Flame, Star, Target, Trophy, Zap } from 'lucide-react'
import { Grid } from '@chakra-ui/react'
import { BadgeCard } from './badge-card'

export const BadgeGrid = () => {
  const badges = [
    {
      id: 1,
      icon: <Flame size={20} />,
      title: 'First Streak',
      description: '2 days in a row',
      isCompleted: true,
      iconColor: 'white',
      iconBackground: '#FF6B35',
    },
    {
      id: 2,
      icon: <Calendar size={20} />,
      title: 'Week Warrior',
      description: 'Complete 7 days straight',
      isCompleted: false,
      iconColor: 'white',
      iconBackground: '#4A90E2',
    },
    {
      id: 3,
      icon: <Target size={20} />,
      title: 'Goal Getter',
      description: 'Reach your monthly target',
      isCompleted: true,
      iconColor: 'white',
      iconBackground: '#50C878',
    },
    {
      id: 4,
      icon: <Trophy size={20} />,
      title: 'Champion',
      description: 'Complete 30 days',
      isCompleted: false,
      iconColor: 'white',
      iconBackground: '#FFD700',
    },
    {
      id: 5,
      icon: <Star size={20} />,
      title: 'Rising Star',
      description: 'Complete first habit',
      isCompleted: true,
      iconColor: 'white',
      iconBackground: '#9B59B6',
    },
    {
      id: 6,
      icon: <Zap size={20} />,
      title: 'Lightning Fast',
      description: '5 habits in one day',
      isCompleted: false,
      iconColor: 'white',
      iconBackground: '#F39C12',
    },
  ]

  return (
    <Grid
      templateColumns="repeat(auto-fit, minmax(200px, 1fr))"
      gap={4}
      width="100%"
      maxWidth="800px"
    >
      {badges.map((badge) => (
        <BadgeCard
          key={badge.id}
          icon={badge.icon}
          title={badge.title}
          description={badge.description}
          isCompleted={badge.isCompleted}
          iconColor={badge.iconColor}
          iconBackground={badge.iconBackground}
        />
      ))}
    </Grid>
  )
}

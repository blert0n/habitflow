import { Flex, SimpleGrid } from '@chakra-ui/react'
import {
  BookOpen,
  Brain,
  Briefcase,
  ClipboardList,
  Compass,
  Droplets,
  Dumbbell,
  HeartPulse,
  Moon,
  Palette,
  Plus,
  Star,
  Users,
} from 'lucide-react'
import { HeaderWithText } from '../ui/header-with-text'
import { Category } from './list-category'

const ICONS_MAP = {
  Dumbbell,
  BookOpen,
  Brain,
  HeartPulse,
  Moon,
  ClipboardList,
  Star,
  Droplets,
  Users,
  Palette,
  Briefcase,
  Plus,
  Compass,
}

type IconName = keyof typeof ICONS_MAP

const CATEGORIES = [
  {
    id: 1,
    label: 'Fitness',
    description: 'Exercise and physical health',
    icon: 'Dumbbell',
  },
  {
    id: 2,
    label: 'Learning',
    description: 'Reading, studying, and personal growth',
    icon: 'BookOpen',
  },
  {
    id: 3,
    label: 'Mental Health',
    description: 'Meditation and mindfulness habits',
    icon: 'Brain',
  },
  {
    id: 4,
    label: 'Health',
    description: 'Healthy habits and body care',
    icon: 'HeartPulse',
  },
  {
    id: 5,
    label: 'Sleep',
    description: 'Sleep and rest routines',
    icon: 'Moon',
  },
  {
    id: 6,
    label: 'Productivity',
    description: 'Planning and journaling tasks',
    icon: 'ClipboardList',
  },
  {
    id: 7,
    label: 'Spirituality',
    description: 'Gratitude, prayer, and self-reflection',
    icon: 'Star',
  },
  {
    id: 8,
    label: 'Personal Care',
    description: 'Hygiene and personal upkeep',
    icon: 'Droplets',
  },
  {
    id: 9,
    label: 'Relationships',
    description: 'Connecting with family and friends',
    icon: 'Users',
  },
  {
    id: 10,
    label: 'Creativity',
    description: 'Creative expression and hobbies',
    icon: 'Palette',
  },
  {
    id: 11,
    label: 'Work',
    description: 'Professional goals and tasks',
    icon: 'Briefcase',
  },
  {
    id: 12,
    label: 'Adventure',
    description: 'Travel, exploration, and new experiences',
    icon: 'Compass',
  },
]

const Categories = () => {
  return (
    <Flex direction="column" height="100%" paddingBottom="60px">
      <Flex
        justify="space-between"
        alignItems={{ base: 'start', sm: 'space-between' }}
        marginBottom={4}
        direction={{ base: 'column', sm: 'row' }}
        gap={2}
      >
        <HeaderWithText
          title="Categories"
          text="Organize your habits by categories"
        />
      </Flex>
      <SimpleGrid
        columns={{ base: 2, sm: 3 }}
        columnGap="2"
        rowGap="4"
        minChildWidth={{ base: 'full', sm: '256px' }}
      >
        {CATEGORIES.map((category) => {
          const Icon = ICONS_MAP[category.icon as IconName]
          return (
            <Category
              key={category.id}
              {...category}
              icon={<Icon strokeWidth={1} />}
            />
          )
        })}
      </SimpleGrid>
    </Flex>
  )
}

export { Categories }

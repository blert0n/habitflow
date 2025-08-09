// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { IconButton } from '@chakra-ui/react'
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
import type { JSX } from 'react'

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

interface CategoryWithIcon {
  id: number
  label: string
  description: string
  iconName: IconName
  icon: JSX.Element
}

export const useCategories = (): {
  categories: Array<CategoryWithIcon>
  getCategory: (id: number) => CategoryWithIcon | undefined
} => {
  const categories = [
    {
      id: 1,
      label: 'Fitness',
      description: 'Exercise and physical health',
      iconName: 'Dumbbell',
    },
    {
      id: 2,
      label: 'Learning',
      description: 'Reading, studying, and personal growth',
      iconName: 'BookOpen',
    },
    {
      id: 3,
      label: 'Mental Health',
      description: 'Meditation and mindfulness habits',
      iconName: 'Brain',
    },
    {
      id: 4,
      label: 'Health',
      description: 'Healthy habits and body care',
      iconName: 'HeartPulse',
    },
    {
      id: 5,
      label: 'Sleep',
      description: 'Sleep and rest routines',
      iconName: 'Moon',
    },
    {
      id: 6,
      label: 'Productivity',
      description: 'Planning and journaling tasks',
      iconName: 'ClipboardList',
    },
    {
      id: 7,
      label: 'Spirituality',
      description: 'Gratitude, prayer, and self-reflection',
      iconName: 'Star',
    },
    {
      id: 8,
      label: 'Personal Care',
      description: 'Hygiene and personal upkeep',
      iconName: 'Droplets',
    },
    {
      id: 9,
      label: 'Relationships',
      description: 'Connecting with family and friends',
      iconName: 'Users',
    },
    {
      id: 10,
      label: 'Creativity',
      description: 'Creative expression and hobbies',
      iconName: 'Palette',
    },
    {
      id: 11,
      label: 'Work',
      description: 'Professional goals and tasks',
      iconName: 'Briefcase',
    },
    {
      id: 12,
      label: 'Adventure',
      description: 'Travel, exploration, and new experiences',
      iconName: 'Compass',
    },
  ]

  const mappedCategories = categories.map((category) => {
    const IconComponent = ICONS_MAP[category.iconName]
    return {
      ...category,
      icon: <IconComponent strokeWidth={1.5} />,
    }
  })

  return {
    categories: mappedCategories,
    getCategory: (id: number) =>
      mappedCategories.find((category) => category.id === id) ??
      mappedCategories[0],
  }
}

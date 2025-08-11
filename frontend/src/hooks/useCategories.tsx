// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Box, IconButton } from '@chakra-ui/react'
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

export interface CategoryWithIcon {
  id: number
  label: string
  description: string
  iconName: IconName
  icon: JSX.Element
  colorStart: string
  colorEnd: string
  backgroundGradient: string
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
      colorStart: '#EF4444', // Red-500
      colorEnd: '#F87171', // Red-400
      backgroundGradient: 'linear-gradient(to left, #F87171, #EF4444)',
    },
    {
      id: 2,
      label: 'Learning',
      description: 'Reading, studying, and personal growth',
      iconName: 'BookOpen',
      colorStart: '#3B82F6', // Blue-500
      colorEnd: '#60A5FA', // Blue-400
      backgroundGradient: 'linear-gradient(to left, #60A5FA, #3B82F6)',
    },
    {
      id: 3,
      label: 'Mental Health',
      description: 'Meditation and mindfulness habits',
      iconName: 'Brain',
      colorStart: '#8B5CF6', // Purple-500
      colorEnd: '#A78BFA', // Purple-400
      backgroundGradient: 'linear-gradient(to left, #A78BFA, #8B5CF6)',
    },
    {
      id: 4,
      label: 'Health',
      description: 'Healthy habits and body care',
      iconName: 'HeartPulse',
      colorStart: '#10B981', // Green-500
      colorEnd: '#34D399', // Green-400
      backgroundGradient: 'linear-gradient(to left, #34D399, #10B981)',
    },
    {
      id: 5,
      label: 'Sleep',
      description: 'Sleep and rest routines',
      iconName: 'Moon',
      colorStart: '#6366F1', // Indigo-500
      colorEnd: '#818CF8', // Indigo-400
      backgroundGradient: 'linear-gradient(to left, #818CF8, #6366F1)',
    },
    {
      id: 6,
      label: 'Productivity',
      description: 'Planning and journaling tasks',
      iconName: 'ClipboardList',
      colorStart: '#F59E0B', // Amber-500
      colorEnd: '#FBBF24', // Amber-400
      backgroundGradient: 'linear-gradient(to left, #FBBF24, #F59E0B)',
    },
    {
      id: 7,
      label: 'Spirituality',
      description: 'Gratitude, prayer, and self-reflection',
      iconName: 'Star',
      colorStart: '#F43F5E', // Pink-500
      colorEnd: '#FB7185', // Pink-400
      backgroundGradient: 'linear-gradient(to left, #FB7185, #F43F5E)',
    },
    {
      id: 8,
      label: 'Personal Care',
      description: 'Hygiene and personal upkeep',
      iconName: 'Droplets',
      colorStart: '#3B82F6', // Blue-500
      colorEnd: '#60A5FA', // Blue-400
      backgroundGradient: 'linear-gradient(to left, #60A5FA, #3B82F6)',
    },
    {
      id: 9,
      label: 'Relationships',
      description: 'Connecting with family and friends',
      iconName: 'Users',
      colorStart: '#EF4444', // Red-500
      colorEnd: '#F87171', // Red-400
      backgroundGradient: 'linear-gradient(to left, #F87171, #EF4444)',
    },
    {
      id: 10,
      label: 'Creativity',
      description: 'Creative expression and hobbies',
      iconName: 'Palette',
      colorStart: '#D946EF', // Fuchsia-500
      colorEnd: '#E879F9', // Fuchsia-400
      backgroundGradient: 'linear-gradient(to left, #E879F9, #D946EF)',
    },
    {
      id: 11,
      label: 'Work',
      description: 'Professional goals and tasks',
      iconName: 'Briefcase',
      colorStart: '#2563EB', // Blue-600
      colorEnd: '#3B82F6', // Blue-500
      backgroundGradient: 'linear-gradient(to left, #3B82F6, #2563EB)',
    },
    {
      id: 12,
      label: 'Adventure',
      description: 'Travel, exploration, and new experiences',
      iconName: 'Compass',
      colorStart: '#F97316', // Orange-500
      colorEnd: '#FB923C', // Orange-400
      backgroundGradient: 'linear-gradient(to left, #FB923C, #F97316)',
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

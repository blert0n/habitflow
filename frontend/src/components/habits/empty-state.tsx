import { Box, Flex, IconButton, SimpleGrid, Text } from '@chakra-ui/react'
import {
  BookOpen,
  Briefcase,
  ClipboardList,
  Compass,
  Dumbbell,
  HeartPulse,
  List,
  Plus,
} from 'lucide-react'

const ICONS_MAP = {
  Dumbbell,
  BookOpen,
  HeartPulse,
  ClipboardList,
  Briefcase,
  Compass,
}

type IconName = keyof typeof ICONS_MAP

interface Example {
  label: string
  description: string
  iconName: IconName
}

const EXAMPLES: Array<Example> = [
  {
    label: 'Fitness',
    description: 'Exercise and physical health',
    iconName: 'Dumbbell',
  },
  {
    label: 'Learning',
    description: 'Reading, studying, and personal growth',
    iconName: 'BookOpen',
  },
  {
    label: 'Health',
    description: 'Healthy habits and body care',
    iconName: 'HeartPulse',
  },
  {
    label: 'Productivity',
    description: 'Planning and journaling tasks',
    iconName: 'ClipboardList',
  },
  {
    label: 'Work',
    description: 'Professional goals and tasks',
    iconName: 'Briefcase',
  },
  {
    label: 'Adventure',
    description: 'Travel, exploration, and new experiences',
    iconName: 'Compass',
  },
]

interface P {
  toggleCreateView: () => void
}

const EmptyState = ({ toggleCreateView }: P) => {
  return (
    <Flex direction="column" gap={4} width="full">
      <Flex justifyContent="center">
        <Box
          width={32}
          height={32}
          rounded="full"
          borderRadius="full"
          bg="#e6effc"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <List size={48} color="#a1a1aa" />
        </Box>
      </Flex>
      <Text textAlign="center" color="gray.700">
        No habits created yet!
      </Text>
      <Flex justifyContent="center" width="full">
        <Text
          textAlign="center"
          color="gray.500"
          maxWidth="400px"
          fontSize={14}
        >
          Start building better habits today. Create your first habit and begin
          your journey to a more productive lifestyle.
        </Text>
      </Flex>
      <Flex justifyContent="center" width="full" onClick={toggleCreateView}>
        <IconButton p={4} variant="primary" borderRadius="lg">
          <Plus />
          Create your first habit
        </IconButton>
      </Flex>
      <Flex justifyContent="center" width="full">
        <Box
          minWidth="400px"
          maxWidth="400px"
          bg="white"
          borderRadius="2xl"
          borderColor="gray.300"
          borderWidth={1}
          padding={4}
        >
          <Text color="gray.500" maxWidth="400px" fontSize={14} mb={2}>
            Popular Habit Ideas
          </Text>
          <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4}>
            {EXAMPLES.map((example) => {
              const Icon = ICONS_MAP[example.iconName]
              return (
                <Flex key={example.label} gap={2} alignItems="center">
                  <IconButton
                    borderRadius="lg"
                    bg="linear-gradient(to left, #60A5FA, #3B82F6)"
                  >
                    <Icon />
                  </IconButton>
                  <Flex direction="column" justifyContent="space-between">
                    <Text color="gray.700" fontSize={14}>
                      {example.label}
                    </Text>
                    <Text color="gray.500" fontSize={10}>
                      {example.description}
                    </Text>
                  </Flex>
                </Flex>
              )
            })}
          </SimpleGrid>
        </Box>
      </Flex>
    </Flex>
  )
}

export { EmptyState }

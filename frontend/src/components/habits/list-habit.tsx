import { Flex, IconButton, Progress, Text } from '@chakra-ui/react'
import { EllipsisVertical } from 'lucide-react'
import { HeaderWithText } from '../ui/header-with-text'
import { ScheduledWeekDays } from './scheduled-week-days'
import type { AllowedDayString } from './types'
import type { CategoryWithIcon } from '@/hooks/useCategories'

interface P {
  title: string
  text: string
  category?: CategoryWithIcon
  selectedDays?: Array<AllowedDayString>
  isDaily?: boolean
}

const ListHabit = ({
  title,
  text,
  category,
  selectedDays,
  isDaily = false,
}: P) => {
  return (
    <Flex
      w={{ midSmDown: 'full' }}
      maxW="300px"
      borderRadius="2xl"
      borderColor="gray.300"
      borderWidth={1}
      padding={4}
      bgColor="white"
      direction="column"
      gap={2}
      className="app-box-shadow"
    >
      <Flex justify="space-between" alignItems="center" width="full">
        <Flex gap={2}>
          <IconButton
            borderRadius="lg"
            bg="linear-gradient(to left, #60A5FA, #3B82F6)"
          >
            {category?.icon}
          </IconButton>
          <Flex justify="space-between" height="full">
            <HeaderWithText
              title={title || 'Habit name'}
              text={text}
              titleFontSize="sm"
              textFontSize="12px"
            />
          </Flex>
        </Flex>
        <IconButton variant="ghost">
          <EllipsisVertical />
        </IconButton>
      </Flex>
      <Flex direction="column">
        <Flex direction="column">
          <Progress.Root
            variant="subtle"
            size="xs"
            shape="rounded"
            value={isDaily ? 7 : (selectedDays ?? []).length}
            max={7}
          >
            <Progress.Label fontWeight="normal" width="full">
              <Flex justify="space-between" alignItems="center" width="full">
                <Text color="gray.700" fontSize={12}>
                  This week
                </Text>
                <Text color="gray.700" fontSize={12}>
                  {isDaily ? 7 : (selectedDays ?? []).length} / 7 days
                </Text>
              </Flex>
            </Progress.Label>
            <Progress.Track
              style={{
                backgroundColor: 'linear-gradient(to left, #60A5FA, #3B82F6)',
                borderRadius: 12,
              }}
            >
              <Progress.Range
                style={{
                  background: 'linear-gradient(to left, #60A5FA, #3B82F6)',
                  borderRadius: 12,
                }}
              />
            </Progress.Track>
          </Progress.Root>
        </Flex>
      </Flex>
      <Flex gap={1} wrap="wrap">
        <ScheduledWeekDays
          activeColor="linear-gradient(to left, #60A5FA, #3B82F6)"
          selectedDays={selectedDays ?? []}
          isDaily={isDaily}
        />
      </Flex>
    </Flex>
  )
}

export { ListHabit }

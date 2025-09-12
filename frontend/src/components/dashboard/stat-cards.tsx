import { Flex, Skeleton, SkeletonText } from '@chakra-ui/react'
import { Text } from '@chakra-ui/react/text'
import { Progress } from '@chakra-ui/react/progress'
import { Flame } from 'lucide-react'
import { useProgressStats } from '@/hooks/useProgressQuery'

const StatCardSkeleton = () => (
  <Flex
    direction="column"
    justifyContent="space-between"
    flex={1}
    padding={{ base: 4, sm: 2, md: 4 }}
    maxW={{ base: '100%', sm: '400px', md: '600px' }}
    bg="white"
    borderRadius="lg"
    borderWidth="1px"
    borderColor="gray.200"
    gap={4}
    className="app-box-shadow"
  >
    <Skeleton height="24px" width="60%" />
    <SkeletonText mt="4" noOfLines={2} gap={2} />
  </Flex>
)
interface Progress {
  today_completed: number
  today_total: number
  weekly_completion_rate: number
  week_completions: number
  total_possible: number
}

const StatCards = () => {
  const {
    isLoading,
    progressPercent,
    weeklyColor,
    weekRatesDifference,
    trendIcon,
    weekTrendRateColor,
    weeklyPercent,
    todayCompleted,
    todayTotal,
  } = useProgressStats({
    includeLastWeek: true,
  })

  if (isLoading) {
    return (
      <Flex
        direction={{ base: 'column', sm: 'row' }}
        gap={{ base: 4, sm: 2, md: 4 }}
        flex={1}
        justifyContent="space-between"
      >
        {Array.from({ length: 3 }).map((_, idx) => (
          <StatCardSkeleton key={idx} />
        ))}
      </Flex>
    )
  }

  return (
    <Flex
      direction={{ base: 'column', sm: 'row' }}
      gap={{ base: 4, sm: 2, md: 4 }}
      flex={1}
      justifyContent="space-between"
    >
      <Flex
        direction="column"
        justifyContent="space-between"
        flex={1}
        padding={{ base: 4, sm: 2, md: 4 }}
        maxW={{ base: '100%', sm: '400px', md: '600px' }}
        bg="white"
        borderRadius="lg"
        borderWidth="1px"
        borderColor="gray.200"
        gap={4}
        className="app-box-shadow"
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Text color="gray.800" fontSize={18} fontWeight={400}>
            Today's progress
          </Text>
          <Text color="brand.primary" fontSize={24} fontWeight="semibold">
            {progressPercent}%
          </Text>
        </Flex>
        <Flex direction="column">
          <Progress.Root
            variant="subtle"
            size="lg"
            shape="rounded"
            value={progressPercent}
            max={100}
            colorPalette="blue"
          >
            <Progress.Track borderRadius="4xl">
              <Progress.Range />
            </Progress.Track>
            <Progress.Label fontWeight="normal">
              <Text color="gray.700" fontSize={12}>
                {todayTotal
                  ? `${todayCompleted}/${todayTotal} habits completed`
                  : `No habits scheduled today`}
              </Text>
            </Progress.Label>
          </Progress.Root>
        </Flex>
      </Flex>

      <Flex
        direction="column"
        justifyContent="space-between"
        flex={1}
        padding={{ base: 4, sm: 2, md: 4 }}
        maxW={{ base: '100%', sm: '400px', md: '600px' }}
        bg="white"
        borderRadius="lg"
        borderWidth="1px"
        borderColor="gray.200"
        gap={4}
        className="app-box-shadow"
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Text color="gray.800" fontSize={18} fontWeight={400}>
            Streak
          </Text>
          <Text color="brand.streak" fontSize={24} fontWeight="semibold">
            12
          </Text>
        </Flex>
        <Flex direction="column" gap={1}>
          <Text color="gray.700" fontSize={12}>
            Days in a row
          </Text>
          <Flex alignItems="flex-end">
            <Flame
              size={16}
              stroke="#DD6B20"
              fill="#F6AD55"
              className="float-animation"
            />
            <Text
              color="brand.streak"
              fontWeight="semibold"
              fontSize={{ base: 12, sm: 10, md: 12 }}
            >
              Keep it up!
            </Text>
          </Flex>
        </Flex>
      </Flex>

      <Flex
        direction="column"
        justifyContent="space-between"
        flex={1}
        padding={{ base: 4, sm: 2, md: 4 }}
        maxW={{ base: '100%', sm: '400px', md: '600px' }}
        bg="white"
        borderRadius="lg"
        borderWidth="1px"
        borderColor="gray.200"
        gap={4}
        className="app-box-shadow"
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Text color="gray.800" fontSize={18} fontWeight={400}>
            This week
          </Text>
          <Text color={weeklyColor} fontSize={24} fontWeight="semibold">
            {weeklyPercent}%
          </Text>
        </Flex>
        <Flex direction="column" gap={1}>
          <Text color="gray.700" fontSize={{ base: 12, sm: 10, md: 12 }}>
            Average completion rate
          </Text>
          <Flex alignItems="flex-end">
            {trendIcon}
            <Text
              color={weekTrendRateColor}
              fontWeight="semibold"
              fontSize={{ base: 12, sm: 10, md: 12 }}
            >
              {weekRatesDifference > 0
                ? `+${weekRatesDifference}%`
                : `${weekRatesDifference}%`}{' '}
              from last week
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export { StatCards }

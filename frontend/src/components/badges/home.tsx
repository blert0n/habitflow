import { Trophy } from 'lucide-react'
import { Box, Flex, Progress, Spinner, Text } from '@chakra-ui/react'
import { HeaderWithText } from '../ui/header-with-text'
import { useBadgeStatuses } from '@/hooks/useBadgeStatuses'

const AppBadges = () => {
  const { progress, isLoading } = useBadgeStatuses()

  return (
    <Flex direction="column" paddingBottom="60px">
      <Flex
        direction={{ base: 'column', sm: 'row' }}
        justify={{ base: 'start', sm: 'space-between' }}
        alignItems={{ base: 'start', sm: 'center' }}
        gap={{ base: 2, sm: 0 }}
        w="full"
        mb={4}
      >
        <HeaderWithText
          title="Badges & Achievements"
          text="Track your milestones and celebrate your progress"
        />
        <Flex
          gap={3}
          background="white"
          p={4}
          borderRadius="16px"
          border="1px solid"
          borderColor="gray.100"
          boxShadow="sm"
          alignItems="center"
          minW="280px"
        >
          <Box
            background="linear-gradient(to bottom right, #fbbf24, #f59e0b)"
            borderRadius="12px"
            padding={2}
            boxShadow="md"
          >
            <Trophy strokeWidth={1.5} color="white" size={18} />
          </Box>
          <Flex direction="column" gap={2} flex={1}>
            {isLoading ? (
              <Spinner size="sm" />
            ) : (
              <>
                <Text fontSize="sm" color="gray.700" fontWeight="600">
                  {progress.earned} of {progress.total} badges earned
                </Text>
                <Progress.Root
                  variant="outline"
                  size="md"
                  shape="rounded"
                  value={progress.percentage}
                  max={100}
                  colorPalette="orange"
                >
                  <Progress.Track borderRadius="4xl" bg="gray.100">
                    <Progress.Range background="linear-gradient(to right, #fbbf24, #f59e0b)" />
                  </Progress.Track>
                </Progress.Root>
              </>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export { AppBadges }

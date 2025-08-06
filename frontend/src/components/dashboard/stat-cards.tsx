import { Flex } from '@chakra-ui/react/flex'
import { Text } from '@chakra-ui/react/text'
import { Progress } from '@chakra-ui/react/progress'
import { ArrowUp, Flame } from 'lucide-react'

const StatCards = () => {
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
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Text color="gray.800" fontSize={14} fontWeight={400}>
            Today's progress
          </Text>
          <Text color="gray.700" fontSize={16}>
            75%
          </Text>
        </Flex>
        <Flex direction="column">
          <Progress.Root
            variant="subtle"
            size="xs"
            shape="rounded"
            value={75}
            max={100}
          >
            <Progress.Track>
              <Progress.Range />
            </Progress.Track>
            <Progress.Label fontWeight="normal">
              <Text color="gray.700" fontSize={12}>
                3 of 4 habits completed
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
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Text color="gray.800" fontSize={14} fontWeight={400}>
            Streak
          </Text>
          <Text color="gray.700" fontSize={16}>
            12
          </Text>
        </Flex>
        <Flex direction="column" gap={1}>
          <Text color="gray.700" fontSize={12}>
            Days in a row
          </Text>
          <Flex alignItems="flex-end">
            <Flame size={16} stroke="#DD6B20" fill="#F6AD55" />
            <Text color="gray.700" fontSize={{ base: 12, sm: 10, md: 12 }}>
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
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Text color="gray.800" fontSize={14} fontWeight={400}>
            This week
          </Text>
          <Text color="gray.700" fontSize={16}>
            85%
          </Text>
        </Flex>
        <Flex direction="column" gap={1}>
          <Text color="gray.700" fontSize={{ base: 12, sm: 10, md: 12 }}>
            Average completion rate
          </Text>
          <Flex alignItems="flex-end">
            <ArrowUp size={16} />
            <Text color="gray.700" fontSize={12}>
              +5% from last week
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export { StatCards }

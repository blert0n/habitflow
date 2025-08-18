import { Box, Flex, HStack, Skeleton, SkeletonCircle } from '@chakra-ui/react'

export const LoadingHabit = () => {
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
      <Flex align="center" mb={4}>
        <SkeletonCircle size="10" mr={4} />
        <Box flex="1">
          <Skeleton height="20px" mb={2} />
          <Skeleton height="14px" width="70%" />
        </Box>
        <Skeleton height="4" width="4" borderRadius="md" ml={2} />
      </Flex>

      <Skeleton height="10px" borderRadius="full" mb={4} />

      <HStack gap={2}>
        {Array.from({ length: 7 }).map((_, idx) => (
          <Skeleton key={idx} height="24px" width="24px" borderRadius="md" />
        ))}
      </HStack>
    </Flex>
  )
}

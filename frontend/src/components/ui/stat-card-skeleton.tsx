import { Flex, Skeleton, SkeletonText } from '@chakra-ui/react'

export const StatCardSkeleton = () => (
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

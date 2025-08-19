'use client'

import { Flex, Skeleton, SkeletonText } from '@chakra-ui/react'

interface HabitSkeletonProps {
  count?: number
}

const HabitSkeletonSm = ({ count = 3 }: HabitSkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <Flex
          key={idx}
          justifyContent="space-between"
          alignItems="center"
          padding={2}
          flex={1}
          gap={2}
          borderRadius="lg"
          borderWidth="1px"
          borderColor="gray.200"
          mb={2}
          height="48px"
        >
          <Skeleton height="20px" width="20px" borderRadius="full" />

          <Flex direction="column" flex={1} gap={1}>
            <SkeletonText noOfLines={1} gap="2" height="10px" width="60%" />
            <SkeletonText noOfLines={1} gap="2" height="8px" width="40%" />
          </Flex>
        </Flex>
      ))}
    </>
  )
}

export { HabitSkeletonSm }

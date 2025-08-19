'use client'

import { Flex, Skeleton, SkeletonText } from '@chakra-ui/react'

interface NoteSkeletonProps {
  count?: number
  gap?: number | string
}

const NoteSkeleton = ({ count = 1, gap = 2 }: NoteSkeletonProps) => {
  return (
    <Flex direction="column" gap={gap}>
      {Array.from({ length: count }).map((_, idx) => (
        <Flex
          key={idx}
          direction="column"
          padding={2}
          gap={1}
          borderRadius="sm"
          borderWidth="1px"
          borderColor="gray.200"
          bg="white"
        >
          <Flex justify="space-between" align="flex-start" gap={2}>
            <Skeleton height="14px" width="70%" borderRadius="sm" />
            <Skeleton height="10px" width="30px" borderRadius="sm" />
          </Flex>

          <SkeletonText mt="2" noOfLines={2} gap="2" height="12px" />
        </Flex>
      ))}
    </Flex>
  )
}

export { NoteSkeleton }

'use client'

import { Box, Flex, Skeleton, SkeletonCircle } from '@chakra-ui/react'

export const CalendarDayLgSkeleton = () => {
  return (
    <Flex
      width="100%"
      height={{ base: '85px', sm: '100px' }}
      fontSize="xs"
      bg="gray.100"
      borderRadius="md"
      borderWidth="1px"
      borderColor="gray.200"
      direction="column"
      gap={1}
      padding={1}
    >
      {/* Date badge skeleton */}
      <Skeleton
        height={{ base: '18px', sm: '22px' }}
        width={{ base: '28px', sm: '34px' }}
        borderRadius="full"
      />

      {/* Habits dots skeleton */}
      <Box
        display="grid"
        gridTemplateColumns={{ base: 'repeat(4, 8px)', sm: 'repeat(4, 12px)' }}
        gap="2px"
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCircle key={i} size={{ base: '8px', sm: '12px' }} />
        ))}
      </Box>
    </Flex>
  )
}

'use client'

import { Box, Flex, Text } from '@chakra-ui/react'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'

interface P {
  day: Dayjs
  currentDate: Dayjs
  selectedDate?: Dayjs | null
  onSelect?: (date: Dayjs) => void
}

const colors = ['red.500', 'green.500', 'blue.500', 'purple.500']

export const CalendarDayLg = ({
  day,
  currentDate,
  selectedDate,
  onSelect,
}: P) => {
  const isCurrentDate = dayjs(day).isSame(currentDate, 'month')
  const isSelected = selectedDate
    ? dayjs(day).isSame(selectedDate, 'day')
    : dayjs(day).isSame(currentDate, 'day')
  const date = dayjs(day).format('D')

  const dots = Array.from({ length: Math.floor(Math.random() * 8) + 1 })

  return (
    <Flex
      width="100%"
      height={{ base: '85px', sm: '100px' }}
      fontSize="xs"
      fontWeight={isCurrentDate ? 'medium' : 'normal'}
      colorScheme="blackAlpha"
      bg={isCurrentDate ? 'white' : 'gray.100'}
      borderRadius="md"
      cursor="pointer"
      transition="background-color 0.2s ease"
      borderWidth="1px"
      borderColor="gray.200"
      _hover={{ borderColor: 'gray.400' }}
      direction="column"
      gap={1}
      padding={1}
      onClick={() => {
        onSelect?.(day)
      }}
    >
      <Text
        color={isSelected ? 'white' : isCurrentDate ? 'gray.900' : 'gray.400'}
        bg={isSelected ? 'gray.900' : isCurrentDate ? 'white' : 'gray.100'}
        width="fit-content"
        paddingX={{ base: 1, sm: 2 }}
        paddingY={{ base: 1 / 2, sm: 2 }}
        rounded="full"
      >
        {date}
      </Text>
      <Box
        display="grid"
        gridTemplateColumns={{ base: 'repeat(4, 8px)', sm: 'repeat(4, 12px)' }}
        gap="2px"
      >
        {dots.map((_, i) => {
          const randomColor = colors[Math.floor(Math.random() * colors.length)]

          return (
            <Box
              key={i}
              boxSize={{ base: '8px', sm: '12px' }}
              borderRadius="full"
              bg={randomColor}
            />
          )
        })}
      </Box>
    </Flex>
  )
}

'use client'

import { Box, Flex, Text } from '@chakra-ui/react'
import { format, isSameDay, isSameMonth } from 'date-fns'

interface P {
  day: Date
  currentDate: Date
  selectedDate: Date | null
}

export const CalendarDayLg = ({ day, currentDate, selectedDate }: P) => {
  const isCurrentDate = isSameMonth(day, currentDate)
  const isSelected = selectedDate && isSameDay(day, selectedDate)

  const date = format(day, 'd')

  const dots = Array.from({ length: Math.floor(Math.random() * 8) + 1 })

  return (
    <Flex
      width="100%"
      height={{ base: '85px', sm: '100px' }}
      fontSize="xs"
      fontWeight={isCurrentDate ? 'medium' : 'normal'}
      colorScheme="blackAlpha"
      _hover={{ bg: 'white' }}
      borderRadius="md"
      cursor="pointer"
      transition="background-color 0.2s ease"
      // position="relative"
      borderWidth="1px"
      borderColor="gray.200"
      direction="column"
      gap={1}
      padding={1}
    >
      <Text
        color={isSelected ? 'white' : isCurrentDate ? 'gray.900' : 'gray.400'}
        bg={isSelected ? 'gray.900' : 'white'}
        width="fit-content"
        paddingX={2}
        paddingY={1}
        rounded="full"
      >
        {date}
      </Text>
      <Flex gap="1px" wrap="wrap">
        {dots.map((_, i) => (
          <Box key={i} boxSize="8px" borderRadius="full" bg="gray.700" />
        ))}
      </Flex>
    </Flex>
  )
}

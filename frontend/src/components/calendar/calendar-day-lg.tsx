'use client'

import { useState } from 'react'
import { Box, Flex, Portal, Text } from '@chakra-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import dayjs from 'dayjs'
import tinycolor from 'tinycolor2'
import type { Habit } from '@/types/habits'
import type { Dayjs } from 'dayjs'

interface P {
  day: Dayjs
  currentDate: Dayjs
  selectedDate?: Dayjs | null
  habits?: Array<Habit>
  visibleHabits?: Array<Habit & { selected: boolean }>
  onSelect?: (date: Dayjs) => void
}

export const CalendarDayLg = ({
  day,
  currentDate,
  selectedDate,
  habits,
  visibleHabits,
  onSelect,
}: P) => {
  const [showPopover, setShowPopover] = useState(false)
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 })

  const isToday = day.isSame(dayjs(), 'day')
  const isCurrentDate = day.isSame(currentDate, 'month')

  const isSelected = selectedDate
    ? day.isSame(selectedDate, 'day') && day.isSame(selectedDate, 'month')
    : isToday

  const date = dayjs(day).format('D')
  const isTodayInCurrentMonth = isToday && isCurrentDate && !isSelected

  const visibleHabitsFiltered = (habits ?? []).filter(
    (habit) => visibleHabits?.find((vh) => vh.id === habit.id)?.selected,
  )

  const totalVisibleHabits = visibleHabitsFiltered.length
  const completedHabits = visibleHabitsFiltered.filter(
    (habit) => habit.isCompleted,
  ).length

  const firstThreeHabits = visibleHabitsFiltered.slice(0, 3)
  const remainingHabits = visibleHabitsFiltered.slice(3)

  return (
    <Flex
      width="100%"
      height={{ base: '110px', sm: '130px' }}
      fontSize="xs"
      fontWeight={isCurrentDate ? 'medium' : 'normal'}
      colorScheme="blackAlpha"
      bg={isCurrentDate ? 'white' : 'gray.100'}
      border="1px solid"
      borderColor={isCurrentDate ? 'gray.200' : 'gray.200'}
      borderRadius={{ base: 'lg', sm: 'xl' }}
      p={{ base: 0.5, sm: 1 }}
      boxShadow={isCurrentDate ? 'sm' : 'none'}
      cursor="pointer"
      transition="all 0.2s ease"
      // opacity={isCurrentDate ? 1 : 0.8}
      _hover={{
        transform: {
          base: 'none',
          sm: isCurrentDate ? 'translateY(-2px)' : 'none',
        },
        boxShadow: { base: 'sm', sm: isCurrentDate ? 'md' : 'none' },
        borderColor: isCurrentDate ? 'blue.200' : 'gray.200',
        bg: isCurrentDate ? '#fafbff' : 'gray.50',
        opacity: isCurrentDate ? 1 : 0.9,
      }}
      direction="column"
      gap={0.5}
      onClick={() => {
        onSelect?.(day)
      }}
    >
      {/* Date Number */}
      <Flex justify="space-between" align="center" p={{ base: 1, sm: 0 }}>
        <Text
          color={
            isSelected
              ? 'white'
              : isTodayInCurrentMonth
                ? 'blue.600'
                : isCurrentDate
                  ? 'gray.900'
                  : 'gray.500'
          }
          bg={isSelected ? 'brand.primary' : 'transparent'}
          border="1px solid"
          borderColor={
            isSelected
              ? 'brand.primary'
              : isTodayInCurrentMonth
                ? 'blue.300'
                : 'transparent'
          }
          width="fit-content"
          minWidth={{ base: '20px', sm: '24px' }}
          height={{ base: '20px', sm: '24px' }}
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize={{ base: 'xs', sm: 'sm' }}
          fontWeight={isCurrentDate ? 'semibold' : 'medium'}
          rounded="full"
        >
          {date}
        </Text>

        {remainingHabits.length > 0 && (
          <Box position="relative">
            <Text
              fontSize={{ base: '8px', sm: '9px' }}
              color="gray.500"
              fontWeight="medium"
              cursor="pointer"
              px={1.5}
              py={0.5}
              bg="gray.50"
              borderRadius="sm"
              border="1px solid"
              borderColor="gray.200"
              transition="all 0.2s"
              _hover={{ bg: 'gray.100', borderColor: 'gray.300' }}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                setPopoverPosition({ x: rect.left, y: rect.bottom + 5 })
                setShowPopover(true)
              }}
              onMouseLeave={() => setShowPopover(false)}
            >
              +{remainingHabits.length}
            </Text>

            <AnimatePresence>
              {showPopover && (
                <Portal>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -5 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      position: 'fixed',
                      left: popoverPosition.x,
                      top: popoverPosition.y,
                      zIndex: 9999,
                    }}
                    onMouseEnter={() => setShowPopover(true)}
                    onMouseLeave={() => setShowPopover(false)}
                  >
                    <Box
                      maxW="200px"
                      p={2}
                      bg="white"
                      borderRadius="md"
                      boxShadow="lg"
                      border="1px solid"
                      borderColor="gray.200"
                    >
                      <Flex direction="column" gap={1}>
                        {remainingHabits.map((habit) => {
                          const primaryColor = habit.color
                          const lightBg = tinycolor(primaryColor)
                            .setAlpha(0.15)
                            .toString()
                          const incompleteBg = tinycolor(primaryColor)
                            .setAlpha(0.05)
                            .toString()
                          const incompleteBorder = tinycolor(primaryColor)
                            .setAlpha(0.3)
                            .toString()

                          return (
                            <Flex
                              key={`popover-${habit.id}`}
                              align="center"
                              gap={1}
                              px={1.5}
                              py={0.5}
                              bg={habit.isCompleted ? lightBg : incompleteBg}
                              borderRadius="sm"
                              border="1px solid"
                              borderColor={
                                habit.isCompleted
                                  ? primaryColor
                                  : incompleteBorder
                              }
                            >
                              <Box
                                width="6px"
                                height="6px"
                                bg={primaryColor}
                                borderRadius="full"
                                flexShrink={0}
                              />
                              <Text
                                fontSize="10px"
                                fontWeight="medium"
                                color={
                                  habit.isCompleted ? 'gray.900' : 'gray.700'
                                }
                                flex={1}
                                overflow="hidden"
                                textOverflow="ellipsis"
                                whiteSpace="nowrap"
                              >
                                {habit.name}
                              </Text>
                              {habit.isCompleted && (
                                <Flex
                                  align="center"
                                  justify="center"
                                  w="14px"
                                  h="14px"
                                  bg={primaryColor}
                                  borderRadius="full"
                                  flexShrink={0}
                                >
                                  <Text
                                    fontSize="10px"
                                    color="white"
                                    fontWeight="bold"
                                    lineHeight="1"
                                  >
                                    ✓
                                  </Text>
                                </Flex>
                              )}
                            </Flex>
                          )
                        })}
                      </Flex>
                    </Box>
                  </motion.div>
                </Portal>
              )}
            </AnimatePresence>
          </Box>
        )}
      </Flex>

      {/* Habits List */}
      <Flex
        flex={1}
        direction="column"
        gap={{ base: 0.5, sm: 0.5 }}
        overflow="hidden"
        p={0}
      >
        {firstThreeHabits.map((habit) => {
          const primaryColor = habit.color
          const lightBg = tinycolor(primaryColor).setAlpha(0.15).toString()
          const incompleteBg = tinycolor(primaryColor).setAlpha(0.05).toString()
          const incompleteBorder = tinycolor(primaryColor)
            .setAlpha(0.3)
            .toString()

          return (
            <Flex
              key={`${currentDate.format('YYYY-MM-DD')}-${habit.id}`}
              align="center"
              gap={{ base: 0.5, sm: 1 }}
              px={{ base: 1, sm: 1.5 }}
              py={{ base: 0.5, sm: 0.5 }}
              bg={habit.isCompleted ? lightBg : incompleteBg}
              borderRadius="sm"
              border="1px solid"
              borderColor={habit.isCompleted ? primaryColor : incompleteBorder}
              transition="all 0.2s"
            >
              <Box
                width={{ base: '5px', sm: '6px' }}
                height={{ base: '5px', sm: '6px' }}
                bg={primaryColor}
                borderRadius="full"
                flexShrink={0}
              />
              <Text
                fontSize={{ base: '9px', sm: '10px' }}
                fontWeight="medium"
                color={habit.isCompleted ? 'gray.900' : 'gray.700'}
                flex={1}
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
              >
                {habit.name}
              </Text>
              {habit.isCompleted && (
                <Flex
                  align="center"
                  justify="center"
                  w="14px"
                  h="14px"
                  bg={primaryColor}
                  borderRadius="full"
                  flexShrink={0}
                >
                  <Text
                    fontSize="10px"
                    color="white"
                    fontWeight="bold"
                    lineHeight="1"
                  >
                    ✓
                  </Text>
                </Flex>
              )}
            </Flex>
          )
        })}
      </Flex>

      {/* Completion Indicator */}
      {totalVisibleHabits > 0 && (
        <Box
          mt="auto"
          px={{ base: 1.5, sm: 2 }}
          py={{ base: 0.5, sm: 1 }}
          bg={
            completedHabits === totalVisibleHabits
              ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05))'
              : completedHabits > 0
                ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(251, 191, 36, 0.05))'
                : 'linear-gradient(135deg, rgba(156, 163, 175, 0.1), rgba(156, 163, 175, 0.05))'
          }
          borderRadius="full"
          border="1px solid"
          borderColor={
            completedHabits === totalVisibleHabits
              ? 'rgba(34, 197, 94, 0.2)'
              : completedHabits > 0
                ? 'rgba(251, 191, 36, 0.2)'
                : 'rgba(156, 163, 175, 0.2)'
          }
        >
          <Text
            fontSize={{ base: '12px', sm: '10px' }}
            fontWeight="medium"
            color={
              completedHabits === totalVisibleHabits
                ? 'green.700'
                : completedHabits > 0
                  ? 'yellow.700'
                  : 'gray.600'
            }
            textAlign="center"
            lineHeight="1"
          >
            {completedHabits}/{totalVisibleHabits}
          </Text>
        </Box>
      )}
    </Flex>
  )
}

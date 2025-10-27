'use client'
import { Box, Flex, Text } from '@chakra-ui/react'
import dayjs from 'dayjs'
import { Tags } from 'lucide-react'
import { formatFriendlyDate } from '@/util/dates'

interface NoteProps {
  title: string
  note: string
  date: string
  habit?: string
  onClick?: () => void
}

const Note = ({ title, note, date, habit, onClick }: NoteProps) => {
  return (
    <Flex
      direction="column"
      gap={1}
      py={2}
      px={{ base: 3, sm: 4 }}
      borderRadius="xl"
      borderWidth="1px"
      borderColor="#fef7c0"
      bg="#fefce8"
      _hover={{
        bgColor: '#fef7c0',
        transform: 'translateY(-1px)',
      }}
      cursor="pointer"
      onClick={() => onClick?.()}
      transition="all 0.2s ease"
      position="relative"
    >
      <Text
        color="gray.600"
        fontWeight="semibold"
        fontSize="sm"
        lineHeight="1.5"
        overflow="hidden"
        css={{
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {title}
      </Text>
      <Text
        color="gray.800"
        fontSize="xs"
        lineHeight="1.5"
        overflow="hidden"
        maxHeight="36px"
        css={{
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {note}
      </Text>
      <Flex justify="space-between" align="center">
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          bg="white"
          py={0.5}
          px={1}
          borderWidth="1px"
          borderColor="gray.100"
          borderRadius="md"
          color="gray.800"
          fontSize="10px"
          whiteSpace="nowrap"
          overflow="hidden"
          css={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          <Tags strokeWidth={1} size={14} />
          {habit}
        </Box>
        <Text
          color="gray.800"
          fontSize="10px"
          whiteSpace="nowrap"
          overflow="hidden"
          css={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {formatFriendlyDate(dayjs(date))}
        </Text>
      </Flex>
    </Flex>
  )
}

export { Note }

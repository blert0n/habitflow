'use client'
import { Flex, Text } from '@chakra-ui/react'
import dayjs from 'dayjs'
import { formatFriendlyDate } from '@/util/dates'

interface NoteProps {
  title: string
  note: string
  date: string
  habit?: string
  onClick?: () => void
}

const Note = ({ title, note, date, onClick }: NoteProps) => {
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
        css={{
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {note}
      </Text>
      <Text
        color="gray.800"
        fontSize="10px"
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
  )
}

export { Note }

'use client'

import { Flex, Tag, Text } from '@chakra-ui/react'
import { TagIcon } from 'lucide-react'

interface NoteProps {
  title: string
  note: string
  date: string
  habit?: string
  onClick?: () => void
}

const Note = ({ title, note, habit, date, onClick }: NoteProps) => {
  return (
    <Flex
      direction="column"
      py={2}
      px={3}
      gap={1}
      borderRadius="lg"
      borderWidth="1px"
      borderColor="gray.200"
      bg="white"
      boxShadow="xs"
      _hover={{
        bgColor: 'gray.50',
        borderColor: 'gray.300',
        boxShadow: 'sm',
        transform: 'translateY(-1px)',
      }}
      cursor="pointer"
      onClick={() => onClick?.()}
      transition="all 0.2s ease"
      position="relative"
    >
      <Flex justify="space-between" align="flex-start" gap={3}>
        <Text
          color="gray.800"
          fontSize="sm"
          fontWeight="semibold"
          flex="1"
          minWidth={0}
          lineHeight="1.4"
        >
          {title}
        </Text>
        <Text
          fontSize="xs"
          color="gray.600"
          whiteSpace="nowrap"
          bg="gray.100"
          px={2}
          py={1}
          borderRadius="full"
          fontWeight="medium"
        >
          {date}
        </Text>
      </Flex>

      <Text
        color="gray.600"
        fontSize="sm"
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
      <Flex justify="flex-start" mt={1}>
        <Tag.Root
          size="sm"
          bg="gray.100"
          borderColor="gray.200"
          borderWidth="1px"
        >
          <TagIcon strokeWidth={1.5} size={14} color="#6b7280" />
          <Tag.Label fontSize="xs" color="gray.700" fontWeight="medium">
            {habit}
          </Tag.Label>
        </Tag.Root>
      </Flex>
    </Flex>
  )
}

export { Note }

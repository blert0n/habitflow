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
      padding={2}
      gap={1}
      borderRadius="sm"
      borderWidth="1px"
      borderColor="gray.200"
      bg="white"
      _hover={{ bgColor: 'bg' }}
      cursor="pointer"
      onClick={() => onClick?.()}
    >
      <Flex justify="space-between" align="flex-start" gap={2}>
        <Text
          color="gray.700"
          fontSize={13}
          fontWeight="medium"
          flex="1"
          minWidth={0}
        >
          {title}
        </Text>
        <Text fontSize={10} color="gray.500" whiteSpace="nowrap">
          {date}
        </Text>
      </Flex>

      <Text color="gray.600" fontSize={12}>
        {note}
      </Text>
      <Flex>
        <Tag.Root size="sm">
          <TagIcon strokeWidth={1} size={12} />
          <Tag.Label fontSize={10}>{habit}</Tag.Label>
        </Tag.Root>
      </Flex>
    </Flex>
  )
}

export { Note }

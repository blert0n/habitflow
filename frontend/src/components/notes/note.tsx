'use client'

import { Flex, Text } from '@chakra-ui/react'

interface NoteProps {
  title: string
  note: string
  date: string
}

const Note = ({ title, note, date }: NoteProps) => {
  return (
    <Flex
      justifyContent="space-between"
      alignItems="flex-start"
      padding={2}
      gap={2}
      borderRadius="sm"
      borderWidth="1px"
      borderColor="gray.200"
      bg="white"
    >
      <Flex direction="column" flex={1}>
        <Text color="gray.700" fontSize={13} fontWeight="medium">
          {title}
        </Text>
        <Text color="gray.600" fontSize={12}>
          {note}
        </Text>
      </Flex>

      <Text fontSize={10} color="gray.500" whiteSpace="nowrap">
        {date}
      </Text>
    </Flex>
  )
}

export { Note }

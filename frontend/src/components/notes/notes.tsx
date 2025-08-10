import { Box, Button, Flex, Text } from '@chakra-ui/react'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { HeaderWithText } from '../ui/header-with-text'
import { Note } from './note'
import { ViewNote } from './view-note'
import { Create } from './create'
import { formatFriendlyDate } from '@/util/dates'

const notes = [
  {
    title: 'Morning Routine Reflection',
    note: 'Felt great after the morning workout. Need to focus more on proper form during exercises.',
    date: new Date('2025-08-05T08:30:00'),
  },
  {
    title: 'Book Notes',
    note: 'Atomic Habits - Chapter 3: Small changes compound over time. Focus on systems, not goals.',
    date: new Date('2025-08-04T22:15:00'),
  },
  {
    title: 'Weekly Planning',
    note: 'Outlined goals for the upcoming week. Need to prioritize sleep and evening routines.',
    date: new Date('2025-07-29T19:45:00'),
  },
  {
    title: 'Evening Reflection',
    note: 'Felt distracted today. Will try the Pomodoro method tomorrow.',
    date: new Date('2025-08-01T21:05:00'),
  },
]

const Notes = () => {
  const [selectedNoteId, setSelectedNoteId] = useState(0)
  const [isCreate, setIsCreate] = useState(false)

  const onViewNote = (id: number) => {
    setSelectedNoteId(id)
  }

  const selectedNote = notes[selectedNoteId]

  return (
    <Flex direction="column" paddingBottom="60px">
      <Flex
        direction={{ base: 'column', sm: 'row' }}
        justify="space-between"
        alignItems="center"
        w="full"
        mb={4}
      >
        <HeaderWithText
          title="Notes"
          text="Track your thoughts and reflections"
        />
        {!isCreate && (
          <Button
            bg="brand.primary"
            size="xs"
            onClick={() => {
              setIsCreate((prev) => !prev)
            }}
          >
            <Plus /> Note
          </Button>
        )}
      </Flex>
      <Flex
        gap={4}
        height="100%"
        direction={{ base: 'column', midMd: 'row' }}
        align="stretch"
      >
        <Box
          flex={1}
          bg="white"
          borderRadius="lg"
          borderWidth="1px"
          borderColor="gray.200"
          p={3}
          display="flex"
          flexDirection="column"
          gapY={2}
          minWidth={0}
        >
          <Text>Notes</Text>
          {notes.map((note, index) => (
            <Note
              key={note.title}
              title={note.title}
              note={note.note}
              date={formatFriendlyDate(note.date)}
              onClick={() => {
                onViewNote(index)
              }}
            />
          ))}
        </Box>
        <Box
          flex={{ base: 'none', midMd: 3 }}
          bg="white"
          borderRadius="lg"
          borderWidth="1px"
          borderColor="gray.200"
          p={3}
          display="flex"
          flexDirection="column"
          minWidth={0}
        >
          {isCreate && (
            <Create
              onDiscard={() => {
                setIsCreate(false)
              }}
            />
          )}
          {!isCreate && (
            <ViewNote
              title={selectedNote.title}
              note={selectedNote.note}
              key={selectedNote.title}
            />
          )}
        </Box>
      </Flex>
    </Flex>
  )
}

export { Notes }

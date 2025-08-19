import { Box, Button, Flex, Text } from '@chakra-ui/react'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { HeaderWithText } from '../ui/header-with-text'
import { Pagination } from '../ui/pagination'
import { AppEmptyState } from '../ui/empty-state'
import { Note } from './note'
import { ViewNote } from './view-note'
import { Create } from './create'
import { NoteSkeleton } from './note-skeleton'
import type { PaginatedNotesResponse } from '@/types/notes'
import { formatFriendlyDate } from '@/util/dates'
import { client } from '@/util/client'

const notes_mock = [
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

type Note = PaginatedNotesResponse['data'][0]

const Notes = () => {
  const [page, setPage] = useState(1)
  const [selectedNote, setSelectedNote] = useState<Note | undefined>()
  const [isCreate, setIsCreate] = useState(false)

  const { data, isLoading } = useQuery<PaginatedNotesResponse>({
    queryKey: ['listNotes'],
    queryFn: () => client('/notes/list'),
  })

  const onViewNote = (note: Note) => {
    setSelectedNote(note)
  }

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
          {isLoading && <NoteSkeleton count={5} />}
          {!isLoading && (data?.data.length ?? 0) > 0 && (
            <>
              {data?.data.map((note) => (
                <Note
                  key={note.id}
                  title={'title'}
                  note={'content'}
                  date={formatFriendlyDate(dayjs(note.created_at))}
                  onClick={() => {
                    onViewNote(note)
                  }}
                />
              ))}
              <Pagination
                totalCount={data?.totalCount ?? 0}
                page={page}
                pageSize={5}
                hideNumbers
                onPageChange={(newPage) => {
                  setPage(newPage)
                }}
              />
            </>
          )}
          {!isLoading && !data?.data.length && (
            <AppEmptyState
              circleSize={12}
              iconSize={24}
              title="No Notes Yet 😴"
              description="You haven’t added any notes. Start capturing your thoughts, ideas, or reminders by creating a new note."
            />
          )}
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
          {!isCreate && <ViewNote title={'title'} note={'note'} key={'key'} />}
        </Box>
      </Flex>
    </Flex>
  )
}

export { Notes }

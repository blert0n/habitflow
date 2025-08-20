import { Box, Button, Flex, Text } from '@chakra-ui/react'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { HeaderWithText } from '../ui/header-with-text'
import { Pagination } from '../ui/pagination'
import { AppEmptyState } from '../ui/empty-state'
import { toaster } from '../ui/toaster'
import { Note } from './note'
import { NoteEditor } from './create'
import { NoteSkeleton } from './note-skeleton'
import type {
  CreateNoteForm,
  HabitOptions,
  PaginatedNotesResponse,
} from '@/types/notes'
import { formatFriendlyDate } from '@/util/dates'
import { client } from '@/util/client'

const previewNoteContent = (html: string, maxLength = 30) => {
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html
  const text = tempDiv.textContent || tempDiv.innerText || ''
  return text.slice(0, maxLength)
}

type Note = PaginatedNotesResponse['data'][0]

const Notes = () => {
  const [page, setPage] = useState(1)
  const [mode, setMode] = useState<'create' | 'edit' | 'view'>('view')

  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery<PaginatedNotesResponse>({
    queryKey: ['listNotes'],
    queryFn: () => client('/notes/list'),
  })

  const { data: habitOptions } = useQuery<Array<HabitOptions>>({
    queryKey: ['listHabitOptions'],
    queryFn: () => client('/habits/options'),
  })

  const createNoteMutation = useMutation({
    mutationKey: ['createNote'],
    mutationFn: (note: CreateNoteForm) =>
      client('/notes/create', {
        method: 'POST',
        body: JSON.stringify(note),
      }),
    onSuccess: () => {
      setSelectedNote(undefined)
      setMode('view')
      queryClient.invalidateQueries({ queryKey: ['listNotes'] })
      toaster.create({
        type: 'success',
        title: 'A note note was created.',
      })
    },
    onError: () => {
      toaster.create({
        type: 'error',
        title: 'Note was not saved.',
      })
    },
  })

  const relatedHabitOptions = (habitOptions ?? []).map((option) => ({
    label: option.name,
    value: String(option.id),
  }))

  const [selectedNote, setSelectedNote] = useState<Note | undefined>(
    data?.data.at(0),
  )

  const onViewNote = (note: Note) => {
    setMode('view')
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
        <Button
          bg="brand.primary"
          size="xs"
          onClick={() => {
            setSelectedNote(undefined)
            setMode('create')
          }}
        >
          <Plus /> Create
        </Button>
      </Flex>
      <Flex
        gap={4}
        height="100%"
        direction={{ base: 'column', midMd: 'row' }}
        align="stretch"
        position="relative"
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
          pb="60px"
        >
          <Text>Notes</Text>
          {isLoading && <NoteSkeleton count={5} />}
          {!isLoading && (data?.data.length ?? 0) > 0 && (
            <>
              {data?.data.map((note) => {
                const previewNote = previewNoteContent(note.content)
                return (
                  <Note
                    key={note.id}
                    title={note.title}
                    note={previewNote}
                    date={formatFriendlyDate(dayjs(note.created_at))}
                    onClick={() => {
                      onViewNote(note)
                    }}
                  />
                )
              })}
              <Box position="absolute" bottom={0} pb={1}>
                <Pagination
                  totalCount={data?.totalCount ?? 0}
                  page={page}
                  pageSize={5}
                  hideNumbers
                  onPageChange={(newPage) => {
                    setPage(newPage)
                  }}
                />
              </Box>
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
          <NoteEditor
            note={
              mode === 'view'
                ? (selectedNote ?? data?.data.at(0))
                : selectedNote
            }
            relatedHabits={relatedHabitOptions}
            onSave={(note) => createNoteMutation.mutate(note)}
            onDiscard={() => setMode('view')}
            mode={mode}
            isLoading={isLoading}
            isCreateLoading={createNoteMutation.isPending}
          />
        </Box>
      </Flex>
    </Flex>
  )
}

export { Notes }

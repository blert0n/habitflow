import {
  Box,
  Button,
  Flex,
  IconButton,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react'
import { ChevronDown, ChevronUp, Plus } from 'lucide-react'
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
import { ViewNote } from './view-note'
import type {
  CreateNoteForm,
  HabitOptions,
  PaginatedNotesResponse,
} from '@/types/notes'
import { formatFriendlyDate } from '@/util/dates'
import { client } from '@/util/client'
import { previewNoteContent } from '@/util/notes'
import { useCreateNote } from '@/hooks/useCreateNote'

type Note = PaginatedNotesResponse['data'][0]

const Notes = () => {
  const [page, setPage] = useState(1)
  const [mode, setMode] = useState<'create' | 'edit' | 'view'>('view')
  const [hideNotes, setHideNotes] = useState(false)
  const isMobile = useBreakpointValue({ base: true, midMd: false })
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery<PaginatedNotesResponse>({
    queryKey: ['listNotes', page],
    queryFn: () => client(`/notes/list?page=${page}`),
  })

  const { data: habitOptions } = useQuery<Array<HabitOptions>>({
    queryKey: ['listHabitOptions'],
    queryFn: () => client('/habits/options'),
  })

  const { createNote, editNote, isCreating } = useCreateNote()

  const handleCreateNote = async (note: CreateNoteForm) => {
    try {
      await createNote(note)
      setSelectedNote(undefined)
      setMode('view')
      queryClient.invalidateQueries({ queryKey: ['listNotes'] })
      toaster.create({
        type: 'success',
        title: 'A note note was created.',
      })
    } catch (e) {
      toaster.create({
        type: 'error',
        title: 'Note was not saved.',
      })
    }
  }
  const handleEditNote = async (note: CreateNoteForm) => {
    try {
      await editNote(note)
      setSelectedNote(undefined)
      setMode('view')
      queryClient.invalidateQueries({ queryKey: ['listNotes'] })
      toaster.create({
        type: 'success',
        title: 'Changes were saved',
      })
    } catch (e) {
      toaster.create({
        type: 'error',
        title: 'Note was not saved.',
      })
    }
  }

  const deleteNoteMutation = useMutation({
    mutationKey: ['deleteNote'],
    mutationFn: (id: number) =>
      client('/notes/delete', {
        method: 'POST',
        body: JSON.stringify({ id }),
      }),
    onSuccess: () => {
      setSelectedNote(undefined)
      setMode('view')
      queryClient.invalidateQueries({ queryKey: ['listNotes'] })
      toaster.create({
        type: 'success',
        title: 'Note was deleted',
      })
    },
    onError: () => {
      toaster.create({
        type: 'error',
        title: 'Note could not be deleted.',
      })
    },
  })

  const [selectedNote, setSelectedNote] = useState<Note | undefined>(
    data?.data.at(0),
  )

  const onViewNote = (note: Note) => {
    setMode('view')
    setSelectedNote(note)
  }

  const relatedHabitOptions = (habitOptions ?? []).map((option) => ({
    label: option.name,
    value: String(option.id),
  }))

  const isView = mode === 'view'
  const viewNote = selectedNote ?? data?.data.at(0)

  const handleDelete = () => {
    if (!viewNote?.id) return
    deleteNoteMutation.mutate(viewNote.id)
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
          minHeight={{ base: 'auto', midMd: '400px' }}
          pb={!hideNotes ? '60px' : 0}
          position="relative"
        >
          <Flex justifyContent="space-between" alignItems="center">
            <Text>Notes</Text>
            {isMobile && (
              <IconButton
                size="xs"
                variant="ghost"
                onClick={() => setHideNotes((prev) => !prev)}
              >
                {hideNotes ? (
                  <ChevronDown strokeWidth={1.5} />
                ) : (
                  <ChevronUp strokeWidth={1.5} />
                )}
              </IconButton>
            )}
          </Flex>
          {isLoading && <NoteSkeleton count={5} />}
          {!isLoading && (data?.data.length ?? 0) > 0 && (
            <>
              {!hideNotes &&
                data?.data.map((note) => {
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
                {!hideNotes && (
                  <Pagination
                    totalCount={data?.totalCount ?? 0}
                    page={page}
                    pageSize={5}
                    hideNumbers
                    onPageChange={(newPage) => {
                      setPage(newPage)
                    }}
                  />
                )}
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
          {!isView && (
            <NoteEditor
              note={mode !== 'create' ? viewNote : undefined}
              relatedHabits={relatedHabitOptions}
              onSave={(note) => {
                note.id ? handleEditNote(note) : handleCreateNote(note)
              }}
              onDiscard={() => {
                setMode('view')
                setSelectedNote(undefined)
              }}
              mode={mode}
              isLoading={isLoading}
              isCreateLoading={isCreating}
            />
          )}
          {isView && viewNote && (
            <ViewNote
              note={viewNote}
              onEdit={() => setMode('edit')}
              onDelete={() => {
                handleDelete()
              }}
            />
          )}
          {isView && !viewNote && (
            <Flex
              alignItems="center"
              justifyContent="center"
              direction="column"
              height="full"
            >
              <AppEmptyState
                title="Select a note"
                description="Choose a note to see its full content on this side."
                circleSize={12}
                iconSize={24}
              />
            </Flex>
          )}
        </Box>
      </Flex>
    </Flex>
  )
}

export { Notes }

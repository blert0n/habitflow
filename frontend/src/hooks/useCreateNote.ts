import { useMutation } from '@tanstack/react-query'
import type { CreateNoteForm } from '@/types/notes'
import { client } from '@/util/client'

export const useCreateNote = () => {
  const createMutation = useMutation({
    mutationKey: ['createNote'],
    mutationFn: (note: CreateNoteForm) =>
      client('/notes/create', {
        method: 'POST',
        body: JSON.stringify(note),
      }),
  })

  const editMutation = useMutation({
    mutationKey: ['editNote'],
    mutationFn: (note: CreateNoteForm) =>
      client('/notes/edit', {
        method: 'POST',
        body: JSON.stringify(note),
      }),
  })

  return {
    createNote: createMutation.mutateAsync,
    editNote: editMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isEditing: editMutation.isPending,
    createError: createMutation.isError,
    editError: editMutation.isError,
  }
}

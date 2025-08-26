import { Button, Flex, Input, Text } from '@chakra-ui/react'
import { Controller, useForm } from 'react-hook-form'
import { HeaderWithText } from '../ui/header-with-text'
import { AppSelect } from '../ui/select'
import { RenderValidationError } from '../ui/validation-error'
import { RichTextEditor } from '../rich-text-editor'
import { AppSpinner } from '../layout/app-spinner'
import type { CreateNoteForm, PaginatedNotesResponse } from '@/types/notes'

interface NoteEditorProps {
  note?: PaginatedNotesResponse['data'][0]
  relatedHabits: Array<{ label: string; value: string }>
  mode?: 'create' | 'edit' | 'view'
  isLoading?: boolean
  isCreateLoading?: boolean
  onDiscard?: () => void
  onSave: (data: CreateNoteForm) => void
}

const NoteEditor = ({
  note,
  relatedHabits,
  mode = 'create',
  isLoading,
  isCreateLoading,
  onDiscard,
  onSave,
}: NoteEditorProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CreateNoteForm>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      id: note?.id ?? 0,
      title: note?.title ?? '',
      habit_id: note?.habit_id ?? 0,
      content: note?.content ?? '',
    },
  })

  const onSubmit = (data: CreateNoteForm) => {
    onSave({ id: note?.id ?? 0, ...data })
  }

  if (isLoading) return <AppSpinner />

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex direction="column" gap={4}>
        <Flex mt={2} justify="space-between" alignItems="start">
          <HeaderWithText
            title={mode === 'create' ? 'New Note' : 'Edit Note'}
            text={
              mode === 'create'
                ? 'Create a new note for your habits'
                : 'Edit your note'
            }
          />
        </Flex>

        <Flex direction="column" gap={1}>
          <Text color="gray.700" fontSize={14}>
            Title
          </Text>
          <Controller
            name="title"
            control={control}
            rules={{ required: 'Please select a related habit', min: 1 }}
            render={({ field }) => (
              <Input
                placeholder="Enter a note title"
                size="sm"
                aria-invalid={errors.title ? 'true' : 'false'}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          {errors.title && <RenderValidationError error={errors.title} />}
        </Flex>

        <Flex gap={2}>
          <Flex direction="column" gap={1} flex={1}>
            <Text color="gray.700" fontSize={14}>
              Related habit
            </Text>
            <Controller
              name="habit_id"
              control={control}
              rules={{ required: 'Please select a related habit', min: 1 }}
              render={({ field }) => (
                <AppSelect
                  size="sm"
                  items={relatedHabits}
                  value={String(field.value)}
                  onChange={(value) => field.onChange(Number.parseInt(value))}
                  width="full"
                />
              )}
            />
            {errors.habit_id && (
              <RenderValidationError error={errors.habit_id} />
            )}
          </Flex>
        </Flex>

        <Flex direction="column" gap={1} flex={1}>
          <Text color="gray.700" fontSize={14}>
            Content
          </Text>
          <Controller
            name="content"
            control={control}
            rules={{
              required: 'Content cannot be empty',
              validate: (value) => {
                const plainText = value
                  .replace(/<[^>]*>/g, '')
                  .replace(/&nbsp;/g, '')
                  .trim()

                return plainText.length > 0 || 'Content cannot be empty'
              },
            }}
            render={({ field }) => (
              <RichTextEditor
                name="noteContent"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </Flex>
        <Flex justify="end" gap={2}>
          <Button
            size="xs"
            px={4}
            width="150px"
            alignSelf="end"
            disabled={!isValid || isSubmitting || isCreateLoading}
            loading={isCreateLoading}
            variant="outline"
            onClick={() => {
              onDiscard?.()
            }}
          >
            Discard
          </Button>

          <Button
            size="xs"
            px={4}
            type="submit"
            width="150px"
            alignSelf="end"
            bg="brand.primary"
            disabled={!isValid || isSubmitting || isCreateLoading}
            loading={isCreateLoading}
          >
            {mode === 'create' ? 'Publish note' : 'Save changes'}
          </Button>
        </Flex>
      </Flex>
    </form>
  )
}

export { NoteEditor }

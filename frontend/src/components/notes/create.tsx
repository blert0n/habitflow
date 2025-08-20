import { Button, Flex, IconButton, Input, Text } from '@chakra-ui/react'
import { Trash } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { HeaderWithText } from '../ui/header-with-text'
import { AppSelect } from '../ui/select'
import { RenderValidationError } from '../ui/validation-error'
import { RichTextEditor } from '../rich-text-editor'
import { AppSpinner } from '../layout/app-spinner'
import { ViewNote } from './view-note'
import type { CreateNoteForm } from '@/types/notes'

interface NoteEditorProps {
  note?: CreateNoteForm
  relatedHabits: Array<{ label: string; value: string }>
  isLoading?: boolean
  isCreateLoading?: boolean
  onDiscard?: () => void
  onSave: (data: CreateNoteForm) => void
  mode?: 'create' | 'edit' | 'view'
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
  const isView = mode === 'view'

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CreateNoteForm>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      title: note?.title ?? '',
      habit_id: note?.habit_id ?? 0,
      content: note?.content ?? '',
    },
  })

  const onSubmit = (data: CreateNoteForm) => {
    onSave(data)
  }

  if (isLoading) return <AppSpinner />

  if (isView && note) return <ViewNote note={note} />

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
          {onDiscard && (
            <IconButton
              cursor="pointer"
              _hover={{ scale: 1.1 }}
              variant="outline"
              size="sm"
              onClick={onDiscard}
              aria-label="Discard"
            >
              <Trash strokeWidth={1} size={16} />
            </IconButton>
          )}
        </Flex>

        <Flex direction="column" gap={1}>
          <Text color="gray.700" fontSize={14}>
            Title
          </Text>
          <Input
            placeholder="Enter a note title"
            size="sm"
            aria-invalid={errors.title ? 'true' : 'false'}
            {...register('title', { required: true, minLength: 1 })}
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
    </form>
  )
}

export { NoteEditor }

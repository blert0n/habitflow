import {
  Button,
  Flex,
  IconButton,
  Input,
  Separator,
  Text,
} from '@chakra-ui/react'
import { Trash } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { HeaderWithText } from '../ui/header-with-text'
import { AppSelect } from '../ui/select'
import { RenderValidationError } from '../ui/validation-error'
import { RichTextEditor } from '../rich-text-editor'
import type { CreateNoteForm } from '@/types/notes'
import { client } from '@/util/client'

interface P {
  relatedHabits: Array<{ label: string; value: string }>
  onDiscard: () => void
}

const Create = ({ relatedHabits, onDiscard }: P) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isValid, isLoading },
  } = useForm<CreateNoteForm>({
    defaultValues: {
      title: '',
      habit_id: 0,
      content: null,
    },
  })

  const createNoteMutation = useMutation({
    mutationKey: ['createNote'],
    mutationFn: (values: CreateNoteForm) =>
      client('/notes/create', {
        method: 'POST',
        body: JSON.stringify(values),
      }),
  })

  const onSubmit = (data: CreateNoteForm) => {
    createNoteMutation.mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex direction="column" gap={4}>
        <Flex mt={2} justify="space-between" alignItems="start">
          <HeaderWithText
            title="New note"
            text="Create a new note for your habits"
          />
          <IconButton
            cursor="pointer"
            _hover={{ scale: 1.1 }}
            variant="outline"
            size="sm"
            onClick={() => {
              onDiscard()
            }}
          >
            <Trash strokeWidth={1} size={16} />
          </IconButton>
        </Flex>
        <Separator />
        <Flex direction="column" gap={1}>
          <Text color="gray.700" fontSize={14}>
            Title
          </Text>
          <Input
            placeholder="Enter a note title"
            size="sm"
            aria-invalid={errors.title ? 'true' : 'false'}
            {...register('title', { required: true, maxLength: 30 })}
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
              rules={{ required: 'Please select a related habit' }}
              render={({ field }) => (
                <AppSelect
                  size="sm"
                  items={relatedHabits}
                  value={String(field.value)}
                  onChange={(value) => {
                    field.onChange(Number.parseInt(value))
                  }}
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
            rules={{ required: 'Content cannot be empty' }}
            render={({ field }) => (
              <RichTextEditor
                name="noteName"
                value=""
                onChange={(value) => 0}
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
          disabled={!isValid || isLoading}
        >
          Publish note
        </Button>
      </Flex>
    </form>
  )
}

export { Create }

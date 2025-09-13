import { Flex, IconButton, Menu, Separator, Tag, Text } from '@chakra-ui/react'
import { EllipsisVertical, Tags as TagIcon } from 'lucide-react'
import dayjs from 'dayjs'
import { AppMenu } from '../ui/menu'
import type { PaginatedNotesResponse } from '@/types/notes'

interface P {
  note: PaginatedNotesResponse['data'][0]
  onEdit: () => void
  onDelete: () => void
}

const ViewNote = ({ note, onEdit, onDelete }: P) => {
  return (
    <Flex direction="column" gap={6}>
      <Flex direction="column" gap={2}>
        <Flex justify="space-between" alignItems="center">
          <Text color="gray.700" fontSize={16} fontWeight="semibold">
            {note.title}
          </Text>
          <AppMenu
            trigger={
              <IconButton
                variant="ghost"
                justifySelf="end"
                alignSelf="flex-end"
              >
                <EllipsisVertical />
              </IconButton>
            }
          >
            <Menu.Item
              value="edit"
              onClick={() => {
                onEdit()
              }}
            >
              Edit
            </Menu.Item>
            <Menu.Item
              value="delete"
              color="fg.error"
              _hover={{ bg: 'bg.error', color: 'fg.error' }}
              onClick={() => {
                onDelete()
              }}
            >
              Delete
            </Menu.Item>
          </AppMenu>
        </Flex>
        <Flex justify="space-between" alignItems="center">
          <Text color="gray.700" fontSize={12}>
            Created: {dayjs(note.created_at).format('MMM DD, YYYY [at] h:mm A')}
          </Text>
          <Text color="gray.700" fontSize={12}>
            Last edited:{' '}
            {dayjs(note.updated_at).format('MMM DD, YYYY [at] h:mm A')}
          </Text>
        </Flex>
        <Flex gap={2}>
          <TagIcon strokeWidth={1} size={16} />
          <Tag.Root size="sm">
            <Tag.Label>{note.habit_name}</Tag.Label>
          </Tag.Root>
        </Flex>
        <Separator />
      </Flex>
      <Flex>
        <div
          dangerouslySetInnerHTML={{ __html: note.content }}
          className="full-width"
        />
      </Flex>
    </Flex>
  )
}

export { ViewNote }

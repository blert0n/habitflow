import { Flex, IconButton, Separator, Tag, Text } from '@chakra-ui/react'
import { EllipsisVertical, Tags as TagIcon } from 'lucide-react'

interface P {
  title: string
  note: string
}

const ViewNote = ({ title, note }: P) => {
  return (
    <Flex direction="column" gap={6}>
      <Flex direction="column" gap={2}>
        <Flex justify="space-between" alignItems="center">
          <Text color="gray.700" fontSize={16} fontWeight="semibold">
            {title}
          </Text>
          <IconButton variant="ghost" justifySelf="end" alignSelf="flex-end">
            <EllipsisVertical />
          </IconButton>
        </Flex>
        <Flex justify="space-between" alignItems="center">
          <Text color="gray.700" fontSize={12}>
            Created: Jan 18, 2025 at 7:45 AM
          </Text>
          <Text color="gray.700" fontSize={12}>
            Last edited: Jan 18, 2025 at 7:52 AM
          </Text>
        </Flex>
        <Flex gap={2}>
          <TagIcon strokeWidth={1} size={16} />
          <Tag.Root size="sm">
            <Tag.Label>Workout</Tag.Label>
          </Tag.Root>
          <Tag.Root size="sm">
            <Tag.Label>Progress</Tag.Label>
          </Tag.Root>
        </Flex>
        <Separator />
      </Flex>
      <Flex>{note}</Flex>
    </Flex>
  )
}

export { ViewNote }

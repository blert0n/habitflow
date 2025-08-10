import {
  Button,
  Flex,
  IconButton,
  Input,
  Separator,
  Text,
} from '@chakra-ui/react'
import { Trash } from 'lucide-react'
import { HeaderWithText } from '../ui/header-with-text'
import { AppSelect } from '../ui/select'
import { AppEditor } from '../editor/AppEditor'
import { useCategories } from '@/hooks/useCategories'

interface P {
  onDiscard: () => void
}

const Create = ({ onDiscard }: P) => {
  const { categories } = useCategories()
  return (
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
        <Input placeholder="Enter a note title" size="sm" />
      </Flex>
      <Flex gap={2}>
        <Flex direction="column" gap={1} flex={1}>
          <Text color="gray.700" fontSize={14}>
            Category
          </Text>
          <AppSelect
            size="sm"
            items={categories.map((category) => ({
              label: category.label,
              value: String(category.id),
            }))}
            value=""
            onChange={() => 0}
            width="full"
          />
        </Flex>
        <Flex direction="column" gap={1} flex={1}>
          <Text color="gray.700" fontSize={14}>
            Related habit
          </Text>
          <AppSelect
            size="sm"
            items={[]}
            value=""
            onChange={() => 0}
            width="full"
          />
        </Flex>
      </Flex>
      <Flex direction="column" gap={1} flex={1}>
        <Text color="gray.700" fontSize={14}>
          Content
        </Text>
        <AppEditor />
      </Flex>
      <Button
        size="xs"
        px={4}
        type="submit"
        width="150px"
        alignSelf="end"
        bg="brand.primary"
      >
        Publish note
      </Button>
    </Flex>
  )
}

export { Create }

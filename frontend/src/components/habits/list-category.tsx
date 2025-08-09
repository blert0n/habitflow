import { Flex, IconButton, Text } from '@chakra-ui/react'
import { EllipsisVertical } from 'lucide-react'

interface P {
  id: number
  label: string
  description: string
  icon: React.ReactNode
  isCreate?: boolean
}

const Category = ({ label, description, icon, isCreate }: P) => {
  return (
    <Flex
      w={{ midSmDown: 'full' }}
      maxW="300px"
      borderRadius="md"
      borderColor="gray.300"
      borderWidth={1}
      padding={4}
      bgColor="white"
      direction="column"
      alignItems={isCreate ? 'center' : ''}
      gap={2}
    >
      <Flex
        justify={isCreate ? 'center' : 'space-between'}
        alignItems="center"
        width="full"
      >
        <Flex gap={2}>
          <IconButton borderRadius="lg" bg="gray.700">
            {icon}
          </IconButton>
        </Flex>
        {!isCreate && (
          <IconButton variant="ghost">
            <EllipsisVertical />
          </IconButton>
        )}
      </Flex>
      <Text color="gray.700" fontSize="md">
        {label}
      </Text>
      <Text color="gray.700" fontSize="xs">
        {description}
      </Text>
      {!isCreate && (
        <Flex justify="space-between">
          <Text color="gray.700" fontSize="xs">
            3 habits
          </Text>
          <Text color="gray.800" fontSize="xs">
            Average completion of 76%
          </Text>
        </Flex>
      )}
    </Flex>
  )
}

export { Category }

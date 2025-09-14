import { Flex, IconButton, Text } from '@chakra-ui/react'
import type { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: ReactNode
}

export const StatCard = ({
  title,
  value,
  description,
  icon,
}: StatCardProps) => {
  return (
    <Flex
      direction="column"
      justifyContent="space-between"
      flex={1}
      px={{ base: 4, sm: 2, md: 4 }}
      py={2}
      maxW={{ base: '100%', sm: '400px', md: '600px' }}
      bg="white"
      borderRadius="lg"
      borderWidth="1px"
      borderColor="gray.200"
      gap={1}
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Text color="gray.800" fontSize={18} fontWeight={400}>
          {title}
        </Text>
        {icon && (
          <IconButton
            size="xs"
            variant="outline"
            backgroundColor="bg"
            rounded="full"
          >
            {icon}
          </IconButton>
        )}
      </Flex>

      <Flex direction="column">
        <Text color="brand.primary" fontSize={20} fontWeight="semibold">
          {value}
        </Text>
      </Flex>

      {description && (
        <Text color="gray.500" fontSize={12}>
          {description}
        </Text>
      )}
    </Flex>
  )
}

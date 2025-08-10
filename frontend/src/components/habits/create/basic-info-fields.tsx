import { Box, Flex, IconButton, Input, Text, Textarea } from '@chakra-ui/react'
import React from 'react'
import { useController } from 'react-hook-form'
import type { Control } from 'react-hook-form'
import type { HabitForm } from '../types'
import { useCategories } from '@/hooks/useCategories'

interface BasicInfoFieldsProps {
  control: Control<HabitForm, any, HabitForm>
  onCategorySelect: (id: number) => void
}

export const BasicInfoFields = React.memo(
  ({ control, onCategorySelect }: BasicInfoFieldsProps) => {
    const { field: nameField } = useController({ name: 'name', control })
    const { field: selectedCategory } = useController({
      name: 'category',
      control,
    })
    const { field: descriptionField } = useController({
      name: 'description',
      control,
    })

    const { categories } = useCategories()

    return (
      <Box
        mt={4}
        mb={4}
        bg="white"
        paddingX={4}
        paddingY={6}
        borderRadius="lg"
        borderWidth={1}
        borderColor="gray.200"
      >
        <Text mb={4}>Basic information</Text>
        <Flex direction="column" gap={1} mb={2}>
          <Text color="gray.700" fontSize={14}>
            Habit name
          </Text>
          <Input {...nameField} placeholder="Habit Name" size="sm" />
        </Flex>
        <Flex direction="column" gap={1}>
          <Text color="gray.700" fontSize={14}>
            Description
          </Text>
          <Textarea
            {...descriptionField}
            placeholder="Description"
            size="sm"
            rows={3}
          />
        </Flex>
        <Flex direction="column" gap={1}>
          <Text color="gray.700" fontSize={14}>
            Choose category
          </Text>
          <Flex wrap="wrap" gap={2}>
            {categories.map((category) => (
              <Box
                key={category.id}
                w={10}
                h={10}
                borderColor="gray.200"
                borderRadius="lg"
                textAlign="center"
                display="flex"
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
                onClick={() => {
                  onCategorySelect(category.id)
                }}
              >
                <IconButton
                  borderRadius="lg"
                  bgGradient="linear(to-r, green.200, pink.500)"
                  _hover={{ filter: 'brightness(0.85)' }}
                  scale={category.id === selectedCategory.value ? 1.1 : 1}
                  bg={category.backgroundGradient}
                  transform={
                    category.id === selectedCategory.value
                      ? 'scale(1.1)'
                      : 'scale(1)'
                  }
                  transition="transform 0.2s ease-in-out"
                >
                  {category.icon}
                </IconButton>
              </Box>
            ))}
          </Flex>
        </Flex>
      </Box>
    )
  },
)

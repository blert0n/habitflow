import { Box, Flex, IconButton, Input, Text, Textarea } from '@chakra-ui/react'
import React from 'react'
import { useController } from 'react-hook-form'
import type { Control } from 'react-hook-form'
import type { HabitForm } from '@/types/habits'
import { useCategories } from '@/hooks/useCategories'
import { AppColorPicker } from '@/components/ui/color-picker'
import { RenderValidationError } from '@/components/ui/validation-error'

interface BasicInfoFieldsProps {
  control: Control<HabitForm, any, HabitForm>
}

export const BasicInfoFields = React.memo(
  ({ control }: BasicInfoFieldsProps) => {
    const { field: nameField, fieldState: nameFieldState } = useController({
      name: 'name',
      control,
      rules: {
        required: { value: true, message: 'Name is required' },
        minLength: { value: 1, message: 'Name is required' },
      },
    })
    const { field: selectedCategory, fieldState: categoryFieldState } =
      useController({
        name: 'category',
        control,
        rules: {
          min: { value: 1, message: 'A category must be selected' },
        },
      })
    const { field: descriptionField, fieldState: descriptionFieldState } =
      useController({
        name: 'description',
        control,
        rules: {
          required: { value: true, message: 'Description is required' },
          minLength: { value: 1, message: 'Description is required' },
        },
      })

    const { field: colorField } = useController({
      name: 'color',
      control,
      rules: {
        required: { value: true, message: 'Color is required' },
      },
    })

    const { categories, backgroundGradient } = useCategories()

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
          <Input
            {...nameField}
            placeholder="Habit Name"
            size="sm"
            aria-invalid={nameFieldState.error ? 'true' : 'false'}
          />
          <RenderValidationError error={nameFieldState.error} />
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
            aria-invalid={descriptionFieldState.error ? 'true' : 'false'}
          />
          <RenderValidationError error={descriptionFieldState.error} />
        </Flex>
        <Flex direction="column" gap={1}>
          <Text color="gray.700" fontSize={14}>
            Choose category
          </Text>
          <Flex
            wrap="wrap"
            gap={2}
            aria-invalid={categoryFieldState.error ? 'true' : 'false'}
          >
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
                  selectedCategory.onChange(category.id)
                }}
              >
                <IconButton
                  borderRadius="lg"
                  bgGradient="linear(to-r, green.200, pink.500)"
                  _hover={{ filter: 'brightness(0.85)' }}
                  scale={category.id === selectedCategory.value ? 1.1 : 1}
                  bg={backgroundGradient}
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
          <RenderValidationError error={categoryFieldState.error} />
        </Flex>
        <Flex direction="column" gap={1} mt={2}>
          <Text color="gray.700" fontSize={14}>
            Choose habit color
          </Text>
          <AppColorPicker
            value={colorField.value}
            onChange={(color) => {
              colorField.onChange(color.toString('hex'))
            }}
            hideLabel
          />
        </Flex>
      </Box>
    )
  },
)

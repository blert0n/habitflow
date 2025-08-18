import { Box, Flex, Input, InputGroup } from '@chakra-ui/react'
import { memo } from 'react'
import { Controller } from 'react-hook-form'
import type { Control } from 'react-hook-form'
import type { HabitForm } from '@/types/habits'
import { AppRadioGroup } from '@/components/ui/radio-group'
import { DatePicker } from '@/components/ui/date-picker'

const END_EVENT_OPTIONS = [
  { value: 'Never', label: 'Never' },
  { value: 'On', label: 'On' },
  { value: 'After', label: 'After' },
]

interface EndsOnFieldsProps {
  ends: HabitForm['endsOn']
  control: Control<HabitForm, any, HabitForm>
}

export const EndsOnFields = memo(({ ends, control }: EndsOnFieldsProps) => {
  return (
    <Box paddingX={4} gap={2} mb={4} maxW={{ base: 'full', sm: '200px;' }}>
      <Flex gap={4} direction="column" mb={4}>
        <Box width={{ smDown: 'full', sm: '200px' }}>
          <Controller
            control={control}
            name="endsOn"
            render={({ field }) => (
              <AppRadioGroup
                name="endsOn"
                selectedOption={field.value}
                onChange={field.onChange}
                items={END_EVENT_OPTIONS}
                label="Ends"
              />
            )}
          />
        </Box>
        <Flex>
          {ends === 'On' && (
            <Controller
              control={control}
              name="until"
              render={({ field }) => (
                <DatePicker
                  value={field.value ?? null}
                  onChange={(val) => field.onChange(val)}
                />
              )}
            />
          )}
          {ends === 'After' && (
            <Controller
              control={control}
              name="count"
              render={({ field }) => (
                <InputGroup
                  endElement={<>occurrences</>}
                  width={{ smDown: 'full', sm: '200px' }}
                >
                  <Input
                    type="number"
                    min={1}
                    pr={6}
                    className="no-spinner"
                    value={field.value ?? ''}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value, 10) || null)
                    }
                  />
                </InputGroup>
              )}
            />
          )}
        </Flex>
      </Flex>
    </Box>
  )
})

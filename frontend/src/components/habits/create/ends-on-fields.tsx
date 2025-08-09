import { Box, Flex, Input, InputGroup } from '@chakra-ui/react'
import dayjs from 'dayjs'
import React, { memo } from 'react'
import { AppRadioGroup } from '@/components/ui/radio-group'
import { DatePicker } from '@/components/ui/date-picker'

const END_EVENT_OPTIONS = [
  { value: 'Never', label: 'Never' },
  { value: 'On', label: 'On' },
  { value: 'After', label: 'After' },
]

interface EndsOnFieldsProps {
  endsOn: 'Never' | 'On' | 'After'
  setEndsOn: React.Dispatch<React.SetStateAction<'Never' | 'On' | 'After'>>
}

export const EndsOnFields = memo(({ endsOn, setEndsOn }: EndsOnFieldsProps) => {
  return (
    <Box paddingX={4} gap={2} mb={4} maxW={{ base: 'full', sm: '200px;' }}>
      <Flex gap={4} direction="column" mb={4}>
        <Box width={{ smDown: 'full', sm: '200px' }}>
          <AppRadioGroup
            name="endsOn"
            selectedOption={endsOn}
            onChange={(value) => setEndsOn(value as typeof endsOn)}
            items={END_EVENT_OPTIONS}
            label="Ends"
          />
        </Box>
        <Flex>
          {endsOn === 'On' && <DatePicker value={dayjs()} onChange={() => 0} />}
          {endsOn === 'After' && (
            <InputGroup
              endElement={<>occurrences</>}
              width={{ smDown: 'full', sm: '200px' }}
            >
              <Input type="number" min={1} pr={6} className="no-spinner" />
            </InputGroup>
          )}
        </Flex>
      </Flex>
    </Box>
  )
})

import { Box, Flex, Text } from '@chakra-ui/react'
import { memo } from 'react'
import { useController } from 'react-hook-form'
import { TimePicker } from '@/components/ui/time-picker'
import { DatePicker } from '@/components/ui/date-picker'

export const ScheduleFields = memo(({ control }: { control: any }) => {
  const { field: startDateField } = useController({
    name: 'startDate',
    control,
  })
  const { field: timeField } = useController({ name: 'time', control })

  return (
    <Box paddingX={4} gap={2} mb={4} maxW={{ base: 'full', sm: '200px;' }}>
      <Flex gap={2} mb={4} direction={{ base: 'column', sm: 'row' }}>
        <Flex gap={1} direction="column" flex={1}>
          <Text color="gray.700" fontSize={14}>
            Start date
          </Text>
          <DatePicker
            value={startDateField.value}
            onChange={startDateField.onChange}
          />
        </Flex>
        <Flex gap={1} direction="column" flex={1}>
          <Text color="gray.700" fontSize={14}>
            Time
          </Text>
          <TimePicker
            value={timeField.value}
            onChange={timeField.onChange}
            triggerSize={{ base: 'md', sm: 'sm' }}
            triggerWidth={{ smDown: 'full', sm: '200px' }}
          />
        </Flex>
      </Flex>
    </Box>
  )
})

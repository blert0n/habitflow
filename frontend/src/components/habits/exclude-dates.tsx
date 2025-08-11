import { Box, Flex, IconButton, Separator, Text } from '@chakra-ui/react'
import { CalendarX, Check, X } from 'lucide-react'
import { useState } from 'react'
import { DatePicker } from '../ui/date-picker'
import type { Dayjs } from 'dayjs'

interface ExcludeDatesProps {
  initialDates?: Array<Dayjs>
  onChange?: (dates: Array<Dayjs>) => void
}

export const ExcludeDates = ({
  initialDates = [],
  onChange,
}: ExcludeDatesProps) => {
  const [dates, setDates] = useState<Array<Dayjs>>(initialDates)
  const [newDate, setNewDate] = useState<Dayjs | null>(null)

  const handleDateChange = (index: number, updatedDate: Dayjs) => {
    const updated = [...dates]
    updated[index] = updatedDate
    setDates(updated)
    onChange?.(updated)
  }

  const handleRemoveDate = (index: number) => {
    const updated = dates.filter((_, i) => i !== index)
    setDates(updated)
    onChange?.(updated)
  }

  const handleAddNewDate = () => {
    if (!newDate) return
    if (dates.some((d) => d.isSame(newDate, 'day'))) return
    const updated = [...dates, newDate]
    setDates(updated)
    onChange?.(updated)
    setNewDate(null)
  }

  return (
    <Box paddingX={4} gap={2} mb={4}>
      <Flex
        w="full"
        bgColor="gray.100"
        padding={4}
        borderRadius="lg"
        borderWidth={1}
        borderColor="gray.300"
        gap={1}
        direction="column"
        maxW="full"
      >
        <Text fontSize={14} color="gray.500" mb={2}>
          Skip specific dates (holidays, vacations, etc.)
        </Text>

        {dates.map((date, i) => (
          <Flex key={date.valueOf()} alignItems="center">
            <DatePicker
              value={date}
              onChange={(d) => handleDateChange(i, d)}
              triggerWidth="full"
              triggerBgColor="white"
              startIcon={<CalendarX />}
              endIcon={<X />}
              onEndIconClick={() => handleRemoveDate(i)}
            />
          </Flex>
        ))}

        <Separator mt={4} />

        <Flex alignItems="center" gap={2} w="full">
          <Flex flex="1" minW={0}>
            <DatePicker
              label="Add a new date"
              value={newDate}
              onChange={setNewDate}
              triggerWidth="full"
              triggerBgColor="white"
              startIcon={<CalendarX />}
              endIcon={null}
            />
          </Flex>
          <IconButton
            bg="brand.primary"
            aria-label="Add date"
            size="sm"
            colorScheme="green"
            disabled={!newDate}
            onClick={handleAddNewDate}
          >
            <Check />
          </IconButton>
        </Flex>
      </Flex>
    </Box>
  )
}

import { Box, Flex, IconButton, Separator, Text } from '@chakra-ui/react'
import { CalendarX, Check, X } from 'lucide-react'
import { useState } from 'react'
import { Controller } from 'react-hook-form'
import { DatePicker } from '../ui/date-picker'
import type { Control } from 'react-hook-form'
import type { Dayjs } from 'dayjs'
import type { HabitForm } from '@/types/habits'

interface ExcludeDatesProps {
  excludedDates: Array<Dayjs>
  control: Control<HabitForm, any, HabitForm>
}

export const ExcludeDates = ({ excludedDates, control }: ExcludeDatesProps) => {
  const [dates, setDates] = useState<Array<Dayjs>>(excludedDates)
  const [newDate, setNewDate] = useState<Dayjs | null>(null)

  const handleDateChange = (
    index: number,
    updatedDate: Dayjs,
  ): Array<Dayjs> => {
    const updated = [...dates]
    updated[index] = updatedDate
    setDates(updated)
    return updated
  }

  const handleRemoveDate = (index: number): Array<Dayjs> => {
    const updated = dates.filter((_, i) => i !== index)
    setDates(updated)
    return updated
  }

  const handleAddNewDate = (): Array<Dayjs> => {
    if (!newDate) return dates
    if (dates.some((d) => d.isSame(newDate, 'day'))) return dates
    const updated = [...dates, newDate]
    setDates(updated)
    setNewDate(null)
    return updated
  }

  return (
    <Controller
      control={control}
      name="excludedDates"
      defaultValue={[]}
      render={({ field: { onChange } }) => {
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
                    onChange={(d) => {
                      const updated = handleDateChange(i, d)
                      onChange(updated)
                    }}
                    triggerWidth="full"
                    triggerBgColor="white"
                    startIcon={<CalendarX />}
                    endIcon={<X />}
                    onEndIconClick={() => {
                      const updated = handleRemoveDate(i)
                      onChange(updated)
                    }}
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
                  onClick={() => {
                    const updated = handleAddNewDate()
                    onChange(updated)
                  }}
                >
                  <Check />
                </IconButton>
              </Flex>
            </Flex>
          </Box>
        )
      }}
    />
  )
}

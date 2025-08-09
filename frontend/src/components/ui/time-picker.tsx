import { Box, Flex, IconButton } from '@chakra-ui/react'
import dayjs from 'dayjs'
import { Clock } from 'lucide-react'
import { AppPopover } from '../ui/popover'
import { AppSelect } from './select'
import type { Dayjs } from 'dayjs'
import type { ButtonProps } from '@chakra-ui/react'
import type { SelectItem } from './select'

interface TimePickerProps {
  value: Dayjs | null
  onChange: (date: Dayjs) => void
  triggerSize?: ButtonProps['size']
  triggerWidth?: ButtonProps['width']
}

export const TimePicker = ({
  value,
  onChange,
  triggerSize,
  triggerWidth,
}: TimePickerProps) => {
  const currentDate = value || dayjs(new Date())
  const hours24 = currentDate.hour()
  const minutes = currentDate.minute()

  const isPM = hours24 >= 12
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12

  const hourItems: Array<SelectItem> = Array.from({ length: 12 }, (_, i) => ({
    label: String(i + 1).padStart(2, '0'),
    value: String(i + 1),
  }))
  const minuteItems: Array<SelectItem> = Array.from({ length: 60 }, (_, i) => ({
    label: String(i).padStart(2, '0'),
    value: String(i),
  }))
  const periodItems: Array<SelectItem> = [
    { label: 'AM', value: 'AM' },
    { label: 'PM', value: 'PM' },
  ]

  const handleTimeChange = (
    newHours12: number,
    newMinutes: number,
    newPeriod: 'AM' | 'PM',
  ) => {
    let adjustedHours = newHours12 % 12
    if (newPeriod === 'PM') adjustedHours += 12
    const newDate = (value ? dayjs(value) : dayjs(new Date()))
      .set('hours', adjustedHours)
      .set('minutes', newMinutes)
      .set('seconds', 0)
      .set('milliseconds', 0)
    onChange(newDate)
  }

  return (
    <AppPopover
      trigger={
        <IconButton
          variant="outline"
          size={triggerSize}
          width={triggerWidth}
          color="gray.700"
        >
          <Flex
            alignItems="center"
            justify="space-between"
            w="full"
            paddingX={4}
            fontWeight="normal"
          >
            {value ? dayjs(value).format('hh:mm A') : 'Select time'}
            <Clock />
          </Flex>
        </IconButton>
      }
    >
      <Box p={3} minW="280px">
        <Flex gap={2}>
          <AppSelect
            size="sm"
            placeholder="HH"
            items={hourItems}
            value={String(hours12)}
            onChange={(val) =>
              handleTimeChange(parseInt(val), minutes, isPM ? 'PM' : 'AM')
            }
            width="100%"
          />

          <AppSelect
            size="sm"
            placeholder="MM"
            items={minuteItems}
            value={String(minutes)}
            onChange={(val) =>
              handleTimeChange(hours12, parseInt(val), isPM ? 'PM' : 'AM')
            }
            width="100%"
          />

          <AppSelect
            size="sm"
            placeholder="AM/PM"
            items={periodItems}
            value={isPM ? 'PM' : 'AM'}
            onChange={(val) =>
              handleTimeChange(hours12, minutes, val as 'AM' | 'PM')
            }
            width="100%"
          />
        </Flex>
      </Box>
    </AppPopover>
  )
}

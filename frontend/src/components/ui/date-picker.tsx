import { Box, Flex, IconButton } from '@chakra-ui/react'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { useState } from 'react'
import { Calendar } from 'lucide-react'
import { CalendarSm } from '../calendar/calendar-sm'
import { AppPopover } from '../ui/popover'
import type { ReactNode } from 'react'
import type { Dayjs } from 'dayjs'
import type { IconButtonProps } from '@chakra-ui/react'

dayjs.extend(localizedFormat)

interface DatePickerProps {
  label?: string
  value: Dayjs | null
  triggerBgColor?: IconButtonProps['bgColor']
  triggerSize?: IconButtonProps['size']
  triggerWidth?: IconButtonProps['width']
  startIcon?: ReactNode
  endIcon?: ReactNode
  onEndIconClick?: () => void
  onChange: (date: Dayjs) => void
}

const DEFAULT_TRIGGER_SIZE = { base: 'md', sm: 'sm' } as const
const DEFAULT_TRIGGER_WIDTH = { smDown: 'full', sm: '200px' }
const DEFAULT_END_ICON = <Calendar />

export const DatePicker = ({
  label = 'Select date',
  value,
  triggerBgColor,
  triggerSize = DEFAULT_TRIGGER_SIZE,
  triggerWidth = DEFAULT_TRIGGER_WIDTH,
  startIcon,
  endIcon = DEFAULT_END_ICON,
  onEndIconClick,
  onChange,
}: DatePickerProps) => {
  const [open, setOpen] = useState(false)

  const handleDateChange = (date: Dayjs) => {
    onChange(date)
    setOpen(false)
  }

  return (
    <AppPopover
      open={open}
      onOpenChange={setOpen}
      trigger={
        <IconButton
          variant="outline"
          onClick={() => setOpen(true)}
          size={triggerSize}
          width={triggerWidth}
          color="gray.700"
          bgColor={triggerBgColor}
          maxW="full"
        >
          <Flex
            alignItems="center"
            justify="space-between"
            w="full"
            px={4}
            fontWeight="normal"
          >
            <Flex alignItems="center" gap={2} flexShrink={0}>
              {startIcon}
              <Box>{value ? dayjs(value).format('LL') : label}</Box>
            </Flex>
            <Box
              flexShrink={0}
              onClick={(e) => {
                e.stopPropagation()
                onEndIconClick?.()
              }}
            >
              {endIcon}
            </Box>
          </Flex>
        </IconButton>
      }
    >
      <Box minW={{ base: 'full', sm: '280px' }}>
        <CalendarSm selectedDate={value} onDateChange={handleDateChange} />
      </Box>
    </AppPopover>
  )
}

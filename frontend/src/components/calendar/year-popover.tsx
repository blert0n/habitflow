'use client'

import {
  Flex,
  IconButton,
  Input,
  Popover,
  Portal,
  Text,
} from '@chakra-ui/react'
import { CheckIcon } from 'lucide-react'
import { useState } from 'react'

interface P {
  children: React.ReactNode
  selectedYear: number
  onChange: (year: number) => void
}

const parseAndValidate = (value: string): [boolean, number] => {
  const year = parseInt(value, 10)
  if (isNaN(year)) return [false, 0]
  const currentYear = new Date().getFullYear()
  return [year >= 1900 && year <= currentYear + 100, year]
}

const YearPopover = ({ children, selectedYear, onChange }: P) => {
  const [open, setOpen] = useState(false)
  const [yearInput, setYearInput] = useState(selectedYear.toString())

  const handleConfirm = () => {
    const [isValid, year] = parseAndValidate(yearInput)
    if (!isValid) return
    onChange(year)
    setOpen(false)
  }

  return (
    <Popover.Root
      open={open}
      onOpenChange={(state) => {
        setOpen(state.open)
      }}
    >
      <Popover.Trigger asChild>{children}</Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Arrow />
            <Popover.Body>
              <Text fontWeight="medium" mb={2}>
                Enter year
              </Text>
              <Flex gap={2} alignItems="center">
                <Input
                  size="sm"
                  type="number"
                  value={yearInput}
                  onChange={(e) => setYearInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleConfirm()
                    }
                  }}
                />
                <IconButton
                  variant="ghost"
                  disabled={!parseAndValidate(yearInput)[0]}
                >
                  <CheckIcon
                    cursor="pointer"
                    size={18}
                    onClick={handleConfirm}
                  />
                </IconButton>
              </Flex>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  )
}

export { YearPopover }

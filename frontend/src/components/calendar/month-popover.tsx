'use client'

import { Button, Popover, Portal, SimpleGrid, Text } from '@chakra-ui/react'
import { MONTHS } from '@/util/dates'

interface P {
  children: React.ReactNode
  selectedMonth: number
  onSelect: (month: number) => void
}

const MonthPopover = ({ children, selectedMonth, onSelect }: P) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>{children}</Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Arrow />
            <Popover.Body>
              <Text fontWeight="medium" mb={2}>
                Select Month
              </Text>
              <SimpleGrid columns={4} gap={2}>
                {MONTHS.map((month, index) => (
                  <Button
                    key={month}
                    size="sm"
                    variant={selectedMonth === index ? 'solid' : 'ghost'}
                    onClick={() => onSelect(index)}
                  >
                    {month}
                  </Button>
                ))}
              </SimpleGrid>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  )
}

export { MonthPopover }

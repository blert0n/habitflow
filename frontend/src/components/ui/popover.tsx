import { Popover } from '@chakra-ui/react'
import { useState } from 'react'
import type { PopoverRootProps } from '@chakra-ui/react'
import type { ReactNode } from 'react'

interface AppPopoverProps {
  trigger: ReactNode
  children: ReactNode
  placement?: NonNullable<PopoverRootProps['positioning']>['placement']
  open?: boolean
  onOpenChange?: (open: boolean) => void
  initialOpen?: boolean
}

export const AppPopover = ({
  trigger,
  children,
  placement,
  open: controlledOpen,
  onOpenChange,
  initialOpen = false,
}: AppPopoverProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpen)

  const isOpen =
    controlledOpen !== undefined ? controlledOpen : uncontrolledOpen

  const handleOpenChange = (e: { open: boolean }) => {
    if (onOpenChange) {
      onOpenChange(e.open)
    } else {
      setUncontrolledOpen(e.open)
    }
  }

  return (
    <Popover.Root
      open={isOpen}
      onOpenChange={handleOpenChange}
      closeOnInteractOutside
      closeOnEscape
      positioning={{ placement }}
    >
      <Popover.Trigger asChild>{trigger}</Popover.Trigger>
      <Popover.Positioner>
        <Popover.Content padding={0}>
          <Popover.Arrow />
          <Popover.Body padding={0} border={0}>
            {children}
          </Popover.Body>
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Root>
  )
}

import { Menu, Portal } from '@chakra-ui/react'
import type { ReactNode } from 'react'

interface P {
  trigger: ReactNode
  children: ReactNode
}

export function AppMenu({ trigger, children }: P) {
  return (
    <Menu.Root>
      <Menu.Trigger asChild>{trigger}</Menu.Trigger>

      <Portal>
        <Menu.Positioner>
          <Menu.Content
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            boxShadow="lg"
            borderRadius="md"
          >
            {children}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}

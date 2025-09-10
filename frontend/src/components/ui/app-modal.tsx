import { Button, CloseButton, Dialog, Portal } from '@chakra-ui/react'
import type { ReactNode } from 'react'

interface P {
  title?: string
  open: boolean
  hideFooter?: boolean
  isSaveLoading?: boolean
  trigger: ReactNode
  children: ReactNode
  footer?: ReactNode | null
  onOpenChange: (visible: boolean) => void
  onSave?: () => void
}

export function AppModal({
  title,
  open,
  hideFooter = false,
  isSaveLoading = false,
  trigger,
  children,
  footer,
  onOpenChange,
  onSave,
}: P) {
  return (
    <Dialog.Root
      lazyMount
      open={open}
      onOpenChange={(e) => onOpenChange(e.open)}
    >
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            {title && (
              <Dialog.Header>
                <Dialog.Title>{title}</Dialog.Title>
              </Dialog.Header>
            )}
            <Dialog.Body>{children}</Dialog.Body>
            {!footer && !hideFooter && (
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button size="xs" variant="outline">
                    Cancel
                  </Button>
                </Dialog.ActionTrigger>
                <Button
                  size="xs"
                  variant="primary"
                  loading={isSaveLoading}
                  onClick={() => {
                    onSave?.()
                  }}
                >
                  Save
                </Button>
              </Dialog.Footer>
            )}
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}

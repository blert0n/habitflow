import { ColorPicker, HStack, Portal, parseColor } from '@chakra-ui/react'
import { useState } from 'react'
import type { Color } from '@chakra-ui/react'

interface P {
  value?: string
  onChange?: (color: Color) => void
  hideLabel?: boolean
}

const AppColorPicker = ({ value, onChange, hideLabel = false }: P) => {
  const [color, setColor] = useState(parseColor(value ?? '#2563eb'))

  return (
    <ColorPicker.Root
      value={color}
      format="hsla"
      onValueChange={(e) => {
        setColor(e.value)
      }}
      onValueChangeEnd={(e) => {
        onChange?.(e.value)
      }}
      maxW="200px"
    >
      <ColorPicker.HiddenInput />
      {!hideLabel && <ColorPicker.Label>Color</ColorPicker.Label>}
      <ColorPicker.Control>
        <ColorPicker.Input />
        <ColorPicker.Trigger />
      </ColorPicker.Control>
      <Portal>
        <ColorPicker.Positioner>
          <ColorPicker.Content>
            <ColorPicker.Area />
            <HStack>
              <ColorPicker.EyeDropper size="xs" variant="outline" />
              <ColorPicker.Sliders />
            </HStack>
          </ColorPicker.Content>
        </ColorPicker.Positioner>
      </Portal>
    </ColorPicker.Root>
  )
}

export { AppColorPicker }

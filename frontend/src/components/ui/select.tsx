import { Portal, Select, Stack, createListCollection } from '@chakra-ui/react'
import { useMemo } from 'react'

export interface SelectItem {
  label: string
  value: string
}

interface AppSelectProps {
  label?: string
  placeholder?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  items: Array<SelectItem>
  value: string
  onChange: (value: string) => void
  width?: string | number
}

export const AppSelect = ({
  label,
  placeholder = 'Select an option',
  size = 'md',
  items,
  value,
  onChange,
  width = '320px',
}: AppSelectProps) => {
  const collection = useMemo(() => createListCollection({ items }), [items])

  return (
    <Stack gap="2" width={width}>
      <Select.Root
        size={size}
        collection={collection}
        value={value ? [value] : []}
        onValueChange={(e) => {
          onChange(e.value[0] || '')
        }}
      >
        <Select.HiddenSelect />
        {label && <Select.Label>{label}</Select.Label>}
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText placeholder={placeholder} />
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>
        <Portal>
          <Select.Positioner>
            <Select.Content>
              {collection.items.map((item) => (
                <Select.Item item={item} key={item.value}>
                  {item.label}
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
    </Stack>
  )
}

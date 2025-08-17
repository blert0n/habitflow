import { Fieldset, Flex, RadioGroup } from '@chakra-ui/react'

interface RadioOption {
  value: string
  label: string
}

interface AppRadioGroupProps {
  name: string
  selectedOption: string
  onChange: (value: string) => void
  items: Array<RadioOption>
  orientation?: 'horizontal' | 'vertical'
  label?: string
}

export const AppRadioGroup = ({
  name,
  selectedOption,
  onChange,
  items,
  orientation = 'horizontal',
  label,
}: AppRadioGroupProps) => {
  return (
    <Fieldset.Root>
      {label && (
        <Fieldset.Legend color="gray.700" fontSize={14} fontWeight="normal">
          {label}
        </Fieldset.Legend>
      )}

      <RadioGroup.Root
        name={name}
        value={selectedOption}
        onValueChange={({ value }) => {
          if (!value) return
          onChange(value)
        }}
        colorPalette="blue"
      >
        <Flex
          gap={orientation === 'vertical' ? 2 : 4}
          direction={orientation === 'vertical' ? 'column' : 'row'}
        >
          {items.map((item) => (
            <RadioGroup.Item key={item.value} value={item.value}>
              <RadioGroup.ItemHiddenInput />
              <RadioGroup.ItemIndicator />
              <RadioGroup.ItemText color="gray.700" fontWeight="normal">
                {item.label}
              </RadioGroup.ItemText>
            </RadioGroup.Item>
          ))}
        </Flex>
      </RadioGroup.Root>
    </Fieldset.Root>
  )
}

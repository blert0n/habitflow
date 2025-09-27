import { createIcon } from '@chakra-ui/react'

interface CheckMarkGradientIconProps {
  lightColor: string
  darkColor: string
  gradientId?: string
}

export const CheckMarkGradientIcon = ({
  lightColor,
  darkColor,
  gradientId = 'checkmark-gradient',
}: CheckMarkGradientIconProps) => {
  const Icon = createIcon({
    displayName: 'CheckMarkGradientIcon',
    viewBox: '0 0 24 24',
    path: [
      <defs key="gradient">
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={lightColor} stopOpacity={1} />
          <stop offset="100%" stopColor={darkColor} stopOpacity={1} />
        </linearGradient>
      </defs>,
      <path
        key="path"
        fill={`url(#${gradientId})`}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20zM9.70711 11.2929C9.31658 10.9024 8.68342 10.9024 8.29289 11.2929C7.90237 11.6834 7.90237 12.3166 8.29289 12.7071L10.2929 14.7071C10.6834 15.0976 11.3166 15.0976 11.7071 14.7071L15.7071 10.7071C16.0976 10.3166 16.0976 9.68342 15.7071 9.29289C15.3166 8.90237 14.6834 8.90237 14.2929 9.29289L11 12.5858L9.70711 11.2929z"
      />,
    ],
  })

  return <Icon />
}

import { createIcon } from '@chakra-ui/react'

interface XMarkGradientIconProps {
  lightColor: string
  darkColor: string
  gradientId?: string
}

export const XMarkGradientIcon = ({
  lightColor,
  darkColor,
  gradientId = 'xmark-gradient',
}: XMarkGradientIconProps) => {
  const Icon = createIcon({
    displayName: 'XMarkGradientIcon',
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
        d="M12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20zM9.29289 9.29289C9.68342 8.90237 10.3166 8.90237 10.7071 9.29289L12 10.5858L13.2929 9.29289C13.6834 8.90237 14.3166 8.90237 14.7071 9.29289C15.0976 9.68342 15.0976 10.3166 14.7071 10.7071L13.4142 12L14.7071 13.2929C15.0976 13.6834 15.0976 14.3166 14.7071 14.7071C14.3166 15.0976 13.6834 15.0976 13.2929 14.7071L12 13.4142L10.7071 14.7071C10.3166 15.0976 9.68342 15.0976 9.29289 14.7071C8.90237 14.3166 8.90237 13.6834 9.29289 13.2929L10.5858 12L9.29289 10.7071C8.90237 10.3166 8.90237 9.68342 9.29289 9.29289z"
      />,
    ],
  })

  return <Icon />
}

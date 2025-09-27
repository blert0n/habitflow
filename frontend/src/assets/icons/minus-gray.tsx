import { createIcon } from '@chakra-ui/react'

export const MinusGrayIcon = () => {
  const Icon = createIcon({
    displayName: 'MinusGrayIcon',
    viewBox: '0 0 24 24',
    path: [
      <defs key="gradient">
        <linearGradient
          id="minus-gray-gradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#e5e7eb" stopOpacity={1} />
          <stop offset="100%" stopColor="#9ca3af" stopOpacity={1} />
        </linearGradient>
      </defs>,
      <circle
        key="circle"
        cx="12"
        cy="12"
        r="8"
        fill="url(#minus-gray-gradient)"
      />,
      <path
        key="minus"
        d="M8 12h8"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />,
    ],
  })

  return <Icon />
}

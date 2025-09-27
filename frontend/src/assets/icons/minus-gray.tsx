interface MinusGrayIconProps {
  size?: number
}

export const MinusGrayIcon = ({ size = 24 }: MinusGrayIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      <defs>
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
      </defs>
      <circle cx="12" cy="12" r="8" fill="url(#minus-gray-gradient)" />
      <path d="M8 12h8" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

interface QuestionMarkGradientIconProps {
  lightColor?: string
  darkColor?: string
  gradientId?: string
  size?: number
}

export const QuestionMarkGradientIcon = ({
  lightColor = '#60a5fa',
  darkColor = '#2563eb',
  gradientId = 'question-gradient',
  size = 24,
}: QuestionMarkGradientIconProps) => {
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
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={lightColor} stopOpacity={1} />
          <stop offset="100%" stopColor={darkColor} stopOpacity={1} />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${gradientId})`}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20zM12 8C10.6193 8 9.5 9.11929 9.5 10.5C9.5 10.7761 9.72386 11 10 11C10.2761 11 10.5 10.7761 10.5 10.5C10.5 9.67157 11.1716 9 12 9C12.8284 9 13.5 9.67157 13.5 10.5C13.5 11.0858 13.1642 11.5 12.75 11.5C12.3358 11.5 12 11.8358 12 12.25V12.5C12 12.7761 12.2239 13 12.5 13C12.7761 13 13 12.7761 13 12.5V12.45C14.1642 12.2 15 11.2142 15 10.5C15 9.11929 13.8807 8 12.5 8H12zM12 14.5C11.7239 14.5 11.5 14.7239 11.5 15C11.5 15.2761 11.7239 15.5 12 15.5C12.2761 15.5 12.5 15.2761 12.5 15C12.5 14.7239 12.2761 14.5 12 14.5z"
      />
    </svg>
  )
}

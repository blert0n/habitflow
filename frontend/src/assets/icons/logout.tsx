import { createIcon } from '@chakra-ui/react'

export const LogoutIcon = createIcon({
  displayName: 'LogoutIcon',
  viewBox: '0 0 24 24',
  path: (
    <>
      <path
        d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <polyline
        points="16,17 21,12 16,7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <line
        x1="21"
        y1="12"
        x2="9"
        y2="12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </>
  ),
})

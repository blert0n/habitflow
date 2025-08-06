import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const config = defineConfig({
  theme: {
    breakpoints: {
      sm: '30em', // 480px (default)
      midSm: '39em', // 624px (default)
      md: '48em', // 768px (default)
      midMd: '55em', // 880px
      lg: '64em', // 992px (default)
      xl: '80em', // 1280px (default)
      '2xl': '96em', // 1536px (default)
    },
    semanticTokens: {
      colors: {
        bg: {
          DEFAULT: {
            value: { _light: '#f3f4f6', _dark: '{colors.black}' },
          },
        },
        bgDark: {
          DEFAULT: {
            value: { _light: '#f3f4f6', _dark: '{colors.black}' },
          },
        },
      },
    },
  },
})

export const system = createSystem(defaultConfig, config)

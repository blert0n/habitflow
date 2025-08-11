import {
  createSystem,
  defaultConfig,
  defineConfig,
  defineRecipe,
} from '@chakra-ui/react'

const buttonRecipe = defineRecipe({
  variants: {
    variant: {
      primary: {
        bg: 'brand.primary',
        color: 'white',
        _hover: {
          bg: 'brand.primary_hover',
        },
      },
    },
  },
})

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
        brand: {
          primary: {
            value: { _light: '#0284c6' },
          },
          primary_hover: {
            value: { _light: '#0369a1' },
          },
          streak: {
            value: { _light: '#ea580c' },
          },
          success: {
            value: { _light: '#1fa751' },
          },
        },
        bg: {
          DEFAULT: {
            value: { _light: '#f1f7fe', _dark: '{colors.black}' },
          },
        },
        bgDark: {
          DEFAULT: {
            value: { _light: '#f3f4f6', _dark: '{colors.black}' },
          },
        },
      },
    },
    recipes: {
      button: buttonRecipe,
    },
  },
})

export const system = createSystem(defaultConfig, config)

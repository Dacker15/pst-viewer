import defaultTheme from 'tailwindcss/defaultTheme'
import type { Config } from 'tailwindcss/types/config'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      black: '#000000',
      grey: {
        100: '#F7F9FB',
        200: '#EBEFF2',
        300: '#E2E6EA',
        400: '#CDD3D8',
        450: '#686B76',
        500: '#242634'
      },
      'flat-grey': '#F8F8F8',
      white: '#FFFFFF',
      blue: '#4353FF',
      green: '#11D075',
      red: '#FF1640',
      pink: '#FB51D6',
      'light-pink': '#FF99E9'
    },
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans]
      },
      lineHeight: {
        11: '3rem',
        12: '3.5rem',
        13: '4rem'
      },
      animation: {
        'slide-from-bottom': '1s ease-out 0s 1 slideFromBottom;'
      },
      keyframes: {
        slideFromBottom: {
          '0%': {
            transform: 'translateY(100%)'
          },
          '100%': {
            transform: 'translateY(0)'
          }
        }
      }
    }
  },
  plugins: []
} satisfies Config

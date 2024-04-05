const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
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
      }
    }
  },
  plugins: []
}

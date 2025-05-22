/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0A192F',
          light: '#172A45',
          dark: '#020C1B',
        },
        secondary: {
          DEFAULT: '#64FFDA',
          light: '#A8FFF1',
          dark: '#4CD5BD',
        },
        accent: {
          DEFAULT: '#F97316',
          light: '#FFA94D',
          dark: '#C2410C',
        },
        success: {
          DEFAULT: '#10B981',
          light: '#34D399',
          dark: '#059669',
        },
        warning: {
          DEFAULT: '#FBBF24',
          light: '#FCD34D',
          dark: '#D97706',
        },
        error: {
          DEFAULT: '#EF4444',
          light: '#F87171',
          dark: '#B91C1C',
        },
        background: {
          DEFAULT: '#F8FAFC',
          dark: '#0F172A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'bounce-slow': 'bounce 3s infinite',
      }
    },
  },
  plugins: [],
}
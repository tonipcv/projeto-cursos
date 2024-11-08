/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8B5CF6',
          dark: '#6D28D9',
          light: '#A78BFA'
        },
        dark: {
          DEFAULT: '#1A1A1A',
          lighter: '#2D2D2D',
          card: '#252525'
        }
      }
    }
  },
  plugins: [],
} 
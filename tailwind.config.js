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
          DEFAULT: '#B91C1C', 
          hover: '#991B1B',
        },
        secondary: {
          DEFAULT: '#D97706',
        },
        background: '#FFFAF0',
        dark: '#1C1917',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Lato"', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '2px',
        'md': '4px',
        'lg': '0px',
        'xl': '0px', 
      }
    },
  },
  plugins: [],
}
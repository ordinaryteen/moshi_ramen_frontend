/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Update warna pilihan lo (gw hapus 'ff' di belakang karena hex standar 6 digit, 
        // tapi browser modern tetep bisa baca 8 digit kok. Gw bersihin biar standar)
        primary: {
          DEFAULT: '#ee3d3d', 
          hover: '#d72727',   
        },
        secondary: {
          DEFAULT: '#d89140',
        },
        background: '#fcf8ef',
        dark: '#322b26',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Lato"', 'sans-serif'],
      },
      // UPDATE ROUNDED DISINI
      borderRadius: {
        DEFAULT: '100px',   // Tombol standar jadi agak bulet dikit
        'md': '12px',     // Card jadi lebih smooth
        'lg': '18px',     // Lengkungan besar
        'xl': '12px',     // Buat container gede
        'full': '9999px', // Buat pill shape
      }
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: '#533483',
        brandLight: '#e8e0f5',
        navy: '#1a1a2e',
        teal: '#1d9e75',
        tealLight: '#e1f5ee',
        coral: '#d85a30',
        coralLight: '#faece7',
        amber: '#ba7517',
        amberLight: '#faeeda',
        mid: '#0f3460',
        grayBg: '#f1efe8',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      },
      animation: {
        'slide-in': 'slide-in 0.3s ease-out forwards',
      }
    },
  },
  plugins: [],
}

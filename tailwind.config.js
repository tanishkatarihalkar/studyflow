/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          peach: '#FFD8C2',
          mint: '#CFFFE5',
          lavender: '#E6E6FF',
          sky: '#D9F0FF',
          lemon: '#FFF9C4',
          rose: '#FFE0E6',
        },
      },
      borderRadius: {
        xl: '16px',
        '2xl': '24px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}


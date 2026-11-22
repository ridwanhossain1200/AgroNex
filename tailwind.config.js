/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#174C3C',
          dark: '#10372F',
          leaf: '#6E9B58',
          light: '#E8F0EA',
          50: '#F2F7F4',
          100: '#E4EFE8',
          200: '#C7DFC2',
          700: '#174C3C',
          800: '#10372F',
          900: '#0B2520'
        },
        rice: '#F7F5EC',
        warmWhite: '#FFFDF7',
        clay: {
          DEFAULT: '#C56B45',
          light: '#F8EDE7',
          dark: '#9F4E2D'
        },
        harvest: {
          DEFAULT: '#D6A84B',
          light: '#FAF3E5',
          dark: '#B0842E'
        },
        river: {
          DEFAULT: '#5A7F91',
          light: '#EBF1F4',
          dark: '#3E5C6B'
        },
        primaryText: '#24332D',
        secondaryText: '#66736B',
        mutedText: '#89948B',
        softBorder: '#E4E7DC',
        status: {
          success: '#2F8058',
          warning: '#B98228',
          error: '#BD5147',
          info: '#477A9A'
        }
      },
      fontFamily: {
        sans: ['Hind Siliguri', 'Inter', 'system-ui', 'sans-serif'],
        bengali: ['Hind Siliguri', 'sans-serif'],
        english: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        '2xs': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}

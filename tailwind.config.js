/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FAF6EF',
        'paper-dark': '#F3EDE2',
        'paper-darker': '#EDE6D8',
        ink: {
          DEFAULT: '#1A1F4A',
          light: '#2D3565',
          soft: '#5B6184',
        },
        saffron: {
          DEFAULT: '#E89B2F',
          light: '#F5C66B',
          dark: '#C97F12',
        },
        amber: '#F5A623',
        forest: {
          DEFAULT: '#4A8A5B',
          light: '#7BB589',
        },
        rose: '#C75B5B',
        sky: '#5B8AC4',
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'sans-serif'],
        indic: ['Noto Sans Devanagari', 'Noto Sans Bengali', 'Noto Sans Telugu', 'Noto Sans Tamil', 'Noto Sans Kannada', 'Noto Sans Oriya', 'Noto Sans Gujarati', 'Noto Sans Malayalam', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 12px -2px rgba(26, 31, 74, 0.08)',
        'medium': '0 8px 24px -6px rgba(26, 31, 74, 0.10)',
        'warm': '0 8px 32px -8px rgba(232, 155, 47, 0.15)',
        'ink': '0 4px 20px -4px rgba(26, 31, 74, 0.15)',
      },
      borderRadius: {
        'xl2': '1.25rem',
      },
    },
  },
  plugins: [],
};

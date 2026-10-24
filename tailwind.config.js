/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#F0F4F8',
          100: '#D9E2EC',
          200: '#BCCCDC',
          300: '#9FB3C8',
          400: '#627D98',
          500: '#486581',
          600: '#334E68',
          700: '#243B53',
          800: '#132B4F',
          900: '#0B192C',
          950: '#060E18',
        },
        gold: {
          50: '#FDFBF5',
          100: '#FAF4DE',
          200: '#F4E5B2',
          300: '#ECD282',
          400: '#E3BD4F',
          500: '#D4AF37',
          600: '#B89326',
          700: '#8E7019',
          800: '#675010',
          900: '#453509',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(11, 25, 44, 0.06)',
        'elevated': '0 12px 32px -4px rgba(11, 25, 44, 0.12)',
        'gold-glow': '0 0 24px -4px rgba(212, 175, 55, 0.35)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
    },
  },
  plugins: [],
};

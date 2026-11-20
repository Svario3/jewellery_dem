/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chocolate: {
          900: '#150B07',
          800: '#23140C',
          700: '#321D12',
          600: '#462A1B',
          500: '#5C3824',
        },
        gold: {
          900: '#8A6D24',
          800: '#A4822B',
          700: '#BE9733',
          600: '#D4AF37',
          500: '#DFBE4E',
          400: '#E8CE6D',
          300: '#F0DD8F',
          200: '#F7EDB5',
          100: '#FBF6DB',
          50: '#FDFBF0',
        },
        ivory: {
          50: '#FFFFFF',
          100: '#FAF8F5',
          200: '#F5F0E8',
          300: '#EBE3D5',
          400: '#DDD2C0',
          500: '#C8BAA3',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['"Montserrat"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Cinzel"', '"Cormorant Garamond"', 'serif'],
      },
      boxShadow: {
        'gold-sm': '0 2px 10px rgba(212, 175, 55, 0.15)',
        'gold-md': '0 4px 20px rgba(212, 175, 55, 0.25)',
        'gold-lg': '0 10px 30px rgba(212, 175, 55, 0.35)',
        'luxury': '0 10px 40px -10px rgba(35, 20, 12, 0.12)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #F5DE88 50%, #C5A059 100%)',
        'gold-shimmer': 'linear-gradient(90deg, #A4822B 0%, #F0DD8F 50%, #BE9733 100%)',
        'dark-luxury': 'linear-gradient(180deg, #1A0D07 0%, #29150C 100%)',
      },
    },
  },
  plugins: [],
};

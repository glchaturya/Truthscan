/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#060a16',
          900: '#0a1124',
          850: '#0e1530',
          800: '#121a3a',
          700: '#1a2447',
          600: '#243056',
        },
        electric: {
          50: '#eaf6ff',
          100: '#d0edff',
          200: '#9bdaff',
          300: '#5cc4ff',
          400: '#26adff',
          500: '#0093f5',
          600: '#0074c4',
          700: '#005a96',
          800: '#003f6b',
          900: '#002a47',
        },
        cyan: {
          glow: '#22e3ff',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 24px rgba(38, 173, 255, 0.35)',
        'glow-lg': '0 0 60px rgba(38, 173, 255, 0.25)',
        'glow-cyan': '0 0 24px rgba(34, 227, 255, 0.35)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'pulse-slow': 'pulseSlow 3s ease-in-out infinite',
        'scan': 'scan 2.5s ease-in-out infinite',
        'spin-slow': 'spin 1.4s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
};

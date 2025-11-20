import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#102a43',
        },
        navy: {
          50: '#e3f2fd',
          100: '#bbdefb',
          200: '#90caf9',
          300: '#64b5f6',
          400: '#42a5f5',
          500: '#1a365d',
          600: '#153254',
          700: '#102840',
          800: '#0c1e30',
          900: '#081525',
        },
        teal: {
           50: '#6E56CF',
           100: '#6E56CF',
           200: '#6E56CF',
           300: '#6E56CF',
           400: '#6E56CF',
           500: '#6E56CF',
           600: '#6E56CF',
           700: '#6E56CF',
           800: '#6E56CF',
           900: '#6E56CF',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-lato)', 'sans-serif'],
        display: ['var(--font-lato)', 'sans-serif'],
      },
      fontSize: {
        'display-1': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-2': ['3.75rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'display-3': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'premium': '0 10px 40px -10px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
}
export default config

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        kai: {
          bg: '#FAF7F2',
          surface: '#FFFFFF',
          card: '#FBF9F5',
          border: '#E8E3D9',
          ink: '#1A1817',
          muted: '#635F59',
          faint: '#9E988F',
          vermilion: {
            DEFAULT: '#D9483B',
            dark: '#B83226',
            light: '#F56556',
            bg: '#FDF1EF'
          },
          indigo: {
            DEFAULT: '#1E2C4A',
            dark: '#141D33',
            light: '#2E4370',
            bg: '#EDF1F8'
          },
          gold: {
            DEFAULT: '#C59B27',
            light: '#E5B942',
            bg: '#FAF4E3'
          },
          green: {
            DEFAULT: '#2D7A4D',
            light: '#3C9B64',
            bg: '#EDF7F1'
          },
          // Dark mode palette (Sumi-e inspired)
          dark: {
            bg: '#121215',
            surface: '#1A1A20',
            card: '#22222B',
            border: '#31313D',
            ink: '#F5F3EE',
            muted: '#A5A29B',
            faint: '#6A6760'
          }
        }
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Noto Sans', 'sans-serif'],
        japanese: ['"Noto Sans JP"', '"Hiragino Kaku Gothic ProN"', '"Yu Gothic"', 'sans-serif'],
        serif_jp: ['"Noto Serif JP"', '"Yu Mincho"', 'serif'],
        telugu: ['"Noto Sans Telugu"', 'Gautami', 'sans-serif'],
      },
      boxShadow: {
        'washi': '0 2px 8px -2px rgba(26, 24, 23, 0.05), 0 1px 3px 0 rgba(26, 24, 23, 0.04)',
        'washi-md': '0 6px 16px -4px rgba(26, 24, 23, 0.08), 0 2px 6px -1px rgba(26, 24, 23, 0.05)',
        'washi-lg': '0 12px 28px -6px rgba(26, 24, 23, 0.12), 0 4px 10px -2px rgba(26, 24, 23, 0.06)',
        'vermilion': '0 4px 14px 0 rgba(217, 72, 59, 0.25)',
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        chat: {
          bg: '#1a1a1a',
          surface: '#2d2d2d',
          'user-bg': '#2563eb',
          'assistant-bg': '#374151',
          text: '#f3f4f6',
          'text-secondary': '#9ca3af',
          border: '#404040',
          input: '#374151',
        }
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
} 
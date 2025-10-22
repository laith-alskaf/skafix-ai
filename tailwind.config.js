/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#14b8a6',
        'brand-secondary': '#f59e0b',
        'base-100': '#111827',
        'base-200': '#1f2937',
        'base-300': '#374151',
        'text-primary': '#f9fafb',
        'text-secondary': '#9ca3af',
      },
      fontFamily: {
        sans: ['Cairo', 'sans-serif'],
      },
    }
  },
  plugins: [],
}
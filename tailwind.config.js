/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'notion-bg': '#191919',
        'notion-card': '#252525',
        'notion-text': '#e1e1e0',
        'notion-secondary': '#9b9a97',
        'notion-accent': '#2eaadc',
      }
    },
  },
  plugins: [],
}

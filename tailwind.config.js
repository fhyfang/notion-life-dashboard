/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'notion-bg': '#F7F7F7', // 主背景色
        'notion-card': '#FFFFFF', // 卡片背景
        'notion-text': '#191919', // 主要文字
        'notion-secondary': '#9b9a97', // 次要文字
        'notion-accent': '#2eaadc', // 强调色
      }
    },
  },
  plugins: [],
}

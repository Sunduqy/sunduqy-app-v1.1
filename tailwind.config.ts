import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'avenir-arabic': ['Avenir Arabic', 'sans-serif'],
      },
      fontWeight: {
        light: '200',
        medium: '400',
        bold: '600',
        bolder: '800'
      },
      colors: {
        'dark-blue': '#1D303B',
        'light-blue': '#9CA3AF',
        'border-light-blue': '#D1D5DB',
        'border-lighter-blue': '#f6f8f9',
        'hover-blue': '#e4e8ed',
        'badge-blue' : '#F5F5F5',
        'badge-border' : '#E5E7EB',
        'orange': '#ff6347',
        'warn-badge' : '#E5E7EB'
      }
    },
  },
  plugins: [],
};
export default config;

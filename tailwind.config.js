/**
 * Tailwind CSS configuration
 * Defines custom theme settings and content paths
 */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          dark: '#1d4ed8',
        },
        secondary: '#475569',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} 
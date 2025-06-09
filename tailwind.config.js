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
        primary: '#2563eb',
        secondary: '#475569',
      },
    },
  },
  plugins: [],
} 
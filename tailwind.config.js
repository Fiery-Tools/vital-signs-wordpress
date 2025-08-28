/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  important: '#vs-plugin-wrapper',

  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Option 1: Modern Blues (Recommended)
        primary: {
          50: '#f8fafc',   // Very light slate
          100: '#f1f5f9',  // Light slate
          200: '#e2e8f0',  // Slate border
          DEFAULT: '#f8fafc', // Default primary (bg-primary)
        },
        secondary: {
          50: '#eff6ff',   // Very light blue
          100: '#dbeafe',  // Light blue
          200: '#bfdbfe',  // Blue border
          DEFAULT: '#eff6ff', // Default secondary (bg-secondary)
        }
    }
  }
  },
  plugins: [],
}


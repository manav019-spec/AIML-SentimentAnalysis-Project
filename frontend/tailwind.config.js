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
        // B&W Minimalist Design Tokens
        bw: {
          bg: '#FFFFFF',
          'bg-dark': '#121212',
          surface: '#F7F7F7',
          'surface-dark': '#1A1A1A',
          text: '#111111',
          'text-dark': '#F5F5F5',
          muted: '#777777',
          'muted-dark': '#888888',
          border: '#E5E5E5',
          'border-dark': '#303030',
          hover: '#F0F0F0',
          'hover-dark': '#222222',
        },
        // Keep sentiment colors for data visualization (functionally meaningful)
        sentiment: {
          positive: '#22a06b',
          neutral: '#6b7280',
          negative: '#dc3545',
        }
      },
      fontFamily: {
        sans: ['DM Sans', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        'btn': '7px',
        'card': '10px',
      },
      animation: {
        'shimmer': 'shimmer 2s infinite linear',
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.2s ease-out forwards',
        'slide-up': 'slideUp 0.3s ease-out forwards',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.99)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}

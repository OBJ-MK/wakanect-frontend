/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0F1C3F',
          deep: '#0A1430',
          light: '#1A2D5A',
          muted: 'rgba(255,255,255,0.55)',
        },
        orange: {
          DEFAULT: '#EC5E2A',
          hi: '#FF7A45',
        },
        amber: {
          DEFAULT: '#FFB347',
          light: '#FFC96B',
        },
        cream: {
          DEFAULT: '#FFF8F4',
          dark: '#F5EDE6',
        },
        'wa-green': '#25D366',
        emerald: {
          DEFAULT: '#34D399',
        },
        // Admin console — danger + neutrals (namespaced pour éviter collisions)
        danger: '#E5484D',
        admin: {
          ink:    '#1B2336',
          'ink-2': '#5B6273',
          muted:  '#8A909E',
          line:   '#E7E9EE',
          fill:   '#F5F6F8',
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['3.5rem', { lineHeight: '1.1', fontWeight: '800' }],
        'display': ['2.5rem', { lineHeight: '1.15', fontWeight: '700' }],
        'h1': ['2rem', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['1.5rem', { lineHeight: '1.3', fontWeight: '700' }],
        'h3': ['1.125rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['1rem', { lineHeight: '1.6' }],
        'body': ['0.875rem', { lineHeight: '1.6' }],
        'label': ['0.75rem', { lineHeight: '1.4', fontWeight: '500' }],
        'micro': ['0.6875rem', { lineHeight: '1.3', fontWeight: '500', letterSpacing: '0.06em' }],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
        '4xl': '1.5rem',
        '5xl': '1.75rem',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.08)',
        'card': '0 4px 24px rgba(0,0,0,0.12)',
        'orange-glow': '0 0 24px rgba(236,94,42,0.25)',
        'amber-glow': '0 0 24px rgba(255,179,71,0.2)',
        'admin-card': '0 1px 4px rgba(0,0,0,0.08), 0 0 0 1px #E7E9EE',
        'sidebar': 'inset -1px 0 0 rgba(255,255,255,0.06)',
      },
      backgroundImage: {
        'gradient-navy': 'linear-gradient(135deg, #0F1C3F 0%, #0A1430 100%)',
        'gradient-orange': 'linear-gradient(135deg, #EC5E2A 0%, #FF7A45 100%)',
        'gradient-thread': 'linear-gradient(90deg, #EC5E2A 0%, #FFB347 100%)',
        'gradient-hero': 'linear-gradient(160deg, #0F1C3F 0%, #0A1430 60%, #0F1C3F 100%)',
      },
      backdropBlur: {
        'xs': '4px',
        'glass': '16px',
      },
      animation: {
        'fade-up': 'fadeUp 0.4s ease forwards',
        'scale-in': 'scaleIn 0.25s ease forwards',
        'slide-up': 'slideUp 0.35s ease forwards',
        'sparkline': 'sparkline 1.2s ease forwards',
        'slide-in-right': 'slideInRight 0.25s ease forwards',
        'bottom-sheet': 'slideUp 0.3s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        sparkline: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        slideInRight: {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}

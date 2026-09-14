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
          dark: '#0A0E1A',
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
        wa: { DEFAULT: '#25D366' },
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6',
        },
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
        'display-xl': ['clamp(2.25rem, 6vw, 4.75rem)', { lineHeight: '1.02', letterSpacing: '-0.03em' }],
        'display-lg': ['clamp(2.25rem, 5vw, 4.25rem)', { lineHeight: '1.04', letterSpacing: '-0.025em' }],
        'display-md': ['clamp(1.75rem, 4vw, 3rem)', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
        'display': ['2rem', { lineHeight: '1.18', fontWeight: '700' }],
        'h1': ['1.5rem', { lineHeight: '1.25', fontWeight: '700' }],
        'h2': ['1.25rem', { lineHeight: '1.3', fontWeight: '700' }],
        'h3': ['1rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['0.9375rem', { lineHeight: '1.55' }],
        'body': ['0.8125rem', { lineHeight: '1.55' }],
        'label': ['0.75rem', { lineHeight: '1.4', fontWeight: '500' }],
        'micro': ['0.6875rem', { lineHeight: '1.3', fontWeight: '500', letterSpacing: '0.03em' }],
      },
      borderRadius: {
        '2xl': '0.75rem',  // 12px — était 16px
        '3xl': '0.875rem', // 14px — était 20px
        '4xl': '1rem',     // 16px — était 24px
        '5xl': '1.25rem',  // 20px — était 28px
      },
      boxShadow: {
        'glass': '0 4px 20px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.06)',
        'card': '0 2px 12px rgba(0,0,0,0.10)',
        'orange-glow': '0 2px 10px rgba(236,94,42,0.18)',
        'amber-glow': '0 2px 10px rgba(255,179,71,0.15)',
        'admin-card': '0 1px 4px rgba(0,0,0,0.08), 0 0 0 1px #E7E9EE',
        'sidebar': 'inset -1px 0 0 rgba(255,255,255,0.06)',
        'lift': '0 16px 40px -20px rgba(0,0,0,0.5)',
        'glow': '0 4px 24px -8px rgba(236,94,42,0.3)',
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
        pulseDot: 'pulseDot 2s ease-in-out infinite',
        floaty: 'floaty 6s ease-in-out infinite',
        marquee: 'marquee 32s linear infinite',
        shimmer: 'shimmer 6s linear infinite',
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
        pulseDot: {
          '0%,100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.55', transform: 'scale(0.82)' },
        },
        floaty: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
    },
  },
  plugins: [],
}
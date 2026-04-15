/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        mono:    ['var(--font-mono)', 'monospace'],
        body:    ['var(--font-body)', 'sans-serif'],
      },
      colors: {
        ink:    '#07090f',
        navy:   '#0b1120',
        slate:  '#111827',
        panel:  '#151f32',
        border: '#1e2d47',
        muted:  '#8895aa',
        text:   '#e8eaf0',
        amber: {
          DEFAULT: '#f0a500',
          light:   '#ffc030',
          dark:    '#c27a00',
        },
        ember: '#e05a00',
      },
      keyframes: {
        fadeUp:  { from: { opacity: '0', transform: 'translateY(10px)' }, to: { opacity: '1', transform: 'none' } },
        shimmer: { '0%': { backgroundPosition: '200% 0' }, '100%': { backgroundPosition: '-200% 0' } },
        scaleIn: { from: { opacity: '0', transform: 'scale(0.96)' }, to: { opacity: '1', transform: 'scale(1)' } },
        slideLeft: { from: { transform: 'translateX(-100%)' }, to: { transform: 'translateX(0)' } },
      },
      animation: {
        fadeUp:    'fadeUp 0.3s ease both',
        shimmer:   'shimmer 1.6s infinite',
        scaleIn:   'scaleIn 0.2s ease',
        slideLeft: 'slideLeft 0.28s ease',
      },
      boxShadow: {
        glow:  '0 0 32px rgba(240,165,0,0.12)',
        panel: '0 4px 24px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
};

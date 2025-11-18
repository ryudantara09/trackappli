/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#2563EB',
        'primary-dark': '#1E40AF',
        'primary-light': '#DBEAFE',
        'status-applied': '#3B82F6',
        'status-interview': '#F59E0B',
        'status-offer': '#10B981',
        'status-rejected': '#EF4444',
        'status-withdrawn': '#6B7280',
        'neutral-bg-light': '#F9FAFB',
        'neutral-bg-dark': '#111827',
        'neutral-border-light': '#E5E7EB',
        'neutral-border-dark': '#374151',
        'neutral-gray': '#6B7280',
        'error': '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'display': '3rem',
        'h1': '2.25rem',
        'h2': '1.875rem',
        'h3': '1.5rem',
        'h4': '1.25rem',
        'body-lg': '1.125rem',
        'body': '1rem',
        'body-sm': '0.875rem',
        'caption': '0.75rem',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px',
      },
      borderRadius: {
        'sm': '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        'pill': '16px',
      },
    },
  },
  plugins: [],
};

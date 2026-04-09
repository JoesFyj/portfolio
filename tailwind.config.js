/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Notion-inspired warm minimalist palette
        'bg':         '#FAF9F6',   // warm off-white
        'bg-secondary':'#F4F2EE',   // slightly darker warm
        'surface':    '#FFFFFF',     // pure white cards
        'border':     '#E8E5DF',     // warm gray border
        'text':       '#1C1C1E',     // near black
        'muted':      '#6B6860',     // warm gray text
        'accent':     '#D97706',     // amber accent (warm, editorial)
        'accent-light': '#FEF3C7',  // light amber tint
        // Legacy dark mode (for hub page)
        'dark-bg':    '#111110',
        'dark-surface': '#1C1C1E',
        'dark-border': '#2C2C2A',
        'dark-text':  '#FAFAF8',
        'dark-muted': '#8B8B87',
        'dark-accent': '#D97706',
      },
      fontFamily: {
        serif:  ['Georgia', 'Cambria', '"Times New Roman"', 'serif'],
        sans:   ['"DM Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono:   ['"JetBrains Mono"', 'Menlo', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
      },
      boxShadow: {
        'card':   '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
        'lift':   '0 8px 24px rgba(0,0,0,0.10), 0 4px 8px rgba(0,0,0,0.06)',
      },
      borderRadius: {
        'xl':  '1rem',
        '2xl': '1.5rem',
      },
      maxWidth: {
        'prose-wide': '72ch',
      },
    },
  },
  plugins: [],
}

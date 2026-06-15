/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sky: {
          base: '#C8D8E8',
          light: '#E2EDF5',
          pale: '#F0F5FA',
          dark: '#7BA3C4',
        },
        deep: {
          blue: '#2B4A6E',
          navy: '#1A2F47',
        },
        ocean: {
          DEFAULT: '#4A90C2',
          light: '#6BA5D0',
        },
        teal: {
          DEFAULT: '#3D8B8B',
          light: '#5BA8A8',
        },
        leaf: {
          DEFAULT: '#5B9A5B',
        },
        agent: {
          nexus:  '#7B8FC7',
          oracle: '#C49B5A',
          forge:  '#5B9A5B',
          aegis:  '#C75A5A',
          cipher: '#5A8AC7',
          trace:  '#8B6BC7',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        card: '16px',
        button: '12px',
      },
      boxShadow: {
        card: '0 2px 12px rgba(26, 47, 71, 0.08)',
        'card-hover': '0 8px 24px rgba(26, 47, 71, 0.14)',
        cta: '0 4px 16px rgba(74, 144, 194, 0.3)',
      },
      keyframes: {
        "pulse-dot": {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%":       { transform: "scale(1.3)", opacity: "0.7" },
        },
      },
      animation: {
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}

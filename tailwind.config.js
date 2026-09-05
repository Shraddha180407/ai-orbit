/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#000000",
        surface: {
          DEFAULT: "#131316",
          elevated: "#18181c",
          hover: "#1f1f24",
          card: "#111114",
        },
        border: {
          subtle: "#1C1C1F",
          DEFAULT: "#232326",
          hover: "rgba(255, 255, 255, 0.16)",
        },
        orbit: {
          purple: "#6E56CF",
          purpleLight: "#826DEB",
          purpleDark: "#573EC2",
          amber: "#F5A623",
          cyan: "#00E5FF",
          emerald: "#10B981",
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#E4E4E7",
          muted: "#A1A1AA",
          faint: "#71717A",
        }
      },
      fontFamily: {
        sans: ["'Inter'", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}

import type { Config } from "tailwindcss";

/**
 * Design tokens lifted directly from
 * design/design_handoff_top10qb/README.md — keep in sync with that file.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#050506", // page background outside the column
        surface: "#0b0a0c", // app column
        "surface-raised": "#100f12", // cards
        "surface-hover": "#161318",
        accent: "#e8462f", // primary loud accent
        "accent-deep": "#a8281a",
        gold: "#c9a227",
        ravens: "#241773",
        "purple-deep": "#160d3f",
        "purple-mid": "#2a1a5c",
        up: "#3fb950", // positive movement
        // text ramp
        "text-quote": "#f4f1ea",
        "text-body": "#c9c4bb",
        "text-serif": "#e6ddd0",
        "text-muted": "#8a8578",
        "text-faint": "#6b6862",
        "text-fainter": "#4a4842",
        "text-faintest": "#3a3630",
      },
      fontFamily: {
        display: ["var(--font-big-shoulders)", "sans-serif"],
        body: ["var(--font-barlow)", "system-ui", "sans-serif"],
        serif: ["var(--font-dm-serif)", "serif"],
      },
      maxWidth: {
        app: "480px",
      },
      borderRadius: {
        card: "16px",
        "card-lg": "20px",
        app: "26px",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in .2s ease",
      },
    },
  },
  plugins: [],
};

export default config;

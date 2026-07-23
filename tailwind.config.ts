import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#08090b",
          900: "#0c0d10",
          850: "#111318",
          800: "#161920",
          700: "#20242c",
          600: "#2c313b",
        },
        gold: {
          50: "#fbf3e2",
          100: "#f5e4bd",
          200: "#eccd85",
          300: "#e2b458",
          400: "#d4a054",
          500: "#c48f3d",
          600: "#a97527",
          700: "#8a5d20",
        },
        mist: {
          100: "#f5f6f7",
          300: "#c7ccd4",
          400: "#9aa1ac",
          500: "#767d89",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #eccd85 0%, #d4a054 45%, #a97527 100%)",
        "ink-radial": "radial-gradient(120% 120% at 10% 0%, #161920 0%, #0c0d10 55%, #08090b 100%)",
      },
      boxShadow: {
        gold: "0 8px 30px -8px rgba(212, 160, 84, 0.45)",
        card: "0 1px 0 rgba(255,255,255,0.04), 0 12px 30px -12px rgba(0,0,0,0.6)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        floatSlow: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.7s ease forwards",
        floatSlow: "floatSlow 6s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;

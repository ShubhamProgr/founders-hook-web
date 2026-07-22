import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#080B14",
        panel: "#0F1428",
        panel2: "#141A34",
        purple: {
          DEFAULT: "#A855F7",
          glow: "#C084FC",
          deep: "#6D28D9",
        },
        lime: {
          DEFAULT: "#D4FF3F",
          deep: "#A6D400",
        },
        ink: "#EDEDF7",
        muted: "#8B90A8",
        line: "rgba(168,85,247,0.18)",
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(168,85,247,0.35)",
        limeglow: "0 0 30px rgba(212,255,63,0.35)",
      },
      backgroundImage: {
        "grid-fade": "radial-gradient(circle at 50% 0%, rgba(168,85,247,0.15), transparent 60%)",
      },
    },
  },
  plugins: [],
};
export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f1012",
        panel: "#1b1c1f",
        card: "#26272b",
        line: "#34363b",
        accent: {
          DEFAULT: "#5eead4",
          dark: "#2dd4bf",
          deep: "#115e59",
        },
        danger: "#fb7185",
        warn: "#fbbf24",
        good: "#4ade80",
      },
      fontFamily: {
        sans: ['"Inter Variable"', "system-ui", "sans-serif"],
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        rise: "rise .35s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;

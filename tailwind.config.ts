import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Quiz (siempre oscuro)
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
        // Landing (cambian con el tema claro/oscuro, ver globals.css)
        canvas: "var(--bg)",
        surface: "var(--surface)",
        surface2: "var(--surface-2)",
        edge: "var(--line)",
        fg: "var(--fg)",
        muted: "var(--muted)",
        brand: "var(--brand)",
        up: "var(--up)",
        down: "var(--down)",
      },
      fontFamily: {
        sans: ['"Inter Variable"', "system-ui", "sans-serif"],
        display: ['"Bricolage Grotesque Variable"', "system-ui", "sans-serif"],
        body: ['"Figtree Variable"', "system-ui", "sans-serif"],
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        reveal: {
          from: { width: "0px" },
          to: { width: "var(--rw)" },
        },
      },
      animation: {
        rise: "rise .35s ease-out both",
        reveal: "reveal 1.4s cubic-bezier(.22,.8,.3,1) both",
      },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#171411",
        blush: {
          50: "#fff9f7",
          100: "#faeee9",
          200: "#f5dcd6",
          300: "#eebdb8",
          400: "#dc9996",
          500: "#c97c7a"
        },
        cream: "#fbf6f0",
        gold: "#b88a4a"
      },
      fontFamily: {
        display: ["Iowan Old Style", "Baskerville", "Times New Roman", "serif"],
        sans: ["Inter", "Avenir Next", "Segoe UI", "sans-serif"]
      },
      boxShadow: {
        soft: "0 18px 55px rgba(49, 35, 29, .10)",
        card: "0 10px 35px rgba(70, 47, 38, .08)"
      },
      backgroundImage: {
        "rose-glow": "radial-gradient(circle at top right, rgba(238,189,184,.38), transparent 44%)"
      }
    }
  },
  plugins: []
};

export default config;

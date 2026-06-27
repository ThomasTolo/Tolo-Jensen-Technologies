import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: "#080b0f",
        mist: "#101418",
        graphite: "#121820",
        steel: "#d8dde5",
        line: "rgba(72, 140, 214, 0.26)",
        brand: {
          blue: "#168fe3",
          navy: "#061f45",
          ice: "#dce8f6",
          green: "#31564d"
        }
      },
      boxShadow: {
        soft: "0 24px 90px rgba(0, 35, 76, 0.32)",
        glow: "0 0 0 1px rgba(22, 143, 227, 0.22), 0 28px 90px rgba(22, 143, 227, 0.18)"
      }
    }
  },
  plugins: []
} satisfies Config;

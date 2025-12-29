import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0B0B0B",
        bone: "#F7F7F5",
        fog: "#E6E6E1"
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"]
      },
      backgroundImage: {
        "paper-grid": "linear-gradient(transparent 0 23px, rgba(0,0,0,0.05) 23px 24px), linear-gradient(90deg, transparent 0 23px, rgba(0,0,0,0.05) 23px 24px)"
      },
      boxShadow: {
        "soft-edge": "0 25px 80px -50px rgba(0,0,0,0.45)"
      }
    }
  },
  plugins: []
};

export default config;

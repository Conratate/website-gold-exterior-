const { palette } = require("./lib/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    screens: {
      // Narrow phones (SE, older Androids) need one step below Tailwind's
      // default 640px to stop price rows from cramping.
      xs: "400px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        brand: palette.brand,
        gold: {
          50: "#fdfbe9",
          100: "#fbf6c5",
          200: "#f9eb8d",
          300: "#f6d94c",
          400: "#f2c424",
          500: "#e2aa14",
          600: "#c3830d",
          700: "#9b5d10",
          800: "#804913",
          900: "#6d3c15",
        },
        charcoal: {
          50: "#f5f6f7",
          100: "#e6e8eb",
          200: "#cdd2d8",
          300: "#a8b1bb",
          400: "#7c8896",
          500: "#5e6a7a",
          600: "#4a5462",
          700: "#3d4651",
          800: "#353c45",
          900: "#1f242b",
          950: "#11151b",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
        display: ["Poppins", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient": palette.heroGradient,
        "wave-pattern":
          "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.06) 0, transparent 40%), radial-gradient(circle at 80% 60%, rgba(242,196,36,0.10) 0, transparent 45%)",
      },
      boxShadow: {
        glow: palette.glow,
        gold: "0 12px 35px -10px rgba(226, 170, 20, 0.55)",
      },
    },
  },
  plugins: [],
};

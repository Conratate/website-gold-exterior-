/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef3fb",
          100: "#d6e1f4",
          200: "#a9beea",
          300: "#7596d8",
          400: "#476fc1",
          500: "#2a52a4",
          600: "#1c3f87",
          700: "#162f68",
          800: "#11244f",
          900: "#0c1a3a",
          950: "#060f24",
        },
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
        "hero-gradient":
          "linear-gradient(135deg, rgba(6,15,36,0.95) 0%, rgba(12,26,58,0.92) 50%, rgba(22,47,104,0.88) 100%)",
        "wave-pattern":
          "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.06) 0, transparent 40%), radial-gradient(circle at 80% 60%, rgba(242,196,36,0.10) 0, transparent 45%)",
      },
      boxShadow: {
        glow: "0 20px 60px -20px rgba(17, 36, 79, 0.55)",
        gold: "0 12px 35px -10px rgba(226, 170, 20, 0.55)",
      },
    },
  },
  plugins: [],
};

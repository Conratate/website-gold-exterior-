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
        // Warm near-blacks. On the all-black site these are mostly used for
        // dark surfaces; the accent color is the yellow `gold` scale.
        brand: {
          50: "#f6f4ee",
          100: "#e9e5da",
          200: "#d3ccba",
          300: "#b0a68d",
          400: "#857b65",
          500: "#5c5446",
          600: "#2b2823",
          700: "#1f1d19",
          800: "#171512",
          900: "#100f0d",
          950: "#0a0908",
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
          50: "#f6f6f5",
          100: "#e7e6e4",
          200: "#d0cfcb",
          300: "#aeaca7",
          400: "#8f8d87",
          500: "#6f6d67",
          600: "#55534e",
          700: "#43413d",
          800: "#2e2d2a",
          900: "#1a1917",
          950: "#0e0d0c",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
        display: ["Poppins", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(135deg, rgba(10,9,8,0.97) 0%, rgba(23,21,18,0.94) 50%, rgba(43,40,35,0.9) 100%)",
        "wave-pattern":
          "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.06) 0, transparent 40%), radial-gradient(circle at 80% 60%, rgba(242,196,36,0.10) 0, transparent 45%)",
      },
      boxShadow: {
        glow: "0 20px 60px -20px rgba(0, 0, 0, 0.6)",
        gold: "0 12px 35px -10px rgba(226, 170, 20, 0.55)",
      },
    },
  },
  plugins: [],
};

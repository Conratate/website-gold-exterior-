// Site color palettes. Gold stays constant across all of them (it's the
// name of the business); `brand` is the color around it. Change ACTIVE to
// switch the whole site — Tailwind and the browser theme color both read it.
//
// The favicon (app/icon.svg) is a static file, so update its two gradient
// stops by hand to match brand-600 / brand-950 when switching.

const PALETTES = {
  black: {
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
    heroGradient:
      "linear-gradient(135deg, rgba(10,9,8,0.97) 0%, rgba(23,21,18,0.94) 50%, rgba(43,40,35,0.9) 100%)",
    glow: "0 20px 60px -20px rgba(10, 9, 8, 0.45)",
    themeColor: "#171512",
  },
  green: {
    brand: {
      50: "#eef5f0",
      100: "#d5e7da",
      200: "#a9cdb3",
      300: "#77ad87",
      400: "#4d8c60",
      500: "#2f6f45",
      600: "#1f5734",
      700: "#18452a",
      800: "#133722",
      900: "#0e2a1a",
      950: "#071a0f",
    },
    heroGradient:
      "linear-gradient(135deg, rgba(7,26,15,0.95) 0%, rgba(14,42,26,0.92) 50%, rgba(24,69,42,0.88) 100%)",
    glow: "0 20px 60px -20px rgba(19, 55, 34, 0.5)",
    themeColor: "#133722",
  },
};

const ACTIVE = process.env.SITE_PALETTE || "black";

module.exports = { PALETTES, ACTIVE, palette: PALETTES[ACTIVE] || PALETTES.black };

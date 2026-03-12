/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./projects/**/*.{html,ts}", // Añadimos esto por si acaso
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Outfit", "sans-serif"],
      },
    },
  },
  plugins: [require("daisyui")],

  daisyui: {
    themes: [
      {
        cityexplorerlight: {
          "primary": "#065B9C",
          "secondary": "#31B9F5",
          "accent": "#5FCAF8",
          "neutral": "#2B3440",
          "base-100": "#EDDDD4",
          "info": "#A1DFFA",
          "success": "#36D399",
          "warning": "#FBBD23",
          "error": "#F87272",
        },
      },
      {
        cityexplorerdark: {
          "primary": "#31B9F5",
          "secondary": "#5FCAF8",
          "accent": "#A1DFFA",
          "neutral": "#1f2937",
          "base-100": "#111827",
          "info": "#A1DFFA",
          "success": "#36D399",
          "warning": "#FBBD23",
          "error": "#F87272",
        },
      },
    ],
  },
}
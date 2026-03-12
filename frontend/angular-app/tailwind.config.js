/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./projects/**/*.{html,ts}", // Añadimos esto por si acaso
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
}
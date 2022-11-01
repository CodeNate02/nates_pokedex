/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        pressStart:["'Press Start 2P'", 'sans-serif'],
        screen:["'Silkscreen'",'sans-serif'],
        pkmn:["'Power Clear'","'Silkscreen'",'sans-serif']
      }
    },
  },
  plugins: [],
}

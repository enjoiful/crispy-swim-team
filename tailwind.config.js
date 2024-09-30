/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['OpenSans', 'sans-serif'],
        mono: ['RobotoMono', 'monospace'],
      },
    },
  },
  plugins: [],

}
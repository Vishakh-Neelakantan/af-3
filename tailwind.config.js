/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      backgroundImage: theme => ({
         'front-page': "url('/src/images/frontpage.png')"
      }),
    },
  },
  plugins: [],
}


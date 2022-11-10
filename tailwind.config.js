/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      width: {
        1024: "1024px",
      },
      height: {
        768: "768px",
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 0 40px rgba(14, 165, 233, 0.14)"
      }
    }
  },
  plugins: []
};

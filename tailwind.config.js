/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gray: "#a1a5a6",
      },
    },
    screens: {
      xm: "",
      sm: "350px",
      md: "640px",
      lg: "768px",
      xl: "951px",
    },
  },
  plugins: [],
};

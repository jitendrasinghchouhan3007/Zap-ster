/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      backgroundColor: {
        A: "#131921",
        B: "#232f3e",
        C: "#ffd814",
        D :"#ffa41c",
        E: "#ffd638",
        dark:"#141414"
      },
      colors: {
        A: "#131921",
        B: "#232f3e",
        C: "#ffd814",
      
         dark:"#141414"
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.html", "./src/**/*.jsx", "./src/**/*.js"],
  theme: {
    screens: {
      xs: "300px",  //360px
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },

    fontFamily: {
      'sans': ['DM Sans'],
      'sen': ['Sen'],
      'ubuntu': ['Ubuntu'],
      'mulish': ['Mulish'],
      'roboto': ['Roboto'],
    },
    colors: {
      primary : "#3BFF81",

      secondary: "",

      tertiary: "",

      white: "#fff",
      black: "#000",

      MODAL_BACKGROUND: "rgba(11, 12, 14, 0.77)",

      GREEN:{
        _100: "#42D979",
        _200: "#6C8173"
      },

      RED: {
        _100: "#AF202D"
      },

    },
  },
  plugins: [],
}
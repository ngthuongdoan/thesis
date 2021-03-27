module.exports = {
  purge: { content: ["./public/**/*.html", "./src/**/*.vue"] },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "light-grey": "#EEEEEE",
        control: {
          DEFAULT: "#FFD369",
          light: "#FFEAB7",
        },
      },
      boxShadow: {
        negative: "-1px -1px 20px -12px rgba(0,0,0,0.5)",
      },
      fontFamily: {
        sans: ["Catamaran", "Helvetica", "Arial", "sans-serif"],
        kredit: ['"Kredit Front"'],
        monoton: ["Monoton", "cursive"]
      },
      borderWidth: {
        action: "100px",
      },
      gridTemplateColumns: {
        add: "40% 60%",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
  important: true,
};

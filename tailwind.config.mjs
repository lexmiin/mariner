const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        gray: colors.gray,
      },
      fontFamily: {
        cinzel: ['"Cinzel"', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};

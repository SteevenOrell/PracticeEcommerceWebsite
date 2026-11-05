import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter Variable"', "Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        display: ["Anton", '"Arial Narrow"', "Impact", "sans-serif"],
      },
      colors: {
        ink: "#0b0b0b",
        paper: "#f5f5f3",
        stone: { 450: "#8a8a85" },
        accent: "#d7ff3a",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};

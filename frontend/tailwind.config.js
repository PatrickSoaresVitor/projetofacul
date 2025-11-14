/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0D6EFD",   // Azul principal
          dark: "#0A58CA",      // Azul escuro (hover)
          light: "#E7F1FF",     // Azul bem claro (fundos)
        },
        secondary: {
          DEFAULT: "#22C55E",   // Verde principal
          dark: "#15803D",      // Verde escuro
          light: "#DCFCE7",     // Verde claro
        },
      },
    },
  },
  plugins: [],
};

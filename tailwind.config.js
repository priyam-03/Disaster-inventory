// tailwind.config.js
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    "text-green-600",
    "text-red-600",
    "bg-green-600",
    "bg-red-600",
    "hover:bg-green-700",
    "hover:bg-red-700",
    "focus:ring-green-500",
    "focus:ring-red-500",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

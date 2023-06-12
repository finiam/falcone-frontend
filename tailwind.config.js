/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: "#242838",
        "light-blue": "#e6ebee",
        black: "#2c2810",
        orange: "#ec7b44",
        red: "#cd0101",
        "light-red": "#fff2f2",
        green: "#128a01",
        "light-green": "#edffea",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    fontFamily: {
      body: ["var(--font-inter)"],
      title: ["var(--font-yeseva-one)"],
    },
  },
  plugins: [],
};

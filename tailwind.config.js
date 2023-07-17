/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/modules/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        offwhite: "#EFF2F3",
        blue: "#242838",
        "light-blue": "#e6ebee",
        black: "#2c2810",
        orange: "#ec7b44",
        red: "#cd0101",
        "light-red": "#fff2f2",
        green: "#128a01",
        "light-green": "#edffea",
        "light-gray": "#bfc9ce",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      borderRadius: {
        sm: "4px",
      },
    },
    fontFamily: {
      inter: ["var(--font-inter)"],
      yeseva: ["var(--font-yeseva-one)"],
    },
    fontSize: {
      12: "12px",
      16: "16px",
      18: "18px",
      20: "20px",
      24: "24px",
      32: "32px",
      48: "48px",
      64: "64px",
      80: "80px",
      112: "112px",
    },
    fontWeight: {
      400: 400,
      500: 500,
      600: 600,
    },
    lineHeight: {
      1: 1,
      24: "24.2px",
      32: "32px",
      40: "40px",
      55: "55px",
      80: "80px",
      100: "100px",
    },
  },
  plugins: [],
};

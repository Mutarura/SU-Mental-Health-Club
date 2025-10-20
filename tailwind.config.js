/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'su-blue': '#3A5DAE',  // Strathmore Blue - Pantone 7455 C
        'su-red': '#E03C31',   // Strathmore Red - Pantone 179 C
        'su-gold': '#EED484',  // Strathmore Gold - Pantone 7403 C
        'su-black': '#2D2926', // Strathmore Black - Pantone Black C
      },
      fontFamily: {
        sans: ['"Gill Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
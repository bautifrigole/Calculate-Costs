import type { Config } from 'tailwindcss'
const {nextui} = require("@nextui-org/react");

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'gray-lightest': '#494949',
        'gray-light': '#191919',
        'gray-dark': '#111111',
        'cream': '#D9D9D9',
        'cream-dark': '#6A6A6A',
      },
      height: {
        '40p': '40%',
      }
      
    },
    
  },
  darkMode: "class",
  plugins: [nextui()],
}
export default config

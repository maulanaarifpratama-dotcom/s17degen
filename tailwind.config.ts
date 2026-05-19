import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      boxShadow: {
        neon: '0 0 35px rgba(56, 189, 248, 0.18)',
      },
    },
  },
  plugins: [],
};

export default config;

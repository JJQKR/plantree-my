import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    screens: {
      sm: { min: '428px', max: '767px' }
    },

    extend: {
      colors: {
        'custom-green': '#e5eed6',
        forestGreen: '#008A02',
        forestGray: '#727272',
        forestBorderGreen: '#727272'
      },
      fontFamily: {
        sans: ['Pretendard', 'sans-serif']
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      },
      height: {
        '152': '37.5rem'
      }
    }
  },
  colors: {
    'ten-pink': 'FFC5C5'
  },
  plugins: []
};
export default config;

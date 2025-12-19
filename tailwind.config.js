/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // MetaMask Brand Colors
        primary: {
          default: '#037DD6',
          alternative: '#0260A4',
          muted: '#037DD619',
          inverse: '#FCFCFC',
          disabled: '#037DD680',
        },
        // Background colors
        background: {
          default: '#FFFFFF',
          alternative: '#F2F4F6',
          hover: '#FAFBFC',
          pressed: '#EDEFF1',
        },
        // Text colors
        text: {
          default: '#24272A',
          alternative: '#535A61',
          muted: '#BBC0C5',
        },
        // Border colors
        border: {
          default: '#BBC0C5',
          muted: '#D6D9DC',
        },
        // Icon colors
        icon: {
          default: '#24272A',
          alternative: '#6A737D',
          muted: '#BBC0C5',
        },
        // Semantic colors
        error: {
          default: '#D73A49',
          alternative: '#B92534',
          muted: '#D73A4926',
        },
        warning: {
          default: '#F66A0A',
          alternative: '#C65507',
          muted: '#F66A0A26',
        },
        success: {
          default: '#28A745',
          alternative: '#1E7E34',
          muted: '#28A74526',
        },
        info: {
          default: '#037DD6',
          muted: '#037DD626',
        },
        // Overlay
        overlay: {
          default: '#00000066',
          alternative: '#000000CC',
        },
        // Dark theme colors
        dark: {
          background: {
            default: '#24272A',
            alternative: '#141618',
          },
          text: {
            default: '#FFFFFF',
            alternative: '#D6D9DC',
            muted: '#9FA6AE',
          },
          border: {
            default: '#848C96',
            muted: '#3B4046',
          },
        },
      },
      fontFamily: {
        sans: ['Euclid Circular B', 'system-ui', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
      fontSize: {
        'display-lg': ['52px', { lineHeight: '56px', letterSpacing: '-0.02em' }],
        'display-md': ['40px', { lineHeight: '48px', letterSpacing: '-0.01em' }],
        'heading-lg': ['32px', { lineHeight: '40px' }],
        'heading-md': ['24px', { lineHeight: '32px' }],
        'heading-sm': ['20px', { lineHeight: '28px' }],
        'body-lg': ['18px', { lineHeight: '28px' }],
        'body-md': ['16px', { lineHeight: '24px' }],
        'body-sm': ['14px', { lineHeight: '20px' }],
        'body-xs': ['12px', { lineHeight: '16px' }],
      },
      borderRadius: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        'full': '9999px',
      },
      spacing: {
        '0': '0px',
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
      },
    },
  },
  plugins: [],
};


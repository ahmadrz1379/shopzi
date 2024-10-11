module.exports = {
  purge: [
    "*.php" , 
    './src/**/*.{js,jsx,ts,tsx}', // Include all JS and JSX files in src and subdirectories
    './src/**/*.html',
  ],
  darkMode: false,
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};

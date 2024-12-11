/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      'orange-200' : '#FED7AA',
      'orange-300' : '#FDBA74',
      'orange-400' : '#FB923C',
      'neutral-600' : '#525252',
      'state-100' : '#F1F5F9',
      'white' : '#FFFFFF',
      'black' : '#000000',
      'stone-800' : '#292524',
      'stroke-1' : 'rgba(115, 115, 115, 0.4)',
      'textField-1' : '#E2E8F0',
      'textField-2' : '#64748B',
    },
  },
  plugins: [
   
  ],
}
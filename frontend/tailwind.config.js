// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ["./src/**/*.{html,js,ts,jsx,tsx}", "./*.html"],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

 export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        abril: ['"Abril Fatface"', 'cursive'],
         poppins: ['"Poppins"', 'sans-serif'],
         elegant: ['Cormorant', 'serif'],
      },
      animation: {
                'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
            },
            keyframes: {
                fadeInUp: {
                    '0%': {
                        opacity: '0',
                        transform: 'translateY(30px)'
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateY(0)'
                    },
                }
            }
    },
  },
  plugins: [require('tailwind-scrollbar')],
}
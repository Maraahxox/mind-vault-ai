/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Adjust based on your project structure
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animations: {
        // Fade-in animation
        'fade-in': 'fadeIn 1s ease-out',
        // Slide-up animation
        'slide-up': 'slideUp 0.8s ease-out',
        // Pulse glow for buttons and elements
        'pulse-glow': 'pulseGlow 2s infinite ease-in-out',
        // Neon flicker for text
        'neon-flicker': 'neonFlicker 1.5s infinite alternate',
        // Bounce for interactive elements
        'bounce-slow': 'bounceSlow 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(168, 85, 247, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(168, 85, 247, 0.8)' },
        },
        neonFlicker: {
          '0%': { opacity: '0.8', textShadow: '0 0 10px rgba(168, 85, 247, 0.5)' },
          '100%': { opacity: '1', textShadow: '0 0 20px rgba(168, 85, 247, 1)' },
        },
        bounceSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};

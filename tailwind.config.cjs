module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        "fade-in": "fadeIn 1s ease-out",
        "slide-up": "slideUp 0.8s ease-out",
        "pulse-glow": "pulseGlow 2s infinite ease-in-out",
        "neon-flicker": "neonFlicker 1.5s infinite alternate",
        "bounce-slow": "bounceSlow 3s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 5px rgba(168, 85, 247, 0.5)" },
          "50%": { boxShadow: "0 0 20px rgba(168, 85, 247, 0.8)" },
        },
        neonFlicker: {
          "0%": {
            opacity: "0.8",
            textShadow: "0 0 10px rgba(168, 85, 247, 0.5)",
          },
          "100%": {
            opacity: "1",
            textShadow: "0 0 20px rgba(168, 85, 247, 1)",
          },
        },
        bounceSlow: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#020204",
          surface: "#0A0C10",
          "surface-2": "#12141A",
          "surface-3": "#1A1D26",
        },
        border: {
          DEFAULT: "#1E2130",
          active: "#2A6FA8",
        },
        text: {
          primary: "#E8ECF4",
          secondary: "#8B92A8",
          muted: "#4A5068",
        },
        accent: {
          DEFAULT: "#2A6FA8",
          glow: "#38BDF8",
        },
        status: {
          danger: "#EF4444",
          success: "#22C55E",
          warning: "#F59E0B",
        },
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateY(8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 8px rgba(56, 189, 248, 0.3)" },
          "50%": { boxShadow: "0 0 16px rgba(56, 189, 248, 0.5)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease-out",
        slideIn: "slideIn 0.3s ease-out",
        glowPulse: "glowPulse 2s ease-in-out infinite",
      },
      borderRadius: {
        xs: "4px",
        sm: "6px",
        DEFAULT: "8px",
      },
      fontFamily: {
        mono: ["ui-monospace", "SFMono-Regular", "Courier New", "monospace"],
      },
    },
  },
  plugins: [],
};

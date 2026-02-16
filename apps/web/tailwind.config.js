/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
    "./agent/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      components: {
        ".scrollbar-pretty":
          "overflow-y-scroll [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-transparent",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        // Shadow Journal
        brand: "#6c2bee",
        "background-dark": "#0B0014",
        "background-dark-alt": "#1A0B2E",
        "surface-dark": "#161022",
        "brand-glow": "#2d1b4e",
        "brand-deep": "#1a0b2e",
        // Dashboard (light theme)
        "dashboard-bg": "#ffffff",
        "dashboard-panel": "#f8fafc",
        "dashboard-border": "#e2e8f0",
        "dashboard-sidebar-bg": "#FDFDFF",
        "dashboard-main-bg": "#F8F9FE",
        "dashboard-stroke": "#E6E8F2",
      },
      boxShadow: {
        "card-layered":
          "0 4px 6px -1px rgba(0,0,0,0.05), 0 10px 15px -3px rgba(0,0,0,0.03)",
        "button-glow": "0 0 15px rgba(157,141,241,0.2)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        headline: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("tailwind-scrollbar")],
};

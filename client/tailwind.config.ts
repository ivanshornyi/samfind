import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        ml: "896px",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        tetrary: {
          DEFAULT: "var(--tetrary-background)",
          foreground: "var(--tetrary-background)",
        },
        link: {
          DEFAULT: "var(--primary)",
          hover: "var(--link-hover)",
          active: "var(--link-active)",
        },
        border: "hsl(var(--border))",
        input: "var(--input)",
        ring: "var(--ring)",
        disabled: "var(--disabled)",
        blue: {
          "50": "#BEB8FF",
        },
        violet: {
          "50": "#CE9DF3",
          "100": "#A64CE8",
          "200": "#8F40E5",
          "300": "#713FA5",
          "400": "#501A88",
          "500": "#26123A",
          "600": "#351B936E",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      fontFamily: {
        manrope: "var(--font-monrope)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

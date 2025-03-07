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
      borderColor: {
        customGreyButton: "#A8A8A8",
        customWhiteManager: "#BEB8FF"
      },
      backgroundColor: {
        customBlackTags: "#242424",
        customBlackManagerBG: "#242424",
        customCardBG: "#28282C",
        customBoulderBallPinkBGRGBA: "rgba(53, 27, 147, 0.43)"
      },
      textColor: {
        customGreyCoalSubText: "#A8A8A8",
        customGreyColorSubText: "#DCDCDC",
        customPinkSubText: "#CE9DF3",
        customSaturedPinkButtonText: "#8F40E5"
      },
      backdropBlur: {
        customPinkButtonBGRGBA: "blur(14.10px)",
        customBoulderBallPinkBGRGBA: "blur(72.76px)"
      },
      blur: {
        customBoulderBallPinkBGRGBA: "72.76px"
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
        toast: {
          DEFAULT: "var(--toast-success-background)",
          destructive: "var(--toast-destructive-background)",
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

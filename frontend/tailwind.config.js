/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        /* Inter everywhere. font-display utility resolves to Inter too —
           the LOGO uses the custom .brand-logo class for Young Serif. */
        sans:    ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        "display-tight": "-0.035em",
      },
      colors: {
        /* ── Single green family, three depths + bright pop ────────────── */
        cream:  "#e8efd6",
        soft:   "#deebcb",
        mist:   "#d3deb6",
        moss:   "#a3b48a",
        bright: "#9fe878",
        deep:   "#1f2e15",
        ink:    "#0e1505",
        paper:  "var(--cream)",
        current: {
          10:  "var(--current-color-10)",
          20:  "var(--current-color-20)",
          40:  "var(--current-color-40)",
          100: "var(--current-color-100)",
        },
        /* Legacy aliases — old code paths still resolve */
        green:  { 10: "#e8efd6", 20: "#d3deb6", 40: "#9fe878", 100: "#1f2e15" },
        pink:   { 10: "#d3deb6", 20: "#a3b48a", 40: "#9fe878", 100: "#1f2e15" },

        /* ── Legacy shadcn tokens (kept for pages not yet revamped) ───── */
        border:     "hsl(var(--border))",
        input:      "hsl(var(--input))",
        ring:       "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        /* Design system brand tokens */
        "ds-green":       "#335403",
        "ds-green-800":   "#2a4502",
        "ds-green-900":   "#1f3502",
        "ds-green-600":   "#425f15",
        "ds-green-300":   "#8a9d6a",
        "ds-green-100":   "#c8d3b3",
        "ds-green-50":    "#e7ebe1",
        "ds-cream":       "#f5f1e6",
        "ds-cream-200":   "#ebe5d2",
        "ds-cream-300":   "#d8d0b8",
        "ds-pink":        "#ffb8f2",
        "ds-pink-500":    "#ff8be5",
        "ds-pink-300":    "#ffd4f6",
        "ds-ink-900":     "#0e1505",
        "ds-ink-700":     "#2a2f1f",
        "ds-ink-500":     "#5a604a",
        "ds-ink-300":     "#9aa090",
        "ds-ink-100":     "#d8dccf",
        /* Legacy tokens still referenced in some spots */
        cream:            "hsl(var(--cream))",
        charcoal:         "hsl(var(--charcoal))",
        "card-border":    "hsl(var(--card-border))",
        "bvi-orange":     "hsl(var(--bvi-orange))",
      },
      borderRadius: {
        lg:   "var(--radius)",
        md:   "calc(var(--radius) - 2px)",
        sm:   "calc(var(--radius) - 6px)",
        xl:   "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
        "3xl": "calc(var(--radius) + 16px)",
      },
      boxShadow: {
        "ds-xs": "0 1px 2px rgba(51, 84, 3, 0.08)",
        "ds-sm": "0 2px 8px -2px rgba(51, 84, 3, 0.14), 0 1px 3px rgba(51, 84, 3, 0.08)",
        "ds-md": "0 8px 20px -4px rgba(51, 84, 3, 0.18), 0 3px 6px -1px rgba(51, 84, 3, 0.10)",
        "ds-lg": "0 16px 36px -8px rgba(51, 84, 3, 0.22), 0 6px 12px -2px rgba(51, 84, 3, 0.12)",
        "ds-xl": "0 28px 56px -12px rgba(51, 84, 3, 0.26), 0 8px 16px -4px rgba(51, 84, 3, 0.14)",
        "ds-pink-sm": "0 2px 8px -2px rgba(255, 139, 229, 0.45), 0 1px 3px rgba(255, 139, 229, 0.28)",
        "ds-pink-md": "0 8px 20px -4px rgba(255, 139, 229, 0.50), 0 3px 6px -1px rgba(255, 139, 229, 0.30)",
        "ds-pink-lg": "0 16px 36px -8px rgba(255, 139, 229, 0.55), 0 6px 12px -2px rgba(255, 139, 229, 0.32)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(-3deg)" },
          "50%":       { transform: "translateY(-8px) rotate(-3deg)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px) rotate(2deg)" },
          "50%":       { transform: "translateY(-6px) rotate(2deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
        "fade-in":        "fade-in 0.3s ease-out",
        "float":          "float 4s ease-in-out infinite",
        "float-slow":     "float-slow 5s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

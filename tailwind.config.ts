import type { Config } from "tailwindcss";

/**
 * "Midnight transcript console" palette.
 * Dark near-black/navy surfaces, off-white text, muted gray, subtle borders,
 * twilight-blue accent (with optional muted purple). Monospace for timestamps,
 * URLs, and status labels.
 */
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Surfaces
        console: {
          bg: "#0a0e16", // page background — near-black navy
          panel: "#111a28", // cards / panels — deep navy
          raised: "#16202f", // hover / raised — twilight blue
          border: "#222d42", // subtle borders
        },
        // `ink` = primary text (off-white) so existing text-ink reads light on dark
        ink: {
          DEFAULT: "#e7eaf0",
          soft: "#c3c9d6",
        },
        // Muted gray secondary text
        muted: "#9aa4b8",
        // Accent — twilight blue
        accent: {
          DEFAULT: "#6d8bff",
          hover: "#5a79f5",
          soft: "#16203a", // dark navy tint for chips/badges/CTA wells
        },
        // Optional muted purple
        purple: {
          DEFAULT: "#8b7cf6",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Consolas",
          "monospace",
        ],
      },
      boxShadow: {
        card: "0 1px 0 rgba(255,255,255,0.02), 0 12px 32px rgba(0,0,0,0.35)",
      },
    },
  },
  plugins: [],
};

export default config;

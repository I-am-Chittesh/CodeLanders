import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // Scans all subfolders in components/
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // SIREN Theme Colors (Cyber Forensic Palette)
        siren: {
          red: "#ef4444",      // Alert Red
          green: "#22c55e",    // Success/Matrix Green
          dark: "#0a0a0a",     // Deep Black Background
          panel: "#171717",    // Dashboard Panel Grey
          text: "#e5e5e5",     // High Contrast Text
        },
      },
    },
  },
  plugins: [],
};
export default config;
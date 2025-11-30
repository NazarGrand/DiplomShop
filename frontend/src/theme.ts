import type { Theme } from "theme-ui";

export const theme: Theme = {
  config: {
    initialColorModeName: "light",
  },
  colors: {
    text: "#FFFFFF",
    background: "#111827",
    primary: "#10B981",
    secondary: "#059669",
    accent: "#EC4899",
    muted: "#9CA3AF",
    dark: "#1F2937",
    cardBg: "#1F2937",
    border: "#374151",
    graySoft: "#374151",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",
    emerald400: "#dde4ea",
    emerald500: "#10B981",
    emerald600: "#059669",
    emerald700: "#047857",
    emerald800: "#065F46",
    gray300: "#D1D5DB",
    gray400: "#9CA3AF",
    gray600: "#4B5563",
    gray700: "#374151",
    gray800: "#1F2937",
    gray900: "#111827",
  },
  fonts: {
    body: "'Ubuntu', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    heading:
      "'Ubuntu', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    oswald: "'Oswald', sans-serif",
  },
  fontWeights: {
    body: 400,
    heading: 800,
    bold: 700,
  },
  styles: {
    root: {
      fontFamily: "body",
      color: "text",
      bg: "background",
    },
  },
  radii: {
    sm: 4,
    md: 8,
    lg: 12,
    full: 999,
  },
  shadows: {
    soft: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
    medium:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    strong:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  },
  breakpoints: ["640px", "1024px", "1280px"],
};

export default theme;

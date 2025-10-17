export const colors = {
  background: "#000000",
  surface: "#111111",
  surfaceAlt: "#1a1a1a",
  accent: "#ff8c00",
  textPrimary: "#f5f5f5",
  textMuted: "#aaaaaa",
  border: "#2a2a2a",
  error: "#ff4d4d",
  success: "#00ff88",
  warning: "#ffaa00",
  info: "#00bfff",

  categories: {
    Food: "#d98b48",
    "Health & Fitness": "#6bcf89",
    Travel: "#5ea7d7",
    Transport: "#9b7fe6",
    Shopping: "#e06b6b",
    Entertainment: "#d4b65e",
    Career: "#5ac6d4",
    Bills: "#a1846a",
  },

  charts: {
    weightLine: "#ff8c00",

    calories: "#ff8c00",
    protein: "#4caf50",
    carbs: "#2196f3",
    fat: "#ff5252",
    fiber: "#ffca28",

    ma7: "#00bcd4",
    ma30: "#9c27b0",
    ma90: "#795548",

    profit: "#82ca9d",
    loss: "#ff6961",

    pie: [
      "#00bcd4",
      "#4caf50",
      "#2196f3",
      "#ff5252",
      "#ffca28",
      "#ff8c00",
      "#9c27b0",
      "#795548",
    ],

    baseline: "#ff8c00",
    p5: "#4caf50",
    p25: "#2196f3",
    p50: "#ff5252",
    p75: "#9c27b0",
    p95: "#ffca28",

    primary: "#ff8c00",
    secondary: "#4caf50",

    grid: "#2a2a2a",
    axis: "#aaaaaa",
    tooltipBg: "#111111",
    tooltipText: "#f5f5f5",
  },
};

export const spacing = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  xxl: "3rem",
};

export const radii = {
  sm: "0.25rem",
  md: "0.5rem",
  lg: "1rem",
  xl: "2rem",
  full: "9999px",
};

export const shadows = {
  none: "none",
  soft: "0 0 10px rgba(255, 140, 0, 0.2)",
  medium: "0 0 20px rgba(255, 140, 0, 0.4)",
  accent: `0 0 15px #ff8c00, 0 0 30px #ff8c00`,
};

export const typography = {
  fontFamily: `"Inter", "Segoe UI", "Roboto", sans-serif`,
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.25rem",
    xl: "1.5rem",
    xxl: "2rem",
    xxxl: "2.5rem",
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    bold: 700,
    black: 900,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const transitions = {
  fast: "all 0.15s ease-in-out",
  base: "all 0.3s ease",
  slow: "all 0.5s ease",
};

export const breakpoints = {
  mobile: "480px",
  tablet: "768px",
  laptop: "1024px",
  desktop: "1280px",
  wide: "1536px",
};

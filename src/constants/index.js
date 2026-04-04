// ══════════════════════════════════════════════════════════════════
//  CONSTANTS & HELPERS
// ══════════════════════════════════════════════════════════════════

export const ADMIN_USER = "admin";
export const ADMIN_PASS = "admin123";

export const CAT_COLORS = {
  Housing:       { solid: "#6366f1", light: "#6366f120" },
  Food:          { solid: "#f59e0b", light: "#f59e0b20" },
  Transport:     { solid: "#3b82f6", light: "#3b82f620" },
  Entertainment: { solid: "#ec4899", light: "#ec489920" },
  Utilities:     { solid: "#8b5cf6", light: "#8b5cf620" },
  Shopping:      { solid: "#f97316", light: "#f9731620" },
  Health:        { solid: "#10b981", light: "#10b98120" },
  Education:     { solid: "#06b6d4", light: "#06b6d420" },
  Income:        { solid: "#22c55e", light: "#22c55e20" },
  Other:         { solid: "#94a3b8", light: "#94a3b820" },
};

export const CAT_LIST = [
  "Housing", "Food", "Transport", "Entertainment",
  "Utilities", "Shopping", "Health", "Education", "Other",
];

export const fmt       = (n) => "₹" + Number(n).toLocaleString("en-IN");
export const catColor  = (c) => (CAT_COLORS[c] || CAT_COLORS.Other).solid;
export const catLight  = (c) => (CAT_COLORS[c] || CAT_COLORS.Other).light;
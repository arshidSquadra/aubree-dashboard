// Indian number formatting helpers (lakh / crore)
const inGroup = new Intl.NumberFormat("en-IN");

export const formatNum = (n: number) => inGroup.format(Math.round(n));

/** Full rupee value with Indian grouping, e.g. ₹1,53,900 */
export const formatINR = (n: number) => `₹${inGroup.format(Math.round(n))}`;

/** Compact rupee value, e.g. ₹4.2 L, ₹1.3 Cr, ₹8.4K */
export function formatINRCompact(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 1e7) return `${sign}₹${(abs / 1e7).toFixed(2).replace(/\.?0+$/, "")} Cr`;
  if (abs >= 1e5) return `${sign}₹${(abs / 1e5).toFixed(2).replace(/\.?0+$/, "")} L`;
  if (abs >= 1e3) return `${sign}₹${(abs / 1e3).toFixed(1).replace(/\.0$/, "")}K`;
  return `${sign}₹${Math.round(abs)}`;
}

export const formatPct = (n: number, digits = 1) => `${n > 0 ? "+" : ""}${n.toFixed(digits)}%`;

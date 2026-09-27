// Mock "in-house system" data for stock control, indents, escalations and reconciliation.
// Shapes are flat and id-based so the MongoDB-backed APIs can replace them later.
import { channels, cloudKitchens, outlets, products } from "./catalog";

const rng = (seed: number) => { let s = (seed * 7919 + 104729) % 2147483647 || 1; const next = () => (s = (s * 16807) % 2147483647) / 2147483647; next(); next(); return next; };

export type LocationKind = "store" | "hub";
export type StockLocation = { id: string; name: string; kind: LocationKind; distanceKm: number };
export const stockLocations: StockLocation[] = [
  ...outlets.map((o, i) => ({ id: o.id, name: o.name, kind: "store" as const, distanceKm: [4, 6, 8, 9, 18, 21, 38][i] ?? 10 })),
  ...cloudKitchens.map((k, i) => ({ id: k.id, name: k.name, kind: "hub" as const, distanceKm: 3 + ((i * 7) % 30) })),
];
export const locationById = (id: string) => stockLocations.find((l) => l.id === id)!;

/** Default thresholds per product. `min` = attention zone, `critical` = danger zone (always below min). */
export type Threshold = { min: number; critical: number };
export const defaultThresholds: Record<string, Threshold> = Object.fromEntries(
  products.map((p, i) => [p.id, { min: [8, 10, 6, 5, 12, 10, 14, 4, 6, 8][i] ?? 8, critical: [3, 4, 2, 2, 5, 4, 6, 1, 2, 3][i] ?? 3 }]),
);

export type StockRow = { id: string; locationId: string; productId: string; onHand: number };
export const stockRows: StockRow[] = stockLocations.flatMap((loc, li) =>
  products.map((p, pi) => {
    const r = rng(li * 97 + pi * 13 + 5)();
    const t = defaultThresholds[p.id]!;
    const onHand = r < 0.07 ? 0 : r < 0.2 ? Math.max(1, Math.round(t.critical * r * 5)) : r < 0.38 ? t.critical + 1 + Math.round(r * 3) : t.min + Math.round(r * 14);
    return { id: `${loc.id}-${p.id}`, locationId: loc.id, productId: p.id, onHand };
  }),
);

export type StockStatus = "green" | "orange" | "red";
export const stockStatus = (onHand: number, t: Threshold): StockStatus => (onHand <= t.critical ? "red" : onHand < t.min ? "orange" : "green");
export const suggestedReorder = (onHand: number, t: Threshold) => Math.max(1, t.min * 2 - onHand);

export type ActivityType = "Indent" | "Transfer" | "Wastage";
export type Activity = { id: string; type: ActivityType; locationId: string; productId: string; qty: number; at: string; note: string };
export const activitySeed: Activity[] = Array.from({ length: 24 }, (_, i) => {
  const r = rng(i * 31 + 7);
  const type = (["Indent", "Transfer", "Wastage"] as const)[i % 3]!;
  const loc = stockLocations[Math.floor(r() * stockLocations.length)]!;
  const p = products[Math.floor(r() * products.length)]!;
  const h = 7 + (i % 13);
  return { id: `act${i}`, type, locationId: loc.id, productId: p.id, qty: 2 + Math.floor(r() * 12), at: `${i < 12 ? "Today" : "Yesterday"} ${String(h).padStart(2, "0")}:${String((i * 17) % 60).padStart(2, "0")}`, note: type === "Wastage" ? ["Expired", "Damaged in transit", "Quality reject"][i % 3]! : type === "Transfer" ? "Surplus rebalanced" : "Auto-suggested reorder" };
});

export const deliveriesInTransit = [
  { id: "dl1", to: "Whitefield", items: 42, eta: "11:40 AM" },
  { id: "dl2", to: "Airport (KIA T2)", items: 36, eta: "12:10 PM" },
  { id: "dl3", to: "Sarjapur Hub", items: 28, eta: "11:55 AM" },
  { id: "dl4", to: "Electronic City", items: 31, eta: "12:25 PM" },
];
export const damageReports = [
  { id: "dm1", location: "Koramangala", product: "Blueberry Cheesecake", qty: 3, reason: "Crushed box", at: "Today 09:20" },
  { id: "dm2", location: "Hebbal Hub", product: "Red Velvet Cake", qty: 2, reason: "Temperature excursion", at: "Today 08:05" },
  { id: "dm3", location: "HSR Layout", product: "Tiramisu Jar", qty: 4, reason: "Leaked jar", at: "Yesterday 19:40" },
];

export type EscalationStep = { role: string; person: string; minutes: number };
export const defaultEscalation: EscalationStep[] = [
  { role: "Executive", person: "Location executive", minutes: 3 },
  { role: "Store Manager", person: "Store / following manager", minutes: 3 },
  { role: "Area Manager", person: "Ravi Menon", minutes: 5 },
  { role: "Operations Manager", person: "Priya Nair", minutes: 0 },
];

// ---- Reconciliation ----
export type InvoiceStatus = "Paid" | "Cancelled" | "Voided";
export type PaymentStatus = "Successful" | "Failed" | "Cancelled";
export type Invoice = { id: string; channel: string; location: string; amount: number; gst: number; status: InvoiceStatus; payment: PaymentStatus; mode: string; edc: boolean; at: string; items: { name: string; qty: number; price: number }[] };
const invChannels = ["In-store", "Swiggy", "Zomato", "Own Website"];
export const invoices: Invoice[] = Array.from({ length: 28 }, (_, i) => {
  const r = rng(i * 53 + 11);
  const ch = invChannels[i % 4]!;
  const items = Array.from({ length: 1 + Math.floor(r() * 3) }, (_, k) => { const p = products[Math.floor(r() * products.length)]!; return { name: p.name, qty: 1 + (k % 2), price: p.price }; });
  const amount = items.reduce((a, it) => a + it.qty * it.price, 0);
  const status: InvoiceStatus = i % 11 === 5 ? "Cancelled" : i % 13 === 8 ? "Voided" : "Paid";
  const payment: PaymentStatus = status === "Cancelled" ? "Cancelled" : i % 9 === 4 ? "Failed" : "Successful";
  const mode = ch === "In-store" ? (i % 2 ? "Card (EDC)" : "UPI") : ch === "Own Website" ? "Payment gateway" : "Aggregator settlement";
  return { id: `INV-24${String(1000 + i)}`, channel: ch, location: outlets[i % outlets.length]!.name, amount, gst: Math.round(amount * 0.05), status, payment, mode, edc: mode === "Card (EDC)", at: `24 Sep, ${String(9 + (i % 12)).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")}`, items };
});

export const settlements = outlets.flatMap((o, i) => (["Swiggy", "Zomato"] as const).map((agg, k) => {
  const internal = 40 + Math.floor(rng(i * 19 + k * 5 + 3)() * 60);
  const diff = (i + k) % 4 === 1 ? -Math.ceil(rng(i + k + 9)() * 4) : 0;
  return { id: `${o.id}-${agg}`, outlet: o.name, aggregator: agg, internal, aggregatorCount: internal + diff, payout: (internal + diff) * 610 };
}));

// ---- Sales breakdown (previous day, end-of-day POS dump) ----
export function getSalesBreakdown(scale = 1) {
  const gross = Math.round(512000 * scale);
  const discounts = Math.round(gross * 0.062), commission = Math.round(gross * 0.118), cancellations = Math.round(gross * 0.014);
  const deductions = discounts + commission + cancellations;
  const net = gross - deductions;
  const taxable = Math.round(net / 1.05);
  const gst = net - taxable;
  return { gross, discounts, commission, cancellations, deductions, net, taxable, cgst: Math.round(gst / 2), sgst: gst - Math.round(gst / 2) };
}
export const salesChannelsWithStore = [{ id: "instore", name: "In-store" }, ...channels.map((c) => ({ id: c.id, name: c.name }))];

export function getHubSales(hubId: string | "all") {
  const hubs = hubId === "all" ? cloudKitchens : cloudKitchens.filter((h) => h.id === hubId);
  const byHub = hubs.map((h, i) => ({ id: h.id, name: h.name, revenue: Math.round(h.capacity * 590 * (0.85 + rng(i * 3 + h.capacity)() * 0.3)), orders: Math.round(h.capacity * 1.7) }));
  const seed = hubId === "all" ? 1 : cloudKitchens.findIndex((h) => h.id === hubId) + 2;
  const byProduct = products.map((p, i) => ({ name: p.name, units: Math.round((hubs.reduce((a, h) => a + h.capacity, 0) * p.weight) * (0.6 + rng(seed * 41 + i)() * 0.8)) })).sort((a, b) => b.units - a.units);
  return { byHub, top: byProduct.slice(0, 3), bottom: byProduct.slice(-3).reverse() };
}

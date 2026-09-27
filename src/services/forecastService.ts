/**
 * forecastService — the single seam between the UI and forecasting / insight logic.
 * Every function is deterministic (seeded). To go live, swap these implementations
 * for calls to the Python ML API; keep the return shapes and the UI won't change.
 */
import { channels, cloudKitchens, ingredients as baseIngredients, outlets, products, type ChannelId, type Ingredient } from "@/data/owner/catalog";

// ---------- seeded helpers ----------
function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const seeded = (seed: number) => mulberry32(seed);

/** Split a total across weights so the parts always sum to the total. */
function allocate(total: number, weights: number[]): number[] {
  const sum = weights.reduce((a, b) => a + b, 0);
  const raw = weights.map((w) => (total * w) / sum);
  const floors = raw.map(Math.floor);
  let rem = total - floors.reduce((a, b) => a + b, 0);
  raw.map((r, i) => ({ i, f: r - Math.floor(r) })).sort((a, b) => b.f - a.f).forEach(({ i }) => { if (rem-- > 0) floors[i]! += 1; });
  return floors;
}

const DAY = 86400000;
const TODAY = new Date(2026, 8, 24); // fixed demo "today" so every reload matches
export const demoToday = () => new Date(TODAY);
const dayLabel = (d: Date) => d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
const weekday = (d: Date) => d.toLocaleDateString("en-IN", { weekday: "short" });

// ---------- core forecast ----------
const BASE_UNITS = 446; // annualised daily baseline
const dayFactor = (offset: number) => [1.0, 1.12, 1.18, 1.06, 0.94, 0.97, 1.03, 1.09][((offset % 8) + 8) % 8]!; // weekday/weekend + rain pattern
const avgPrice = products.reduce((a, p) => a + p.price * p.weight, 0);

export type DayForecast = { offset: number; date: string; weekday: string; units: number; revenue: number; lower: number; upper: number; confidence: number };
export function getForecastForOffset(offset: number): DayForecast {
  const d = new Date(TODAY.getTime() + offset * DAY);
  const units = offset === 1 ? 499 : Math.round(BASE_UNITS * dayFactor(offset) * (1 + (seeded(offset + 11)() - 0.5) * 0.04));
  const confidence = Math.max(0.62, 0.9 - Math.max(0, offset - 1) * 0.035);
  const band = 1 - confidence + 0.05;
  return { offset, date: dayLabel(d), weekday: weekday(d), units, revenue: Math.round(units * avgPrice), lower: Math.round(units * (1 - band)), upper: Math.round(units * (1 + band)), confidence };
}

export function getTomorrowForecast() {
  const f = getForecastForOffset(1);
  const byChannel = allocate(f.units, channels.map((c) => c.share)).map((units, i) => ({ id: channels[i]!.id, name: channels[i]!.name, units, revenue: Math.round(units * avgPrice) }));
  return { ...f, baseline: BASE_UNITS, surgePct: ((f.units - BASE_UNITS) / BASE_UNITS) * 100, byChannel };
}

/** Units per product × outlet for a given day. */
export function getProductionPlan(offset = 1) {
  const total = getForecastForOffset(offset).units;
  const perProduct = allocate(total, products.map((p) => p.weight));
  return products.map((p, i) => {
    const perOutlet = allocate(perProduct[i]!, outlets.map((o) => o.weight * (0.85 + seeded(i * 31 + o.id.length)() * 0.3)));
    return { productId: p.id, name: p.name, units: perProduct[i]!, outlets: outlets.map((o, j) => ({ outletId: o.id, units: perOutlet[j]! })) };
  });
}

/** Day-by-day forecast with full production plan for the next N days (offsets 1..N). */
export function getMultiDayProduction(days: number) {
  const safeDays = Math.max(1, Math.min(days, 60));
  return Array.from({ length: safeDays }, (_, k) => {
    const forecast = getForecastForOffset(k + 1);
    return { ...forecast, plan: getProductionPlan(k + 1) };
  });
}

/** Day-by-day sales forecast with channel split for the next N days. */
export function getMultiDaySalesForecast(days: number) {
  const safeDays = Math.max(1, Math.min(days, 60));
  return Array.from({ length: safeDays }, (_, k) => {
    const f = getForecastForOffset(k + 1);
    const byChannel = allocate(f.units, channels.map((c) => c.share)).map((units, i) => ({ id: channels[i]!.id, name: channels[i]!.name, units, revenue: Math.round(units * avgPrice) }));
    return { ...f, byChannel };
  });
}

/** Hiring forecast derived from operations demand, kitchen utilization and store risk. UI prototype only. */
export function getHiringForecast() {
  const kitchens = getCloudKitchenPredictions(1);
  const stores = getStorePredictions(1);
  const week = getMultiDayProduction(7);
  const weeklyUnits = week.reduce((a, d) => a + d.units, 0);
  const avgUtilization = Math.round(kitchens.reduce((a, k) => a + k.utilization, 0) / kitchens.length);
  const highDemandStores = stores.filter((s) => s.change > 8).length;
  const roles = [
    { role: "Production bakers", location: "Bommanahalli & Yeshwanthpur hubs", count: 4, by: "Next 2 weeks", reason: `Kitchen utilization at ${avgUtilization}% and rising — weekend demand needs a second shift.`, urgency: "high" as const },
    { role: "Store counter staff", location: `${highDemandStores} high-growth stores`, count: 3, by: "Next 30 days", reason: "Stores with >8% demand growth need one extra counter hand for evening peak.", urgency: "high" as const },
    { role: "Dispatch riders", location: "South & East kitchen routes", count: 2, by: "Next 30 days", reason: "Morning dispatch windows are tightening as store orders grow.", urgency: "medium" as const },
    { role: "Pastry chefs (commis)", location: "Central kitchen", count: 2, by: "Next 60 days", reason: "Festival pre-orders (Ganesh Chaturthi) add ~900 orders; prep capacity is the bottleneck.", urgency: "medium" as const },
    { role: "Store supervisor", location: "Sarjapur (planned outlet)", count: 1, by: "Next 90 days", reason: "New outlet catchment shows strong corporate demand in the forecast mix.", urgency: "low" as const },
  ];
  return {
    roles,
    totalHires: roles.reduce((a, r) => a + r.count, 0),
    weeklyUnits,
    avgUtilization,
    note: "Indicative only — derived from demand forecast, kitchen utilization and store growth. Confirm with your HR system before acting.",
  };
}

export function getOutletForecast(offset = 1) {
  const plan = getProductionPlan(offset);
  return outlets.map((o) => {
    const units = plan.reduce((a, p) => a + p.outlets.find((x) => x.outletId === o.id)!.units, 0);
    return { outletId: o.id, name: o.name, units, revenue: Math.round(units * avgPrice) };
  });
}

export function getStorePredictions(offset = 1) {
  const forecasts = getOutletForecast(offset);
  const inventory = getInventoryHealth();
  return forecasts.map((forecast, index) => {
    const stock = inventory.byOutlet.find((item) => item.outletId === forecast.outletId);
    const change = Math.round((-4 + seeded(index + offset * 19)() * 19) * 10) / 10;
    return {
      ...forecast,
      change,
      confidence: Math.round((84 + seeded(index + 71)() * 10)),
      red: stock?.red ?? 0,
      amber: stock?.amber ?? 0,
      green: stock?.green ?? 0,
      risk: stock?.rag ?? "green",
    };
  }).sort((a, b) => b.units - a.units);
}

export function getCloudKitchenPredictions(offset = 1) {
  const total = getForecastForOffset(offset).units;
  const cap = cloudKitchens.reduce((a, k) => a + k.capacity, 0);
  const planned = allocate(total, cloudKitchens.map((k) => k.capacity / cap));
  return cloudKitchens.map((kitchen, index) => {
    const units = planned[index] ?? 0;
    const utilization = Math.round((units / kitchen.capacity) * 100);
    return {
      ...kitchen,
      units,
      utilization,
      confidence: 85 + Math.round(seeded(index + 301)() * 9),
      ingredientRisk: Math.floor(seeded(index + 331)() * 3),
      dispatch: ["4:45 AM", "5:00 AM", "5:15 AM", "5:30 AM"][index % 4] ?? "5:30 AM",
      change: Math.round((3 + seeded(index + 361)() * 12) * 10) / 10,
    };
  });
}

export function getCloudKitchenIngredientInventory(kitchenId: string) {
  const kitchenIndex = Math.max(0, cloudKitchens.findIndex((kitchen) => kitchen.id === kitchenId));
  return baseIngredients.map((ingredient, index) => {
    const required = Math.max(2, Math.round((14 + index * 1.7) * (1 - (kitchenIndex % 4) * 0.18)));
    const onHand = Math.max(0, Math.round(required * (0.35 + seeded(kitchenIndex * 47 + index * 9)() * 1.05)));
    const cover = onHand / required;
    const rag: Rag = cover < 0.55 ? "red" : cover < 0.9 ? "amber" : "green";
    return { ingredientId: ingredient.id, ingredient: ingredient.name, unit: ingredient.unit, onHand, required, refill: Math.max(0, required - onHand), rag };
  });
}

export function getSevenDayByOutlet() {
  return Array.from({ length: 7 }, (_, k) => {
    const row: { day: string; [k: string]: string | number } = { day: getForecastForOffset(k + 1).weekday };
    getOutletForecast(k + 1).forEach((o) => (row[o.name] = o.units));
    return row;
  });
}

/** Past 7 days actual + next 7 forecast (with band) for the line chart. */
export function getForecastVsActual(historyDays = 7) {
  const safeDays = Math.max(1, Math.min(historyDays, 90));
  return Array.from({ length: safeDays + 7 }, (_, k) => {
    const offset = k - safeDays + 1;
    const f = getForecastForOffset(offset);
    const actual = offset <= 0 ? Math.round(f.units * (0.93 + seeded(k + 99)() * 0.12)) : null;
    return { date: f.date, forecast: f.units, actual, band: [f.lower, f.upper] as [number, number] };
  });
}

export function getForecastDrivers() {
  return [
    { label: "Recent pattern", detail: "Last 1 / 7 / 14 / 28-day averages: 472 / 455 / 449 / 441 units — demand is trending up.", effect: "+4%" },
    { label: "Weather", detail: "Rain expected 5–9 PM: fewer walk-ins, more delivery orders.", effect: "+6% delivery" },
    { label: "Festival", detail: "Ganesh Chaturthi in 5 days — pre-orders starting.", effect: "+3%" },
    { label: "Weekend", detail: "Tomorrow is Friday — birthday and office orders peak.", effect: "+5%" },
    { label: "Outlet location", detail: "Airport and Flagship lead mornings; Koramangala and HSR lead late evenings.", effect: "mix" },
    { label: "Year-on-year", detail: "Same week last year was 446 units.", effect: "+12%" },
  ];
}

// ---------- sales ----------
export function getRevenueTrend(days = 30) {
  return Array.from({ length: days }, (_, k) => {
    const offset = k - days + 1;
    const d = new Date(TODAY.getTime() + offset * DAY);
    const r = seeded(k + 7);
    const base = 480000 * dayFactor(offset);
    const row: { date: string; [k: string]: number | string } = { date: dayLabel(d) };
    channels.forEach((c) => (row[c.id] = Math.round(base * c.share * (0.88 + r() * 0.24))));
    return row;
  });
}

export function getTodaySales() {
  const today = getRevenueTrend(2);
  const sum = (row: Record<string, number | string>) => channels.reduce((a, c) => a + (row[c.id] as number), 0);
  const t = sum(today[1]!), y = sum(today[0]!);
  return { revenue: t, deltaPct: ((t - y) / y) * 100, spark: getRevenueTrend(10).map((r) => ({ v: sum(r) })) };
}

export function getChannelMix(days = 30) {
  const trend = getRevenueTrend(days);
  return channels.map((c) => {
    const revenue = trend.reduce((a, r) => a + (r[c.id] as number), 0);
    const grossMargin = 58; // product-level
    return { id: c.id, name: c.name, revenue, color: c.color, takeRate: c.takeRate, netMargin: grossMargin - c.takeRate - (c.id === "corporate" ? 4 : 6) };
  });
}

export function getOutletSales(days = 30) {
  const total = getChannelMix(days).reduce((a, c) => a + c.revenue, 0);
  const perf = [1.08, 1.12, 0.97, 0.92, 1.04, 0.81, 1.15];
  return outlets.map((o, i) => {
    const revenue = Math.round(total * o.weight * perf[i]! / 1.03);
    const vsTarget = (perf[i]! - 1) * 100;
    return { outletId: o.id, name: o.name, revenue, vsTarget, status: vsTarget >= 3 ? "good" : vsTarget <= -5 ? "bad" : "ok" } as const;
  }).sort((a, b) => b.revenue - a.revenue);
}

export function getProductMatrix(days = 30) {
  const volumes = allocate(Math.round(3200 * Math.max(1, days) / 30), products.map((p) => p.weight));
  return products.map((p, i) => {
    const margin = ((p.price - p.unitCost) / p.price) * 100;
    const volume = volumes[i]!;
    const quadrant = volume >= 320 ? (margin >= 58 ? "Star" : "Plow Horse") : margin >= 58 ? "Puzzle" : "Dog";
    return { id: p.id, name: p.name, margin: Math.round(margin * 10) / 10, volume, quadrant };
  });
}

export function getSalesInsights() {
  return [
    { title: "Bundle instead of discounting", body: "Bundle 2 products (e.g. Tiramisu + Brownie) instead of discounting each — lifts AOV from ₹612 to ~₹690.", metric: "+₹78 AOV" },
    { title: "Corporate orders carry the best margin", body: "Corporate AOV is ₹4,850 with zero commission. Two more office accounts ≈ ₹6 L/month.", metric: "48% net" },
    { title: "Rain-day margin loss", body: "On rain days aggregator share jumps to 68% of orders; at a 27% take rate that costs about ₹38K net margin per day.", metric: "−₹38K/day" },
  ];
}

// ---------- marketing ----------
export function getSpendVsLeads(channel: ChannelId | "all" = "all", days = 84) {
  const weeks = Math.max(1, Math.ceil(days / 7));
  return Array.from({ length: weeks }, (_, k) => {
    const r = seeded(k * 3 + (channel === "all" ? 1 : channel.length));
    const scale = channel === "all" ? 1 : channels.find((c) => c.id === channel)!.share;
    const spend = Math.round((280000 + k * 9000) * scale * (0.9 + r() * 0.2));
    return { week: `W${k + 1}`, spend, leads: Math.round(spend / (58 + r() * 14)) };
  });
}

export function getPromoTrend(days = 21) {
  return Array.from({ length: Math.max(1, days) }, (_, k) => {
    const r = seeded(k + 400);
    const discount = Math.round((5 + r() * 7) * 10) / 10;
    const high = discount > 8.5;
    const orders = Math.round(1180 * (high ? 1.04 : 1) * (0.95 + r() * 0.1));
    const revenue = Math.round(orders * 612 * (1 - discount / 100));
    const netMargin = Math.round((24 - (high ? 3.2 : 0) - discount * 0.35) * 10) / 10;
    return { day: `D${k + 1}`, discount, orders, revenue, netMargin };
  });
}

export function getMarketingInsights() {
  return [
    { title: "Swiggy leads are compounding", body: "Swiggy leads grew ~10% MoM for 3 months. Adding ₹1 Cr spend next month gives a high chance of ~10% more leads.", confidence: "High" },
    { title: "Instagram drives website orders", body: "62% of website first-time orders came from Instagram in the last 30 days. CPL is ₹37 vs ₹67 on Swiggy.", confidence: "Medium" },
    { title: "Corporate is under-invested", body: "Corporate returns ₹9.8 per ₹1 spent — the highest. A ₹50K LinkedIn test is low-risk.", confidence: "Medium" },
  ];
}

export function getRecommendedActions() {
  return [
    { title: "Rain expected today: reduce discounts", impact: "+₹58K net margin", tag: "Today" },
    { title: "Shift ₹2 L from Zomato to website free-delivery", impact: "+1.4% blended margin", tag: "This week" },
    { title: "Open Ganesh Chaturthi pre-orders now", impact: "~900 extra orders", tag: "This week" },
  ];
}

// ---------- inventory ----------
export type Rag = "red" | "amber" | "green";
export function getInventoryHealth() {
  const plan = getProductionPlan(1);
  const rows = outlets.flatMap((o, oi) => products.map((p, pi) => {
    const need = plan[pi]!.outlets[oi]!.units;
    const onHand = Math.max(0, Math.round(need * (0.2 + seeded(oi * 17 + pi * 5 + 3)() * 1.1)));
    const cover = need === 0 ? 2 : onHand / need;
    const rag: Rag = cover < 0.4 ? "red" : cover < 0.8 ? "amber" : "green";
    return { outletId: o.id, outlet: o.name, productId: p.id, product: p.name, onHand, need, rag, refill: Math.max(0, need - onHand), capital: Math.max(0, need - onHand) * p.unitCost };
  }));
  const byOutlet = outlets.map((o) => {
    const r = rows.filter((x) => x.outletId === o.id);
    const reds = r.filter((x) => x.rag === "red").length;
    return { outletId: o.id, name: o.name, red: reds, amber: r.filter((x) => x.rag === "amber").length, green: r.filter((x) => x.rag === "green").length, rag: (reds >= 3 ? "red" : reds >= 1 ? "amber" : "green") as Rag };
  });
  return {
    rows, byOutlet,
    outletsAtRisk: byOutlet.filter((o) => o.rag === "red").length,
    urgentProducts: rows.filter((r) => r.rag === "red").length,
    capitalNeeded: rows.reduce((a, r) => a + r.capital, 0),
  };
}

export function getStockoutRanking() {
  return getInventoryHealth().byOutlet.slice().sort((a, b) => b.red - a.red || b.amber - a.amber);
}

// ---------- BOM & procurement ----------
export function getBOM(productId: string, units: number, prices: Record<string, number>, ingredientList: Ingredient[] = baseIngredients) {
  const p = products.find((x) => x.id === productId)!;
  const lines = p.recipe.map((r) => {
    const ing = ingredientList.find((i) => i.id === r.ingredientId)!;
    const price = prices[ing.id] ?? ing.price;
    const totalQty = (r.grams * units) / 1000;
    return { ingredientId: ing.id, name: ing.name, unit: ing.unit, perUnit: r.grams, totalQty, price, cost: totalQty * price };
  });
  return { product: p, units, lines, total: lines.reduce((a, l) => a + l.cost, 0) };
}

export function getProcurementBudget(prices: Record<string, number>, offset = 1) {
  const plan = getProductionPlan(offset);
  const perProduct = plan.map((pl) => ({ ...pl, cost: getBOM(pl.productId, pl.units, prices).total }));
  return { total: perProduct.reduce((a, p) => a + p.cost, 0), perProduct };
}

export const DEFAULT_PRICES: Record<string, number> = Object.fromEntries(baseIngredients.map((i) => [i.id, i.price]));

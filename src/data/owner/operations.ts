// Mock operational data: spoilage, SLA, marketing, HR, accounts, proposals.
import type { ChannelId } from "./catalog";

export type Priority = "P1" | "P2" | "P3";
export type PriorityAction = {
  id: string; priority: Priority; outletId: string; title: string; reason: string; impact: number;
  actionLabel: string; doneLabel: string; auditAction: string;
};
export const priorityActions: PriorityAction[] = [
  { id: "pa1", priority: "P1", outletId: "ind", title: "Stock-out risk: Belgian Dark Chocolate Cake", reason: "Only 3 units on hand vs 17 forecast for tomorrow. Evening surge expected (rain + Friday).", impact: 13300, actionLabel: "Authorize Dispatch", doneLabel: "Dispatch authorized", auditAction: "Dispatch authorized to Indiranagar" },
  { id: "pa2", priority: "P1", outletId: "air", title: "Stock-out risk: Macaron Box (6)", reason: "Airport demand peaks 6–10 AM; 2 boxes left vs 14 forecast.", impact: 6480, actionLabel: "Authorize Dispatch", doneLabel: "Dispatch authorized", auditAction: "Dispatch authorized to Airport (KIA T2)" },
  { id: "pa3", priority: "P2", outletId: "kor", title: "Cancellations rising on Zomato", reason: "11 orders cancelled in 24h (rider delays). Penalty risk on SLA scorecard.", impact: 4200, actionLabel: "Escalate to Store", doneLabel: "Escalated", auditAction: "SLA escalation sent to Koramangala" },
  { id: "pa4", priority: "P2", outletId: "wtf", title: "Returned orders: damaged packaging", reason: "6 returns this week due to crushed cake boxes on Swiggy.", impact: 3100, actionLabel: "Notify Store", doneLabel: "Store notified", auditAction: "Packaging check requested at Whitefield" },
  { id: "pa5", priority: "P3", outletId: "ecy", title: "Shelf life > 36 hrs: Vanilla Cake × 8", reason: "Baked 38 hrs ago. Clear by end of day via bundle or transfer.", impact: 5200, actionLabel: "Execute Transfer", doneLabel: "Transfer executed", auditAction: "Transfer of 8 Vanilla Cakes from Electronic City to HSR Layout" },
  { id: "pa6", priority: "P3", outletId: "hsr", title: "Shelf life > 36 hrs: Tiramisu Jar × 12", reason: "Nearing 36-hr limit. Push as evening combo on own website.", impact: 1900, actionLabel: "Launch EOD Combo", doneLabel: "Combo launched", auditAction: "EOD Tiramisu combo launched at HSR Layout" },
];

export type TransferSuggestion = { id: string; productId: string; units: number; from: string; to: string; lossSaved: number };
export const transferSuggestions: TransferSuggestion[] = [
  { id: "tr1", productId: "vanilla", units: 5, from: "ecy", to: "ind", lossSaved: 3250 },
  { id: "tr2", productId: "tiramisu", units: 10, from: "hsr", to: "kor", lossSaved: 3200 },
  { id: "tr3", productId: "redvelvet", units: 4, from: "wtf", to: "sdn", lossSaved: 3400 },
  { id: "tr4", productId: "brownie", units: 6, from: "sdn", to: "air", lossSaved: 2700 },
];

// Spoiled finished goods over the selected period (total ≈ 315 units)
export const spoiledProducts = [
  { productId: "pineapple", units: 72, reason: "Over-production on weekday" },
  { productId: "mango", units: 58, reason: "Short shelf life (30 hrs)" },
  { productId: "vanilla", units: 46, reason: "Low walk-ins, rain" },
  { productId: "tiramisu", units: 44, reason: "Past 36-hr limit" },
  { productId: "cheesecake", units: 31, reason: "Chiller failure at HSR (2 hrs)" },
  { productId: "redvelvet", units: 27, reason: "Order cancellations" },
  { productId: "belgian", units: 19, reason: "Transport damage" },
  { productId: "brownie", units: 10, reason: "Packaging defect" },
  { productId: "macaron", units: 8, reason: "Humidity damage" },
];

export const spoiledIngredients = [
  { ingredientId: "cream", ordered: 100, used: 90, spoiled: 10 },
  { ingredientId: "mango", ordered: 60, used: 51, spoiled: 9 },
  { ingredientId: "blueberry", ordered: 25, used: 22, spoiled: 3 },
  { ingredientId: "cheese", ordered: 45, used: 43, spoiled: 2 },
  { ingredientId: "pineapple", ordered: 30, used: 26, spoiled: 4 },
];

// Delayed orders by channel (total ≈ 410)
export const delayedOrders: { channel: ChannelId; m10: number; m15: number; m20: number; reason: string }[] = [
  { channel: "swiggy", m10: 78, m15: 46, m20: 28, reason: "Rider shortage due to rain spike" },
  { channel: "zomato", m10: 64, m15: 38, m20: 21, reason: "Rider shortage due to rain spike" },
  { channel: "website", m10: 31, m15: 14, m20: 6, reason: "Packing backlog at Koramangala" },
  { channel: "corporate", m10: 22, m15: 12, m20: 9, reason: "Bulk order staging delays" },
  { channel: "other", m10: 20, m15: 12, m20: 9, reason: "Partner app downtime" },
];

// Marketing
export const marketingChannels: { id: ChannelId; spend: number; leads: number; sales: number; roas: number; indicative?: boolean }[] = [
  { id: "swiggy", spend: 1240000, leads: 18400, sales: 5210000, roas: 4.2, indicative: true },
  { id: "zomato", spend: 980000, leads: 14100, sales: 4120000, roas: 4.2, indicative: true },
  { id: "website", spend: 420000, leads: 6200, sales: 2480000, roas: 5.9 },
  { id: "corporate", spend: 180000, leads: 310, sales: 1760000, roas: 9.8 },
  { id: "social", spend: 360000, leads: 9800, sales: 1150000, roas: 3.2 },
  { id: "other", spend: 150000, leads: 2100, sales: 620000, roas: 4.1, indicative: true },
];

export const campaigns = [
  { name: "Monsoon Chocolate Fest", channel: "swiggy", spend: 320000, orders: 2140, roas: 4.8, status: "Live" },
  { name: "Office Birthday Packs", channel: "corporate", spend: 90000, orders: 410, roas: 10.4, status: "Live" },
  { name: "Weekend Cheesecake Drop", channel: "social", spend: 110000, orders: 760, roas: 3.6, status: "Live" },
  { name: "Zomato Gold Desserts", channel: "zomato", spend: 260000, orders: 1830, roas: 4.1, status: "Paused" },
  { name: "Website Free Delivery > ₹999", channel: "website", spend: 140000, orders: 980, roas: 6.2, status: "Live" },
  { name: "Ganesh Chaturthi Pre-orders", channel: "social", spend: 75000, orders: 520, roas: 5.1, status: "Scheduled" },
];

export const socialPerformance = [
  { platform: "Instagram", followers: 128400, reach: 412000, engagement: 5.8, orders: 640 },
  { platform: "Facebook", followers: 46200, reach: 98000, engagement: 2.1, orders: 110 },
  { platform: "YouTube Shorts", followers: 18900, reach: 156000, engagement: 4.4, orders: 70 },
  { platform: "WhatsApp Broadcast", followers: 22100, reach: 21000, engagement: 11.2, orders: 290 },
];

export type Proposal = { id: string; title: string; channel: string; cost: number; expected: string; proposedBy: string; submitted: string };
export const marketingProposals: Proposal[] = [
  { id: "mp1", title: "Cut Swiggy discount from 12% to 8% during rain today", channel: "Swiggy", cost: -42000, expected: "+₹58K net margin, −3% orders", proposedBy: "Marketing Manager", submitted: "Today, 9:40 AM" },
  { id: "mp2", title: "Add ₹1 Cr Swiggy ads budget for next month", channel: "Swiggy", cost: 10000000, expected: "~10% more leads (high confidence)", proposedBy: "Marketing Manager", submitted: "Today, 8:15 AM" },
  { id: "mp3", title: "Launch ‘Buy 2 pastries, save ₹60’ bundle on website", channel: "Own Website", cost: 35000, expected: "+₹74 AOV", proposedBy: "Marketing Manager", submitted: "Yesterday" },
  { id: "mp4", title: "Instagram influencer collab – Ganesh Chaturthi modak cake", channel: "Social Media", cost: 180000, expected: "~900 pre-orders", proposedBy: "Marketing Manager", submitted: "Yesterday" },
];

export const playbooks = [
  { title: "Rain-day playbook", desc: "Reduce aggregator discounts, push website free delivery, pre-stage riders." },
  { title: "Festival pre-order playbook", desc: "Open pre-orders 10 days ahead, lock production by D-2, corporate outreach." },
  { title: "Slow-moving stock playbook", desc: "Bundle at 36 hrs, transfer between stores, staff sampling at 42 hrs." },
  { title: "Corporate gifting playbook", desc: "Quarterly HR outreach, tiered hampers, invoice on delivery." },
];

// HR (synced, view only)
export const hrHeadcount = [
  { outlet: "Sadashivnagar Flagship", staff: 18 }, { outlet: "Indiranagar", staff: 14 }, { outlet: "Koramangala", staff: 13 },
  { outlet: "HSR Layout", staff: 10 }, { outlet: "Whitefield", staff: 10 }, { outlet: "Electronic City", staff: 8 },
  { outlet: "Airport (KIA T2)", staff: 9 }, { outlet: "Central Cloud Kitchen", staff: 34 },
];
export const hrOnboarding = { joined: 9, inProgress: 5, completed: 4, pendingDocs: 2 };
export const hrAttendance = [
  { day: "Mon", present: 94 }, { day: "Tue", present: 96 }, { day: "Wed", present: 93 }, { day: "Thu", present: 95 },
  { day: "Fri", present: 91 }, { day: "Sat", present: 89 }, { day: "Sun", present: 88 },
];

// Accounts (synced, view only)
export const accountsMonthly = [
  { month: "Apr", revenue: 14200000, expenses: 11600000 }, { month: "May", revenue: 15100000, expenses: 12100000 },
  { month: "Jun", revenue: 14800000, expenses: 12300000 }, { month: "Jul", revenue: 16300000, expenses: 12900000 },
  { month: "Aug", revenue: 17100000, expenses: 13400000 }, { month: "Sep", revenue: 15300000, expenses: 12200000 },
];
export const expenseSplit = [
  { name: "Ingredients", value: 42 }, { name: "Staff", value: 24 }, { name: "Aggregator fees", value: 14 },
  { name: "Rent & utilities", value: 11 }, { name: "Marketing", value: 9 },
];
export const receivables = [
  { bucket: "0–30 days", amount: 1840000 }, { bucket: "31–60 days", amount: 620000 }, { bucket: "61–90 days", amount: 210000 }, { bucket: "90+ days", amount: 95000 },
];

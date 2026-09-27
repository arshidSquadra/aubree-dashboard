import { type Context, createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { subDays } from "date-fns";
import type { DateRange } from "react-day-picker";
import type { RoleId } from "@/config/roles";
import { DEFAULT_PRICES, demoToday } from "@/services/forecastService";
import { roleProfiles, type ViewLevel } from "@/config/roles";
import { activitySeed, defaultEscalation, defaultThresholds, stockRows, type Activity, type EscalationStep, type Threshold } from "@/data/owner/stockControl";

export type Indent = { id: string; locationId: string; productId: string; qty: number; at: Date; status: "Pending approval" | "Approved" | "Rejected" };

export type AuditEntry = { id: string; at: Date; role: string; type: "Operations" | "Transfer" | "Marketing" | "Procurement" | "Indent" | "Escalation"; action: string; store: string; status: "Completed" | "Approved" | "Rejected" | "Notified" };
type Decision = "approved" | "rejected";

type Ctx = {
  role: RoleId; setRole: (r: RoleId) => void;
  range: DateRange; setRange: (r: DateRange) => void;
  audit: AuditEntry[]; log: (e: Omit<AuditEntry, "id" | "at" | "role">) => void;
  done: Record<string, boolean>; markDone: (id: string) => void;
  decisions: Record<string, Decision>; decide: (id: string, d: Decision) => void;
  prices: Record<string, number>; setPrice: (id: string, v: number) => void; resetPrices: () => void;
  askOpen: boolean; setAskOpen: (v: boolean) => void;
  thresholds: Record<string, Threshold>; setThreshold: (productId: string, t: Threshold) => void;
  stock: Record<string, number>;
  indents: Indent[]; raiseIndent: (locationId: string, productId: string, qty: number, locationName: string, productName: string) => void; decideIndent: (id: string, s: "Approved" | "Rejected") => void;
  activity: Activity[];
  escalation: EscalationStep[]; setEscalation: (e: EscalationStep[]) => void;
  viewLevel: ViewLevel; setViewLevel: (v: ViewLevel) => void;
};

// Pinned to globalThis so hot reloads keep one context identity.
const g = globalThis as unknown as { __ownerCtx?: Context<Ctx | null> };
const OwnerContext = g.__ownerCtx ?? (g.__ownerCtx = createContext<Ctx | null>(null));

const seedAudit = (): AuditEntry[] => {
  const t = demoToday();
  const at = (h: number, m: number, d = 0) => { const x = new Date(t); x.setDate(x.getDate() - d); x.setHours(h, m); return x; };
  return [
    { id: "s1", at: at(8, 5), role: "Owner", type: "Operations", action: "Dispatch authorized to Sadashivnagar Flagship", store: "Sadashivnagar Flagship", status: "Completed" },
    { id: "s2", at: at(19, 40, 1), role: "Owner", type: "Transfer", action: "Transfer of 6 Brownie Boxes from Whitefield to Airport (KIA T2)", store: "Whitefield", status: "Notified" },
    { id: "s3", at: at(16, 10, 1), role: "Owner", type: "Marketing", action: "Approved: Website free delivery above ₹999", store: "All outlets", status: "Approved" },
    { id: "s4", at: at(11, 25, 2), role: "Owner", type: "Marketing", action: "Rejected: Flat 20% off on Zomato weekend", store: "All outlets", status: "Rejected" },
    { id: "s5", at: at(7, 50, 3), role: "Owner", type: "Procurement", action: "Fresh cream price updated to ₹380/kg", store: "Central Cloud Kitchen", status: "Completed" },
  ];
};

export function OwnerProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<RoleId>("owner");
  const [range, setRange] = useState<DateRange>({ from: subDays(demoToday(), 6), to: demoToday() });
  const [audit, setAudit] = useState<AuditEntry[]>(seedAudit);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});
  const [prices, setPrices] = useState<Record<string, number>>(DEFAULT_PRICES);
  const [askOpen, setAskOpen] = useState(false);
  const [thresholds, setThresholds] = useState(defaultThresholds);
  const [stock, setStock] = useState<Record<string, number>>(() => Object.fromEntries(stockRows.map((r) => [r.id, r.onHand])));
  const [indents, setIndents] = useState<Indent[]>(() => [
    { id: "ind-s1", locationId: "kor", productId: "cheesecake", qty: 8, at: demoToday(), status: "Pending approval" },
    { id: "ind-s2", locationId: "ck-hbr", productId: "tiramisu", qty: 14, at: demoToday(), status: "Pending approval" },
    { id: "ind-s3", locationId: "wtf", productId: "brownie", qty: 10, at: demoToday(), status: "Pending approval" },
  ]);
  const [activity, setActivity] = useState<Activity[]>(activitySeed);
  const [escalation, setEscalation] = useState(defaultEscalation);
  const [viewLevel, setViewLevel] = useState<ViewLevel>(roleProfiles.owner.viewLevel);

  const log = useCallback((e: Omit<AuditEntry, "id" | "at" | "role">) => {
    setAudit((a) => [{ ...e, id: `a${Date.now()}${a.length}`, at: new Date(), role: "Owner" }, ...a]);
  }, []);

  const value = useMemo<Ctx>(() => ({
    role, setRole, range, setRange, audit, log,
    done, markDone: (id) => setDone((d) => ({ ...d, [id]: true })),
    decisions, decide: (id, d) => setDecisions((x) => ({ ...x, [id]: d })),
    prices, setPrice: (id, v) => setPrices((p) => ({ ...p, [id]: v })), resetPrices: () => setPrices(DEFAULT_PRICES),
    askOpen, setAskOpen,
    thresholds, setThreshold: (id, t) => setThresholds((x) => ({ ...x, [id]: t })),
    stock,
    indents,
    raiseIndent: (locationId, productId, qty, locationName, productName) => {
      setIndents((x) => [{ id: `ind${Date.now()}`, locationId, productId, qty, at: new Date(), status: "Pending approval" }, ...x]);
      setActivity((x) => [{ id: `act${Date.now()}`, type: "Indent", locationId, productId, qty, at: "Just now", note: "Raised from low-stock alert" }, ...x]);
      log({ type: "Indent", action: `Indent raised: ${qty} × ${productName} for ${locationName}`, store: locationName, status: "Notified" });
    },
    decideIndent: (id, st) => {
      const ind = indents.find((i) => i.id === id);
      setIndents((x) => x.map((i) => (i.id === id ? { ...i, status: st } : i)));
      if (ind && st === "Approved") setStock((x) => ({ ...x, [`${ind.locationId}-${ind.productId}`]: (x[`${ind.locationId}-${ind.productId}`] ?? 0) + ind.qty }));
    },
    activity,
    escalation, setEscalation,
    viewLevel, setViewLevel,
  }), [role, range, audit, log, done, decisions, prices, askOpen, thresholds, stock, indents, activity, escalation, viewLevel]);

  return <OwnerContext.Provider value={value}>{children}</OwnerContext.Provider>;
}

export function useOwner() {
  const c = useContext(OwnerContext);
  if (!c) throw new Error("useOwner must be used within OwnerProvider");
  return c;
}

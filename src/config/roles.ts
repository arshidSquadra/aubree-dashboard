import { BarChart3, BookUser, ClipboardList, FileBarChart, Home, Megaphone, Truck, Wallet, type LucideIcon } from "lucide-react";

export type RoleId = "owner" | "marketing" | "kitchen" | "store";
export const roles: { id: RoleId; label: string; ready: boolean }[] = [
  { id: "owner", label: "Owner", ready: true },
  { id: "marketing", label: "Marketing Manager", ready: false },
  { id: "kitchen", label: "Cloud Kitchen Manager", ready: false },
  { id: "store", label: "Store Manager", ready: false },
];

export type SectionId = "overview" | "sales" | "marketing" | "operations" | "reports" | "hr" | "accounts" | "audit";
export const sections: { id: SectionId; path: string; label: string; icon: LucideIcon }[] = [
  { id: "overview", path: "/", label: "Overview", icon: Home },
  { id: "operations", path: "/operations", label: "Operations", icon: Truck },
  { id: "sales", path: "/sales", label: "Sales", icon: BarChart3 },
  { id: "marketing", path: "/marketing", label: "Marketing", icon: Megaphone },
  { id: "reports", path: "/reports", label: "Reports", icon: FileBarChart },
  { id: "hr", path: "/hr", label: "HR", icon: BookUser },
  { id: "accounts", path: "/accounts", label: "Accounts", icon: Wallet },
  { id: "audit", path: "/audit-log", label: "Audit Log", icon: ClipboardList },
];

/** Which sidebar sections each role may see. Edit here to show/hide per role. */
export const permissions: Record<RoleId, SectionId[]> = {
  owner: ["overview", "sales", "marketing", "operations", "reports", "hr", "accounts", "audit"],
  marketing: ["overview", "marketing", "reports"],
  kitchen: ["overview", "operations", "reports"],
  store: ["overview", "operations"],
};

/** Per-profile view level. "leadership" = exceptions-first, no dense tables by default; "analyst" = full tables + Analytics. */
export type ViewLevel = "leadership" | "analyst";
export const roleProfiles: Record<RoleId, { viewLevel: ViewLevel }> = {
  owner: { viewLevel: "leadership" },
  marketing: { viewLevel: "analyst" },
  kitchen: { viewLevel: "analyst" },
  store: { viewLevel: "analyst" },
};

import { PanelLeftClose } from "lucide-react";
import { Link, useLocation } from "@/lib/router-compat";
import { cn } from "@/lib/utils";
import { permissions, sections, type SectionId } from "@/config/roles";

const groups: { label: string; ids: SectionId[] }[] = [
  { label: "Workspace", ids: ["overview", "operations", "sales", "marketing"] },
  { label: "Insights", ids: ["reports", "audit"] },
  { label: "Admin", ids: ["hr", "accounts"] },
];
import { useOwner } from "@/contexts/OwnerContext";
import { BRAND } from "@/data/owner/brand";

export function OwnerSidebar({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: (() => void) | undefined }) {
  const { pathname } = useLocation();
  const { role } = useOwner();
  const allowed = permissions[role];
  const visible = sections.filter((s) => allowed.includes(s.id));

  return (
    <aside className={cn("h-screen w-[248px] flex-col border-r border-sidebar-border bg-sidebar", mobile ? "relative flex w-full" : "fixed left-0 top-0 z-40 hidden lg:flex")}>
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-5">
        <span className="grid h-9 w-9 place-items-center rounded-md bg-primary text-xs font-semibold text-primary-foreground">{BRAND.initials}</span>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-sidebar-foreground">{BRAND.name}</div>
          <div className="truncate text-[11px] text-sidebar-muted">{BRAND.tagline}</div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin">
        {groups.map((g) => {
          const items = visible.filter((s) => g.ids.includes(s.id));
          if (!items.length) return null;
          return (
            <div key={g.label} className="mb-5">
              <div className="mb-1.5 px-3 text-[10px] font-medium uppercase tracking-[0.08em] text-sidebar-muted">{g.label}</div>
              <ul className="space-y-0.5">
                {items.map((s) => {
                  const active = s.path === "/" ? pathname === "/" : pathname === s.path || pathname.startsWith(s.path + "/");
                  return (
                    <li key={s.id}>
                      <Link to={s.path} onClick={onNavigate} aria-current={active ? "page" : undefined} className={cn("relative flex items-center gap-3 rounded-md px-3 py-2 text-[13px] transition-colors", active ? "bg-sidebar-accent font-medium text-primary before:absolute before:inset-y-1.5 before:left-0 before:w-[3px] before:rounded-r before:bg-primary" : "text-sidebar-foreground hover:bg-muted")}>
                        <s.icon className={cn("h-4 w-4 shrink-0", active ? "text-primary" : "text-muted-foreground")} />{s.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>
      <div className="border-t border-sidebar-border p-4">
        <div className="px-1">
          <div className="text-[11px] font-medium text-sidebar-foreground">7 outlets · 12 cloud kitchens</div>
          <div className="mt-0.5 text-[11px] text-sidebar-muted">All systems synced 2 mins ago</div>
        </div>
        {!mobile && <div className="mt-3 flex items-center gap-2 px-1 text-[11px] text-sidebar-muted"><PanelLeftClose className="h-3.5 w-3.5" />Demo data · Bengaluru</div>}
      </div>
    </aside>
  );
}

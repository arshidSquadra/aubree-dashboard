import { isValidElement, useState, type ReactNode } from "react";
import { differenceInCalendarDays, format, subDays } from "date-fns";
import type { DateRange } from "react-day-picker";
import { ArrowDownRight, ArrowUpRight, CalendarDays, Check, ChevronDown, ChevronRight, Info, Search, type LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { demoToday } from "@/services/forecastService";

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string | undefined; actions?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between animate-fade-in">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold text-foreground md:text-[28px] md:leading-9">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({ title, subtitle, action, children, className }: { title?: string; subtitle?: string | undefined; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("card-base min-w-0 p-4 sm:p-5", className)}>
      {(title || action) && (
        <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            {title && <h2 className="text-base font-semibold text-foreground">{title}</h2>}
            {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export type ChartRange = { days: number; label: string; from: Date; to: Date };

export function ChartDateFilter({ defaultDays = 30, onChange }: { defaultDays?: 7 | 30; onChange?: (range: ChartRange) => void }) {
  const today = demoToday();
  const initialFrom = subDays(today, defaultDays - 1);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"7" | "30" | "custom">(String(defaultDays) as "7" | "30");
  const [range, setRange] = useState<DateRange>({ from: initialFrom, to: today });

  const applyPreset = (days: 7 | 30) => {
    const next = { days, label: days === 7 ? "Last 7 days" : "Last month", from: subDays(today, days - 1), to: today };
    setMode(String(days) as "7" | "30");
    setRange({ from: next.from, to: next.to });
    onChange?.(next);
    setOpen(false);
  };

  const applyCustom = (next: DateRange | undefined) => {
    if (!next) return;
    setMode("custom");
    setRange(next);
    if (next.from && next.to) {
      const days = Math.max(1, differenceInCalendarDays(next.to, next.from) + 1);
      onChange?.({ days, label: `${format(next.from, "d MMM")} – ${format(next.to, "d MMM")}`, from: next.from, to: next.to });
      setOpen(false);
    }
  };

  const label = mode === "7" ? "Last 7 days" : mode === "30" ? "Last month" : range.from ? `${format(range.from, "d MMM")}${range.to ? ` – ${format(range.to, "d MMM")}` : ""}` : "Custom";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 shrink-0 gap-1.5 px-2.5 text-[11px] font-medium" aria-label={`Chart date range: ${label}`}>
          <CalendarDays className="h-3.5 w-3.5" /><span>{label}</span><ChevronDown className="h-3 w-3 opacity-55" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto max-w-[calc(100vw-2rem)] p-2" align="end">
        <div className="grid grid-cols-2 gap-1">
          {([{ value: 7, label: "Last 7 days" }, { value: 30, label: "Last month" }] as const).map((option) => (
            <Button key={option.value} variant={mode === String(option.value) ? "secondary" : "ghost"} size="sm" className="h-8 justify-between px-2.5 text-xs" onClick={() => applyPreset(option.value)}>
              {option.label}{mode === String(option.value) && <Check className="h-3.5 w-3.5" />}
            </Button>
          ))}
        </div>
        <div className="my-2 border-t" />
        <div className="px-2 pb-1 text-[11px] font-semibold text-muted-foreground">Custom range</div>
        <Calendar mode="range" selected={range} onSelect={applyCustom} defaultMonth={range.from ?? today} className="pointer-events-auto p-2" />
      </PopoverContent>
    </Popover>
  );
}

export function Sparkline({ data, positive = true }: { data: { v: number }[]; positive?: boolean }) {
  const color = positive ? "hsl(var(--chart-2))" : "hsl(var(--destructive) / .7)";
  return (
    <div className="h-9 w-24 shrink-0">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, bottom: 2, left: 0, right: 0 }}>
          <Area type="linear" dataKey="v" stroke={color} strokeWidth={1.5} fill="none" isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function KpiCard({ label, value, sub, delta, goodWhenUp = true, spark, icon: _Icon, tone = "default", onClick }: {
  label: string; value: string; sub?: string | undefined; delta: number; goodWhenUp?: boolean; spark: { v: number }[]; icon: LucideIcon; tone?: "default" | "alert"; onClick?: () => void;
}) {
  const good = goodWhenUp ? delta >= 0 : delta <= 0;
  const Cmp = onClick ? "button" : "div";
  return (
    <Cmp onClick={onClick} className={cn("group min-w-0 rounded-md border bg-card p-4 transition-colors hover:border-input", onClick && "w-full cursor-pointer text-left", tone === "alert" && "border-l-[3px] border-l-destructive")}>
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-xs font-medium text-muted-foreground">{label}</span>
        {onClick && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-soft transition-colors group-hover:text-foreground" aria-hidden />}
      </div>
      <div className="mt-2 text-[28px] font-semibold leading-8 tabular-nums text-foreground">{value}</div>
      <div className="mt-2 flex items-end justify-between gap-2">
        <div className="min-w-0 text-xs">
          <span className={cn("inline-flex items-center gap-0.5 font-medium tabular-nums", good ? "text-success" : "text-destructive")}>
            {delta >= 0 ? "↑" : "↓"} {Math.abs(delta).toFixed(1)}%
          </span>
          {sub && <div className="mt-0.5 truncate text-muted-foreground">{sub}</div>}
        </div>
        <Sparkline data={spark} positive={good} />
      </div>
      {onClick && <span className="sr-only">View details</span>}
    </Cmp>
  );
}

export function StatTile({ label, value, hint, onClick, tone = "default", selected = false }: { label: string; value: string; hint?: string | undefined; onClick?: () => void; tone?: "default" | "red" | "amber" | "green"; selected?: boolean }) {
  const toneCls = { default: "", red: "border-destructive/30 bg-destructive-bg", amber: "border-warning/30 bg-warning-bg", green: "border-success/30 bg-success-bg" }[tone];
  const Cmp = onClick ? "button" : "div";
  return (
    <Cmp onClick={onClick} aria-pressed={onClick ? selected : undefined} className={cn("card-hover w-full min-w-0 p-4 text-left", toneCls, selected && "ring-1 ring-foreground/40")}>
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="mt-1 text-xl font-semibold tabular-nums text-foreground">{value}</div>
      {hint && <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">{hint}{onClick && <ChevronRight className="h-3 w-3" />}</div>}
    </Cmp>
  );
}

export function DetailsDrawer({ title, description, children, trigger = "View details" }: { title: string; description?: string | undefined; children: ReactNode; trigger?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-primary hover:bg-accent">
        {trigger}<ChevronRight className="h-3.5 w-3.5" />
      </button>
      <ControlledDrawer open={open} onOpenChange={setOpen} title={title} description={description}>{children}</ControlledDrawer>
    </>
  );
}

export function ControlledDrawer({ open, onOpenChange, title, description, children }: { open: boolean; onOpenChange: (v: boolean) => void; title: string; description?: string | undefined; children: ReactNode }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-2xl">
        <SheetHeader><SheetTitle>{title}</SheetTitle>{description && <SheetDescription>{description}</SheetDescription>}</SheetHeader>
        <div className="mt-4">{children}</div>
      </SheetContent>
    </Sheet>
  );
}

function nodeText(n: ReactNode): string {
  if (n == null || typeof n === "boolean") return "";
  if (typeof n === "string" || typeof n === "number") return String(n);
  if (Array.isArray(n)) return n.map(nodeText).join(" ");
  if (isValidElement(n)) return nodeText((n.props as { children?: ReactNode }).children);
  return "";
}

export function DataTable({ columns, rows, searchable }: { columns: { key: string; label: string; align?: "right" }[]; rows: Record<string, ReactNode>[]; searchable?: boolean }) {
  const [q, setQ] = useState("");
  const showSearch = searchable ?? rows.length > 5;
  const term = q.trim().toLowerCase();
  const shown = term ? rows.filter((r) => columns.some((c) => nodeText(r[c.key]).toLowerCase().includes(term))) : rows;
  return (
    <div className="space-y-2">
      {showSearch && (
        <div className="relative max-w-xs">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="h-8 pl-8 text-xs" aria-label="Search table" />
        </div>
      )}
      <div className="overflow-x-auto rounded-lg border scrollbar-thin">
        <table className="w-full min-w-[520px] text-sm">
          <thead className="bg-muted/50 text-xs text-muted-foreground">
            <tr>{columns.map((c) => <th key={c.key} className={cn("px-3 py-2 font-medium", c.align === "right" ? "text-right" : "text-left")}>{c.label}</th>)}</tr>
          </thead>
          <tbody>
            {shown.map((r, i) => (
              <tr key={i} className="border-t">
                {columns.map((c) => <td key={c.key} className={cn("px-3 py-2 text-foreground", c.align === "right" && "text-right tabular-nums")}>{r[c.key]}</td>)}
              </tr>
            ))}
            {shown.length === 0 && <tr><td colSpan={columns.length} className="px-3 py-6 text-center text-xs text-muted-foreground">No matching rows</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Note({ children, tone = "info" }: { children: ReactNode; tone?: "info" | "warning" }) {
  return (
    <div className={cn("flex items-start gap-2 rounded-lg border px-3 py-2 text-xs", tone === "info" ? "border-info/25 bg-info-bg text-foreground" : "border-warning/30 bg-warning-bg text-foreground")}>
      <Info className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", tone === "info" ? "text-info" : "text-warning")} />
      <span>{children}</span>
    </div>
  );
}

export function RagDot({ rag }: { rag: "red" | "amber" | "green" }) {
  return <span className={cn("inline-block h-2.5 w-2.5 rounded-full", rag === "red" ? "bg-destructive" : rag === "amber" ? "bg-warning" : "bg-success")} />;
}

export function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button onClick={onClick} className={cn("whitespace-nowrap rounded-md border px-3 py-1.5 text-xs font-medium transition-colors", active ? "border-primary/40 bg-accent text-primary" : "bg-card text-muted-foreground hover:border-input hover:text-foreground")}>
      {children}
    </button>
  );
}

export function SyncedLabel({ system }: { system: string }) {
  return <span className="badge-info inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-[11px] font-semibold"><span className="h-1.5 w-1.5 rounded-full bg-info" />Synced from existing system · {system}</span>;
}

export const tooltipStyle = { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 6, fontSize: 12, color: "hsl(var(--foreground))" };
export const axisProps = { tick: { fontSize: 11, fill: "hsl(var(--muted-foreground))" }, axisLine: false, tickLine: false } as const;

export const gridProps = { stroke: "hsl(var(--border))", strokeDasharray: "0", vertical: false } as const;

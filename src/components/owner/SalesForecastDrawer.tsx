import { useMemo, useState } from "react";
import { addDays, differenceInCalendarDays, format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { CalendarDays, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { DataTable, DetailsDrawer } from "@/components/owner/ui";
import { channels } from "@/data/owner/catalog";
import { formatINRCompact, formatNum } from "@/lib/format";
import { demoToday, getMultiDaySalesForecast } from "@/services/forecastService";

type Mode = "tomorrow" | "7" | "30" | "custom";

const presets: { value: Mode; label: string }[] = [
  { value: "tomorrow", label: "Tomorrow" },
  { value: "7", label: "Next 7 days" },
  { value: "30", label: "Next 30 days" },
];

/** Detailed sales forecast drawer: tomorrow by default, with 7-day / 30-day / custom forward ranges. */
export function SalesForecastDrawer() {
  const tomorrow = addDays(demoToday(), 1);
  const [mode, setMode] = useState<Mode>("tomorrow");
  const [custom, setCustom] = useState<DateRange>({ from: tomorrow, to: addDays(tomorrow, 6) });
  const [calOpen, setCalOpen] = useState(false);

  const days = mode === "tomorrow" ? 1 : mode === "7" ? 7 : mode === "30" ? 30 : Math.max(1, differenceInCalendarDays(custom.to ?? custom.from ?? tomorrow, custom.from ?? tomorrow) + 1);

  const data = useMemo(() => getMultiDaySalesForecast(days), [days]);

  const channelTotals = useMemo(() => {
    const map = new Map<string, { name: string; units: number; revenue: number }>();
    data.forEach((day) => day.byChannel.forEach((c) => {
      const entry = map.get(c.id) ?? { name: c.name, units: 0, revenue: 0 };
      entry.units += c.units;
      entry.revenue += c.revenue;
      map.set(c.id, entry);
    }));
    return channels.map((c) => map.get(c.id)!).filter(Boolean).sort((a, b) => b.revenue - a.revenue);
  }, [data]);

  const totalUnits = data.reduce((a, d) => a + d.units, 0);
  const totalRevenue = data.reduce((a, d) => a + d.revenue, 0);

  const rangeLabel = mode === "custom" && custom.from
    ? `${format(custom.from, "d MMM")}${custom.to ? ` – ${format(custom.to, "d MMM")}` : ""}`
    : presets.find((p) => p.value === mode)?.label;

  return (
    <DetailsDrawer title="Sales forecast" description="Expected demand by day and channel — pick a range">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {presets.map((preset) => (
            <Button key={preset.value} size="sm" variant={mode === preset.value ? "secondary" : "ghost"} className={cn("h-8 px-2.5 text-[11px] font-medium", mode === preset.value && "border border-border")} onClick={() => setMode(preset.value)}>
              {preset.label}
            </Button>
          ))}
          <Popover open={calOpen} onOpenChange={setCalOpen}>
            <PopoverTrigger asChild>
              <Button size="sm" variant={mode === "custom" ? "secondary" : "ghost"} className={cn("h-8 gap-1.5 px-2.5 text-[11px] font-medium", mode === "custom" && "border border-border")}>
                <CalendarDays className="h-3.5 w-3.5" />{mode === "custom" ? rangeLabel : "Custom"}<ChevronDown className="h-3 w-3 opacity-55" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto max-w-[calc(100vw-2rem)] p-2" align="start">
              <Calendar
                mode="range"
                selected={custom}
                disabled={{ before: tomorrow }}
                className="pointer-events-auto"
                onSelect={(next) => {
                  if (!next) return;
                  setCustom(next);
                  setMode("custom");
                  if (next.from && next.to) setCalOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-1 rounded-md border border-border bg-muted/40 px-3 py-2 text-xs">
          <span className="text-muted-foreground">{rangeLabel} · {days} {days === 1 ? "day" : "days"}</span>
          <span><b className="tabular-nums">{formatNum(totalUnits)}</b> units</span>
          <span><b className="tabular-nums">{formatINRCompact(totalRevenue)}</b> predicted revenue</span>
        </div>

        {days > 1 && (
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Day by day</h3>
            <DataTable
              columns={[{ key: "d", label: "Date" }, { key: "w", label: "Day" }, { key: "u", label: "Units", align: "right" }, { key: "r", label: "Revenue", align: "right" }, { key: "c", label: "Confidence", align: "right" }]}
              rows={data.map((day) => ({ d: day.date, w: day.weekday, u: formatNum(day.units), r: formatINRCompact(day.revenue), c: `${Math.round(day.confidence * 100)}%` }))}
            />
          </div>
        )}

        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Per channel{days > 1 ? " — totals for the range" : " — tomorrow"}</h3>
          <DataTable
            columns={[{ key: "c", label: "Channel" }, { key: "u", label: "Units", align: "right" }, { key: "r", label: "Revenue", align: "right" }, ...(days > 1 ? [{ key: "a", label: "Avg / day", align: "right" as const }] : [])]}
            rows={channelTotals.map((c) => ({ c: c.name, u: <b>{formatNum(c.units)}</b>, r: formatINRCompact(c.revenue), ...(days > 1 ? { a: formatNum(Math.round(c.units / days)) } : {}) }))}
          />
        </div>
      </div>
    </DetailsDrawer>
  );
}

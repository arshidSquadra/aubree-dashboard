import { useMemo, useState } from "react";
import { format, isSameDay, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useOwner } from "@/contexts/OwnerContext";
import { outlets } from "@/data/owner/catalog";
import { DataTable, PageHeader, Panel, StatTile } from "@/components/owner/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getForecastDrivers } from "@/services/forecastService";

export default function AuditLog() {
  const { audit } = useOwner();
  const [type, setType] = useState("all");
  const [store, setStore] = useState("all");
  const [when, setWhen] = useState("all");
  const now = new Date();

  const rows = useMemo(() => audit.filter((a) => {
    if (type !== "all" && a.type !== type) return false;
    if (store !== "all" && a.store !== store) return false;
    if (when === "today" && !isSameDay(a.at, now)) return false;
    if (when === "7d" && !isWithinInterval(a.at, { start: startOfDay(new Date(now.getTime() - 6 * 86400000)), end: endOfDay(now) })) return false;
    return true;
  }), [audit, type, store, when, now]);

  const statusCls: Record<string, string> = { Completed: "badge-success", Approved: "badge-success", Rejected: "badge-error", Notified: "badge-info" };
  const stores = ["All outlets", "Central Cloud Kitchen", ...outlets.map((o) => o.name)];

  return (
    <div className="space-y-5">
      <PageHeader title="Audit Log" subtitle="Every action taken in this dashboard" />
      <Tabs defaultValue="forecast">
        <TabsList className="h-9"><TabsTrigger value="forecast" className="px-3 text-xs sm:px-4 sm:text-[13px]">Trends & Forecast</TabsTrigger><TabsTrigger value="log" className="px-3 text-xs sm:px-4 sm:text-[13px]">Activity Log</TabsTrigger></TabsList>
        <TabsContent value="forecast" className="mt-5"><Panel title="Forecast inputs recorded" subtitle="Signals currently influencing tomorrow's forecast"><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{getForecastDrivers().map((driver) => <div key={driver.label} className="rounded-lg border p-3"><div className="flex items-center justify-between gap-2"><b className="text-[13px]">{driver.label}</b><span className="text-xs font-semibold text-primary">{driver.effect}</span></div><p className="mt-1 text-xs text-muted-foreground">{driver.detail}</p></div>)}</div></Panel></TabsContent>
        <TabsContent value="log" className="mt-5 space-y-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Total actions" value={`${audit.length}`} />
        <StatTile label="Operations & transfers" value={`${audit.filter((a) => a.type === "Operations" || a.type === "Transfer").length}`} />
        <StatTile label="Marketing decisions" value={`${audit.filter((a) => a.type === "Marketing").length}`} />
        <StatTile label="Today" value={`${audit.filter((a) => isSameDay(a.at, now)).length}`} tone="green" />
      </div>
      <Panel>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row">
          <Select value={when} onValueChange={setWhen}><SelectTrigger className="sm:w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Any date</SelectItem><SelectItem value="today">Today</SelectItem><SelectItem value="7d">Last 7 days</SelectItem></SelectContent></Select>
          <Select value={type} onValueChange={setType}><SelectTrigger className="sm:w-44"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All types</SelectItem>{["Operations", "Transfer", "Marketing", "Procurement"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>
          <Select value={store} onValueChange={setStore}><SelectTrigger className="sm:w-56"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All stores</SelectItem>{stores.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
        </div>
        {rows.length === 0 ? <p className="py-10 text-center text-sm text-muted-foreground">No actions match these filters.</p> : (
          <DataTable columns={[{ key: "t", label: "Timestamp" }, { key: "r", label: "Role" }, { key: "ty", label: "Type" }, { key: "a", label: "Action" }, { key: "s", label: "Store" }, { key: "st", label: "Status" }]}
            rows={rows.map((a) => ({ t: <span className="whitespace-nowrap text-xs">{format(a.at, "d MMM, h:mm a")}</span>, r: a.role, ty: a.type, a: a.action, s: a.store, st: <span className={cn("rounded px-2 py-0.5 text-[11px] font-semibold", statusCls[a.status])}>{a.status}</span> }))} />
        )}
      </Panel>
        </TabsContent>
      </Tabs>
    </div>
  );
}

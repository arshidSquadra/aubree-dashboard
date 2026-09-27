import { useState } from "react";
import { AlertTriangle, CakeSlice, Clock3, IndianRupee, Percent, Trash2 } from "lucide-react";
import { Area, AreaChart, CartesianGrid, Cell, ComposedChart, Legend, Line, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { cn } from "@/lib/utils";
import { channelById, channels, productById } from "@/data/owner/catalog";
import { delayedOrders, spoiledProducts } from "@/data/owner/operations";
import { formatINR, formatINRCompact, formatPct } from "@/lib/format";
import { getChannelMix, getForecastDrivers, getForecastVsActual, getInventoryHealth, getOutletSales, getRevenueTrend, getTodaySales, getTomorrowForecast } from "@/services/forecastService";
import { ChartDateFilter, ControlledDrawer, DataTable, DetailsDrawer, KpiCard, Note, PageHeader, Panel, RagDot, axisProps, tooltipStyle } from "@/components/owner/ui";
import { PriorityActionList } from "@/components/owner/PriorityActions";

const spark = (vals: number[]) => vals.map((v) => ({ v }));

type KpiId = "sales" | "forecast" | "margin" | "stockout" | "spoiled" | "sla";

export default function Overview() {
  const [revenueDays, setRevenueDays] = useState(30);
  const [mixDays, setMixDays] = useState(30);
  const [forecastDays, setForecastDays] = useState(7);
  const today = getTodaySales();
  const tmr = getTomorrowForecast();
  const inv = getInventoryHealth();
  const spoiled = spoiledProducts.reduce((a, s) => a + s.units, 0);
  const delayed = delayedOrders.reduce((a, d) => a + d.m10 + d.m15 + d.m20, 0);
  const trend = getRevenueTrend(revenueDays);
  const mix = getChannelMix(mixDays);
  const fva = getForecastVsActual(forecastDays);
  const stores = getOutletSales(30);
  const drivers = getForecastDrivers();
  const [kpi, setKpi] = useState<KpiId | null>(null);

  const todayByChannel = channels.map((c) => ({ ...c, revenue: trend[trend.length - 1]![c.id] as number })).sort((a, b) => b.revenue - a.revenue);
  const redRows = inv.rows.filter((r) => r.rag === "red");

  const kpiMeta: Record<KpiId, { title: string; description: string }> = {
    sales: { title: "Today's sales — by channel", description: "Where today's revenue is coming from" },
    forecast: { title: "Tomorrow's forecast", description: `${tmr.units} units · ${formatINRCompact(tmr.revenue)} · confidence ${Math.round(tmr.confidence * 100)}%` },
    margin: { title: "Net margin — by channel", description: "Gross margin minus aggregator take rate and channel costs" },
    stockout: { title: "Urgent stock-out risk", description: "Outlets and products below 40% cover for tomorrow" },
    spoiled: { title: "Spoiled units", description: "Units written off in the selected period" },
    sla: { title: "SLA-breached orders", description: "Orders delivered 10+ minutes late, by channel" },
  };

  return (
    <div className="space-y-5">
      <PageHeader title="Good evening, here's your business today" subtitle="7 outlets and 12 cloud kitchens across Bengaluru" />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
        <KpiCard label="Today's sales" value={formatINRCompact(today.revenue)} sub="All channels" delta={today.deltaPct} spark={today.spark} icon={IndianRupee} onClick={() => setKpi("sales")} />
        <KpiCard label="Tomorrow's forecast" value={`${tmr.units} units`} sub={`${formatINRCompact(tmr.revenue)} revenue`} delta={tmr.surgePct} spark={spark([446, 452, 461, 470, 468, 481, 499])} icon={CakeSlice} onClick={() => setKpi("forecast")} />
        <KpiCard label="Net margin" value="21.4%" sub="After aggregator fees" delta={-1.2} spark={spark([23, 22.8, 22.1, 22.6, 21.9, 21.7, 21.4])} icon={Percent} onClick={() => setKpi("margin")} />
        <KpiCard label="Urgent stock-out outlets" value={`${inv.outletsAtRisk}`} sub={`${inv.urgentProducts} products in red`} delta={50} goodWhenUp={false} spark={spark([1, 1, 2, 1, 2, 2, 3])} icon={AlertTriangle} tone="alert" onClick={() => setKpi("stockout")} />
        <KpiCard label="Spoiled units" value={`${spoiled}`} sub="Selected period" delta={-8.4} goodWhenUp={false} spark={spark([61, 55, 49, 52, 44, 41, 38])} icon={Trash2} onClick={() => setKpi("spoiled")} />
        <KpiCard label="SLA-breached orders" value={`${delayed}`} sub="10+ min late" delta={14.2} goodWhenUp={false} spark={spark([42, 48, 51, 55, 60, 71, 83])} icon={Clock3} tone="alert" onClick={() => setKpi("sla")} />
      </div>

      <ControlledDrawer open={!!kpi} onOpenChange={(v) => !v && setKpi(null)} title={kpi ? kpiMeta[kpi].title : ""} description={kpi ? kpiMeta[kpi].description : undefined}>
        {kpi === "sales" && (
          <div className="space-y-4">
            <DataTable columns={[{ key: "c", label: "Channel" }, { key: "r", label: "Revenue today", align: "right" }, { key: "s", label: "Share", align: "right" }]}
              rows={todayByChannel.map((c) => ({ c: <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: c.color }} />{c.name}</span>, r: formatINR(c.revenue), s: formatPct((c.revenue / today.revenue) * 100) }))} />
            <Note>Aggregators (Swiggy + Zomato) are {formatPct(((todayByChannel.find((c) => c.id === "swiggy")!.revenue + todayByChannel.find((c) => c.id === "zomato")!.revenue) / today.revenue) * 100, 0)} of today's sales — watch take rates on rain days.</Note>
          </div>
        )}
        {kpi === "forecast" && (
          <div className="space-y-4">
            <DataTable columns={[{ key: "c", label: "Channel" }, { key: "u", label: "Units", align: "right" }, { key: "r", label: "Revenue", align: "right" }]}
              rows={tmr.byChannel.map((c) => ({ c: c.name, u: c.units, r: formatINR(c.revenue) }))} />
            <div>
              <div className="mb-2 text-xs font-semibold text-foreground">Why this forecast</div>
              <ul className="space-y-2">
                {drivers.map((d) => (
                  <li key={d.label} className="flex items-start justify-between gap-3 rounded-lg border px-3 py-2 text-xs">
                    <div><b>{d.label}</b><span className="ml-1.5 text-muted-foreground">{d.detail}</span></div>
                    <span className="shrink-0 font-semibold text-primary">{d.effect}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        {kpi === "margin" && (
          <div className="space-y-4">
            <DataTable columns={[{ key: "c", label: "Channel" }, { key: "t", label: "Take rate", align: "right" }, { key: "m", label: "Net margin", align: "right" }, { key: "r", label: "Revenue (30d)", align: "right" }]}
              rows={mix.map((c) => ({ c: c.name, t: formatPct(c.takeRate, 0), m: <b className={cn(c.netMargin < 25 ? "text-destructive" : "text-success")}>{formatPct(c.netMargin, 0)}</b>, r: formatINRCompact(c.revenue) }))} />
            <Note>On rain days aggregator share jumps to ~68% of orders; at a 27% take rate that costs about ₹38K net margin per day.</Note>
          </div>
        )}
        {kpi === "stockout" && (
          <div className="space-y-4">
            <DataTable columns={[{ key: "o", label: "Outlet" }, { key: "p", label: "Product" }, { key: "h", label: "On hand", align: "right" }, { key: "n", label: "Needed", align: "right" }, { key: "c", label: "Capital", align: "right" }]}
              rows={redRows.map((r) => ({ o: <span className="flex items-center gap-1.5"><RagDot rag="red" />{r.outlet}</span>, p: r.product, h: r.onHand, n: r.need, c: formatINR(r.capital) }))} />
            <Note tone="warning">{inv.outletsAtRisk} outlets have 3+ products in red. Authorize dispatch or a store-to-store transfer from Operations to cover tomorrow.</Note>
          </div>
        )}
        {kpi === "spoiled" && (
          <div className="space-y-4">
            <DataTable columns={[{ key: "p", label: "Product" }, { key: "u", label: "Units", align: "right" }, { key: "c", label: "Cost impact", align: "right" }, { key: "r", label: "Reason" }]}
              rows={spoiledProducts.map((s) => ({ p: productById(s.productId).name, u: s.units, c: formatINR(s.units * productById(s.productId).unitCost), r: s.reason }))} />
            <Note>Spoilage data feeds back into the forecast, so tomorrow's production plan already accounts for this waste.</Note>
          </div>
        )}
        {kpi === "sla" && (
          <div className="space-y-4">
            <DataTable columns={[{ key: "c", label: "Channel" }, { key: "a", label: "10+ min", align: "right" }, { key: "b", label: "15+ min", align: "right" }, { key: "d", label: "20+ min", align: "right" }, { key: "r", label: "Main reason" }]}
              rows={delayedOrders.map((d) => ({ c: channelById(d.channel).name, a: d.m10, b: d.m15, d: d.m20, r: d.reason }))} />
            <Note tone="warning">Top reason: rider shortage due to rain spike (Swiggy, Zomato). Expect the same pattern this evening.</Note>
          </div>
        )}
      </ControlledDrawer>

      <Panel title="Priority Actions" subtitle="The highest-impact items right now. One click notifies the store and logs it in the Audit Log.">
        <PriorityActionList limit={4} compact />
      </Panel>

      <div className="grid gap-5 xl:grid-cols-3">
        <Panel title="Revenue trend by channel" subtitle={`${revenueDays} days`} className="xl:col-span-2" action={<ChartDateFilter onChange={(r) => setRevenueDays(r.days)} />}>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ left: -8, right: 8 }}>
                <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="date" {...axisProps} minTickGap={24} />
                <YAxis {...axisProps} tickFormatter={(v) => formatINRCompact(v)} width={62} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatINRCompact(v)} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {channels.map((c) => <Area key={c.id} type="linear" dataKey={c.id} name={c.name} stackId="1" stroke={c.color} fill={c.color} fillOpacity={0.12} strokeWidth={1.5} />)}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Sales split by channel" subtitle={`${mixDays} days`} action={<ChartDateFilter onChange={(r) => setMixDays(r.days)} />}>
          <ul className="space-y-3">
            {(() => { const total = mix.reduce((t, m) => t + m.revenue, 0) || 1; return [...mix].sort((x, y) => y.revenue - x.revenue).map((m, i) => { const pct = (m.revenue / total) * 100; return (
              <li key={m.id} className="text-xs">
                <div className="mb-1 flex justify-between gap-2"><span className="truncate text-foreground">{m.name}</span><span className="tabular-nums text-muted-foreground">{formatINRCompact(m.revenue)} · {pct.toFixed(0)}%</span></div>
                <div className="h-1.5 rounded-sm bg-muted"><div className={i === 0 ? "h-full rounded-sm bg-primary" : "h-full rounded-sm bg-chart-2"} style={{ width: `${pct}%` }} /></div>
              </li>); }); })()}
          </ul>
        </Panel>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <Panel title="Forecast vs actual" subtitle={`${forecastDays} days actual + next 7 days forecast · shaded area is confidence`} className="xl:col-span-2" action={<ChartDateFilter defaultDays={7} onChange={(r) => setForecastDays(r.days)} />}>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={fva} margin={{ left: -12, right: 8 }}>
                <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="date" {...axisProps} />
                <YAxis {...axisProps} domain={[300, 650]} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area dataKey="band" name="Confidence band" stroke="none" fill="hsl(var(--primary))" fillOpacity={0.12} />
                <Line dataKey="forecast" name="Forecast" stroke="hsl(var(--primary))" strokeWidth={2} strokeDasharray="5 4" dot={false} />
                <Line dataKey="actual" name="Actual" stroke="hsl(var(--chart-2))" strokeWidth={2.2} dot={{ r: 3 }} connectNulls={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Store performance" subtitle="Revenue vs target, last 30 days" action={
          <DetailsDrawer title="Store performance" description="Last 30 days, all channels">
            <DataTable columns={[{ key: "rank", label: "#" }, { key: "name", label: "Outlet" }, { key: "rev", label: "Revenue", align: "right" }, { key: "vs", label: "vs target", align: "right" }]}
              rows={stores.map((s, i) => ({ rank: i + 1, name: s.name, rev: formatINRCompact(s.revenue), vs: formatPct(s.vsTarget) }))} />
          </DetailsDrawer>
        }>
          <ol className="space-y-2">
            {stores.map((s, i) => (
              <li key={s.outletId} className="flex items-center gap-3 rounded-lg border px-3 py-2">
                <span className="w-4 text-xs font-bold text-muted-foreground">{i + 1}</span>
                <span className="min-w-0 flex-1 truncate text-[13px] font-medium">{s.name}</span>
                <span className="text-xs tabular-nums text-muted-foreground">{formatINRCompact(s.revenue)}</span>
                <span className={cn("w-14 rounded-full px-1.5 py-0.5 text-center text-[10px] font-bold", s.status === "good" ? "badge-success" : s.status === "bad" ? "badge-error" : "badge-neutral")}>{formatPct(s.vsTarget, 0)}</span>
              </li>
            ))}
          </ol>
        </Panel>
      </div>
    </div>
  );
}

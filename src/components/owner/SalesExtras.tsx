import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { channels, cloudKitchens, outlets } from "@/data/owner/catalog";
import { getHubSales, getSalesBreakdown } from "@/data/owner/stockControl";
import { formatINR, formatINRCompact, formatNum } from "@/lib/format";
import { DataTable, Note, Panel, StatTile, axisProps, tooltipStyle } from "./ui";

const channelRows = [{ name: "In-store", share: 0.22 }, ...channels.map((c) => ({ name: c.name, share: c.share * 0.78 }))];

export function DataFreshness() {
  return <Note>Previous-day data — end-of-day dump from POS (24 Sep 2026, 11:59 PM). Not live.</Note>;
}

export function SalesBreakdownTab() {
  const b = getSalesBreakdown();
  return (
    <div className="space-y-5">
      <DataFreshness />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Gross sales" value={formatINRCompact(b.gross)} hint="Before any deductions" />
        <StatTile label="Deductions" value={formatINRCompact(b.deductions)} hint="Discounts, commission, cancellations" tone="amber" />
        <StatTile label="Net sales" value={formatINRCompact(b.net)} hint="Incl. GST" tone="green" />
        <StatTile label="GST (5%)" value={formatINRCompact(b.cgst + b.sgst)} hint={`CGST ${formatINRCompact(b.cgst)} · SGST ${formatINRCompact(b.sgst)}`} />
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <Panel title="Gross to net" subtitle="How yesterday's sales were reduced">
          <DataTable columns={[{ key: "l", label: "Line" }, { key: "v", label: "Amount", align: "right" }]} rows={[
            { l: "Gross sales", v: formatINR(b.gross) }, { l: "− Discounts", v: formatINR(b.discounts) }, { l: "− Aggregator commission", v: formatINR(b.commission) }, { l: "− Cancellations / refunds", v: formatINR(b.cancellations) },
            { l: <b>Net sales</b>, v: <b>{formatINR(b.net)}</b> }, { l: "Taxable value", v: formatINR(b.taxable) }, { l: "CGST 2.5%", v: formatINR(b.cgst) }, { l: "SGST 2.5%", v: formatINR(b.sgst) },
          ]} />
        </Panel>
        <Panel title="Net sales by channel" subtitle="In-store, aggregators and direct">
          <DataTable columns={[{ key: "c", label: "Channel" }, { key: "g", label: "Gross", align: "right" }, { key: "n", label: "Net", align: "right" }, { key: "t", label: "GST", align: "right" }]}
            rows={channelRows.map((c) => { const x = getSalesBreakdown(c.share); return { c: c.name, g: formatINRCompact(x.gross), n: formatINRCompact(x.net), t: formatINRCompact(x.cgst + x.sgst) }; })} />
        </Panel>
      </div>
      <Panel title="Net sales by outlet">
        <DataTable columns={[{ key: "o", label: "Outlet" }, { key: "g", label: "Gross", align: "right" }, { key: "d", label: "Deductions", align: "right" }, { key: "n", label: "Net", align: "right" }, { key: "t", label: "GST", align: "right" }]}
          rows={outlets.map((o) => { const x = getSalesBreakdown(o.weight * 0.72); return { o: o.name, g: formatINRCompact(x.gross), d: formatINRCompact(x.deductions), n: formatINRCompact(x.net), t: formatINRCompact(x.cgst + x.sgst) }; })} />
      </Panel>
    </div>
  );
}

export function HubsTab() {
  const [hub, setHub] = useState("all");
  const d = getHubSales(hub);
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <DataFreshness />
        <Select value={hub} onValueChange={setHub}><SelectTrigger className="h-8 w-56 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All 12 hubs</SelectItem>{cloudKitchens.map((h) => <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>)}</SelectContent></Select>
      </div>
      <Panel title="Cloud-kitchen sales" subtitle="Only hub (cloud kitchen) orders — store sales excluded">
        <div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={d.byHub} margin={{ left: -4 }}><CartesianGrid stroke="hsl(var(--border))" vertical={false} /><XAxis dataKey="name" {...axisProps} interval={0} angle={-25} textAnchor="end" height={60} tickFormatter={(v: string) => v.replace(" Hub", "")} /><YAxis {...axisProps} tickFormatter={(v) => formatINRCompact(v)} width={60} /><Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatINRCompact(v)} cursor={{ fill: "hsl(var(--muted))" }} /><Bar dataKey="revenue" name="Revenue" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div>
      </Panel>
      <div className="grid gap-5 md:grid-cols-2">
        <Panel title="Top sellers" subtitle={hub === "all" ? "Across all hubs" : "This hub"}><DataTable columns={[{ key: "n", label: "Product" }, { key: "u", label: "Units", align: "right" }]} rows={d.top.map((p) => ({ n: p.name, u: formatNum(p.units) }))} /></Panel>
        <Panel title="Bottom sellers" subtitle="Candidates for menu or production review"><DataTable columns={[{ key: "n", label: "Product" }, { key: "u", label: "Units", align: "right" }]} rows={d.bottom.map((p) => ({ n: p.name, u: formatNum(p.units) }))} /></Panel>
      </div>
    </div>
  );
}

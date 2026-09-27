import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { accountsMonthly, expenseSplit, receivables } from "@/data/owner/operations";
import { formatINRCompact } from "@/lib/format";
import { ChartDateFilter, PageHeader, Panel, StatTile, SyncedLabel, axisProps, tooltipStyle } from "@/components/owner/ui";
import { ReconciliationTab } from "@/components/owner/Reconciliation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Accounts() {
  const [trendDays, setTrendDays] = useState(30);
  const [expenseDays, setExpenseDays] = useState(30);
  const last = accountsMonthly[accountsMonthly.length - 1]!;
  const ytdRev = accountsMonthly.reduce((a, m) => a + m.revenue, 0);
  const ytdExp = accountsMonthly.reduce((a, m) => a + m.expenses, 0);
  const due = receivables.reduce((a, r) => a + r.amount, 0);
  return (
    <div className="space-y-5">
      <PageHeader title="Accounts" subtitle="Summary view — managed in your accounting system" actions={<SyncedLabel system="Tally Prime" />} />
      <Tabs defaultValue="forecast">
        <TabsList className="h-9"><TabsTrigger value="forecast" className="px-3 text-xs sm:px-4 sm:text-[13px]">Trends & Forecast</TabsTrigger><TabsTrigger value="summary" className="px-3 text-xs sm:px-4 sm:text-[13px]">Financial Summary</TabsTrigger><TabsTrigger value="recon" className="px-3 text-xs sm:px-4 sm:text-[13px]">Reconciliation</TabsTrigger></TabsList>
        <TabsContent value="forecast" className="mt-5"><Panel title="Revenue vs expenses trend" subtitle={`${trendDays} days · ${formatINRCompact(last.revenue * trendDays / 30)} revenue`} action={<ChartDateFilter onChange={(r) => setTrendDays(r.days)} />}><div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={accountsMonthly.map((m) => ({ ...m, revenue: Math.round(m.revenue * trendDays / 30), expenses: Math.round(m.expenses * trendDays / 30) }))} margin={{ left: -4 }}><CartesianGrid stroke="hsl(var(--border))" vertical={false} /><XAxis dataKey="month" {...axisProps} /><YAxis {...axisProps} tickFormatter={(v) => formatINRCompact(v)} width={60} /><Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatINRCompact(v)} cursor={{ fill: "hsl(var(--muted))" }} /><Legend wrapperStyle={{ fontSize: 11 }} /><Bar dataKey="revenue" name="Revenue" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} /><Bar dataKey="expenses" name="Expenses" fill="hsl(var(--chart-1))" fillOpacity={0.7} radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div></Panel></TabsContent>
        <TabsContent value="summary" className="mt-5 space-y-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Revenue (Apr–Sep)" value={formatINRCompact(ytdRev)} />
        <StatTile label="Expenses (Apr–Sep)" value={formatINRCompact(ytdExp)} />
        <StatTile label="Operating profit" value={formatINRCompact(ytdRev - ytdExp)} hint={`${(((ytdRev - ytdExp) / ytdRev) * 100).toFixed(1)}% margin`} tone="green" />
        <StatTile label="Receivables due" value={formatINRCompact(due)} hint="Mostly corporate orders" tone="amber" />
      </div>
      <div className="grid gap-5 xl:grid-cols-3">
        <Panel title="Revenue vs expenses" subtitle={`${trendDays} days · ${formatINRCompact(last.revenue * trendDays / 30)} revenue`} className="xl:col-span-2" action={<ChartDateFilter onChange={(r) => setTrendDays(r.days)} />}>
          <div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={accountsMonthly.map((m) => ({ ...m, revenue: Math.round(m.revenue * trendDays / 30), expenses: Math.round(m.expenses * trendDays / 30) }))} margin={{ left: -4 }}>
            <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="month" {...axisProps} /><YAxis {...axisProps} tickFormatter={(v) => formatINRCompact(v)} width={60} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatINRCompact(v)} cursor={{ fill: "hsl(var(--muted))" }} /><Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="revenue" name="Revenue" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} /><Bar dataKey="expenses" name="Expenses" fill="hsl(var(--chart-1))" fillOpacity={0.7} radius={[4, 4, 0, 0]} />
          </BarChart></ResponsiveContainer></div>
        </Panel>
        <Panel title="Where the money goes" subtitle={`${expenseDays} days`} action={<ChartDateFilter onChange={(r) => setExpenseDays(r.days)} />}>
          <div className="h-52"><ResponsiveContainer width="100%" height="100%"><PieChart>
            <Pie data={expenseSplit} dataKey="value" nameKey="name" innerRadius={45} outerRadius={78} paddingAngle={2}>{expenseSplit.map((e, i) => <Cell key={e.name} fill={`hsl(var(--chart-${i + 1}))`} />)}</Pie>
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `${v}%`} />
          </PieChart></ResponsiveContainer></div>
          <ul className="space-y-1 text-xs">{expenseSplit.map((e, i) => <li key={e.name} className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: `hsl(var(--chart-${i + 1}))` }} /><span className="flex-1 text-muted-foreground">{e.name}</span><b>{e.value}%</b></li>)}</ul>
        </Panel>
      </div>
      <Panel title="Receivables ageing">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{receivables.map((r, i) => <StatTile key={r.bucket} label={r.bucket} value={formatINRCompact(r.amount)} tone={i >= 2 ? "red" : "default"} />)}</div>
      </Panel>
        </TabsContent>
        <TabsContent value="recon" className="mt-5"><ReconciliationTab /></TabsContent>
      </Tabs>
    </div>
  );
}

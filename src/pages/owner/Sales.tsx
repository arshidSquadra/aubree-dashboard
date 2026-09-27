import { useState } from "react";
import { toast } from "sonner";
import { CloudRain, Download, Lightbulb } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Label, Legend, Pie, PieChart, ReferenceLine, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { channels, type ChannelId } from "@/data/owner/catalog";
import { formatINRCompact, formatNum } from "@/lib/format";
import { getChannelMix, getOutletSales, getProductMatrix, getRevenueTrend, getSalesInsights, getTomorrowForecast } from "@/services/forecastService";
import { HubsTab, SalesBreakdownTab } from "@/components/owner/SalesExtras";
import { ChartDateFilter, Chip, DataTable, DetailsDrawer, PageHeader, Panel, StatTile, axisProps, tooltipStyle } from "@/components/owner/ui";
import { SalesForecastDrawer } from "@/components/owner/SalesForecastDrawer";

const quadColor: Record<string, string> = { Star: "hsl(var(--success))", "Plow Horse": "hsl(var(--chart-5))", Puzzle: "hsl(var(--warning))", Dog: "hsl(var(--destructive))" };

const tabs = [
  { value: "trends", label: "Trends & Forecast" },
  { value: "channels", label: "Channels" },
  { value: "products", label: "Products & Insights" },
  { value: "net", label: "Net Sales & GST" },
  { value: "hubs", label: "Hubs" },
];

export default function Sales() {
  const [ch, setCh] = useState<ChannelId | "all">("all");
  const [trendDays, setTrendDays] = useState(30);
  const [mixDays, setMixDays] = useState(30);
  const [outletDays, setOutletDays] = useState(30);
  const [marginDays, setMarginDays] = useState(30);
  const [productDays, setProductDays] = useState(30);
  const shown = ch === "all" ? channels : channels.filter((c) => c.id === ch);
  const trend = getRevenueTrend(trendDays);
  const mix = getChannelMix(mixDays);
  const outlets = getOutletSales(outletDays);
  const scale = ch === "all" ? 1 : channels.find((c) => c.id === ch)!.share;
  const tmr = getTomorrowForecast();
  const marginMix = getChannelMix(marginDays);
  const matrix = getProductMatrix(productDays);
  const total = getChannelMix(trendDays).filter((m) => ch === "all" || m.id === ch).reduce((a, m) => a + m.revenue, 0);

  return (
    <div className="space-y-5">
      <PageHeader title="Sales" subtitle="Where revenue comes from, and what tomorrow looks like" actions={
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="outline" size="sm" className="gap-1.5"><Download className="h-4 w-4" />Download report</Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {["CSV", "PDF"].map((f) => <DropdownMenuItem key={f} onClick={() => toast.success(`Sales report (${f}) is ready`, { description: "Demo download — no file is created in this prototype." })}>Download as {f}</DropdownMenuItem>)}
          </DropdownMenuContent>
        </DropdownMenu>
      } />

      <Tabs defaultValue="trends" className="space-y-5">
        <div className="max-w-full overflow-x-auto scrollbar-thin">
          <TabsList className="h-9">
            {tabs.map((t) => <TabsTrigger key={t.value} value={t.value} className="whitespace-nowrap px-3 text-xs sm:px-4 sm:text-[13px]">{t.label}</TabsTrigger>)}
          </TabsList>
        </div>

        <TabsContent value="trends" className="space-y-5">
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-thin">
            <Chip active={ch === "all"} onClick={() => setCh("all")}>All channels</Chip>
            {channels.map((c) => <Chip key={c.id} active={ch === c.id} onClick={() => setCh(c.id)}>{c.name}</Chip>)}
          </div>
          <div className="grid gap-5 xl:grid-cols-3">
            <Panel title="Tomorrow's forecast" subtitle={`${tmr.weekday}, ${tmr.date}`} className="card-gradient" action={<SalesForecastDrawer />}>
              <div className="grid grid-cols-2 gap-3">
                <div><div className="text-xs text-muted-foreground">Total units</div><div className="font-display text-2xl font-bold">{Math.round(tmr.units * scale)}</div></div>
                <div><div className="text-xs text-muted-foreground">Revenue</div><div className="font-display text-2xl font-bold">{formatINRCompact(tmr.revenue * scale)}</div></div>
                <div><div className="text-xs text-muted-foreground">Model confidence</div><div className="font-semibold">{Math.round(tmr.confidence * 100)}%</div></div>
                <div><div className="text-xs text-muted-foreground">Surge vs baseline</div><div className="font-semibold text-success">+{tmr.surgePct.toFixed(1)}%</div></div>
              </div>
              <div className="mt-4 space-y-1.5">
                {tmr.byChannel.map((c) => (
                  <div key={c.id} className="flex items-center gap-2 text-xs">
                    <span className="w-28 truncate text-muted-foreground">{c.name}</span>
                    <div className="h-1.5 flex-1 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${(c.units / tmr.units) * 100 * 2.5}%` }} /></div>
                    <span className="w-8 text-right font-semibold tabular-nums">{c.units}</span>
                  </div>
                ))}
              </div>
            </Panel>
            <Panel title="Revenue trend by channel" subtitle={`${formatINRCompact(total)} across ${trendDays} days`} className="xl:col-span-2" action={<ChartDateFilter onChange={(r) => setTrendDays(r.days)} />}>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trend} margin={{ left: -8, right: 8 }}>
                    <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="date" {...axisProps} minTickGap={24} />
                    <YAxis {...axisProps} tickFormatter={(v) => formatINRCompact(v)} width={62} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatINRCompact(v)} />
                    {shown.map((c) => <Area key={c.id} type="linear" dataKey={c.id} name={c.name} stackId="1" stroke={c.color} fill={c.color} fillOpacity={0.12} strokeWidth={1.5} />)}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Panel>
          </div>
        </TabsContent>

        <TabsContent value="channels" className="space-y-5">
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-thin">
            <Chip active={ch === "all"} onClick={() => setCh("all")}>All channels</Chip>
            {channels.map((c) => <Chip key={c.id} active={ch === c.id} onClick={() => setCh(c.id)}>{c.name}</Chip>)}
          </div>
          <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
            <Panel title="Channel mix" subtitle={`${mixDays} days`} action={<ChartDateFilter onChange={(r) => setMixDays(r.days)} />}>
              <div className="h-56"><ResponsiveContainer width="100%" height="100%"><PieChart>
                <Pie data={mix} dataKey="revenue" nameKey="name" innerRadius={50} outerRadius={82} paddingAngle={2}>{mix.map((m) => <Cell key={m.id} fill={m.color} opacity={ch === "all" || ch === m.id ? 1 : 0.25} />)}</Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatINRCompact(v)} /><Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart></ResponsiveContainer></div>
            </Panel>
            <Panel title="Outlet-wise sales" subtitle={`${outletDays} days`} action={
              <div className="flex flex-wrap items-center justify-end gap-2"><ChartDateFilter onChange={(r) => setOutletDays(r.days)} /><DetailsDrawer title="Outlet-wise sales"><DataTable columns={[{ key: "n", label: "Outlet" }, { key: "r", label: "Revenue", align: "right" }]} rows={outlets.map((o) => ({ n: o.name, r: formatINRCompact(o.revenue * scale) }))} /></DetailsDrawer></div>
            }>
              <div className="h-56"><ResponsiveContainer width="100%" height="100%"><BarChart data={outlets.map((o) => ({ name: o.name.split(" ")[0], revenue: Math.round(o.revenue * scale) }))} layout="vertical" margin={{ left: 10, right: 12 }}>
                <XAxis type="number" {...axisProps} tickFormatter={(v) => formatINRCompact(v)} /><YAxis type="category" dataKey="name" {...axisProps} width={80} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatINRCompact(v)} cursor={{ fill: "hsl(var(--muted))" }} />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart></ResponsiveContainer></div>
            </Panel>
            <Panel title="Net margin per channel" subtitle={`After channel costs · ${marginDays} days`} className="lg:col-span-2 2xl:col-span-1" action={<ChartDateFilter onChange={(r) => setMarginDays(r.days)} />}>
              <div className="h-56"><ResponsiveContainer width="100%" height="100%"><BarChart data={marginMix.map((m) => ({ name: m.name.split(" ")[0], margin: m.netMargin, take: m.takeRate }))} margin={{ left: -16 }}>
                <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" {...axisProps} /><YAxis {...axisProps} unit="%" />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `${v}%`} cursor={{ fill: "hsl(var(--muted))" }} /><Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="take" name="Take rate" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="margin" name="Net margin" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
              </BarChart></ResponsiveContainer></div>
            </Panel>
          </div>
          <div className="grid gap-5 xl:grid-cols-3">
            <Panel title="Aggregator take rate vs margin" className="xl:col-span-1">
              <div className="grid grid-cols-2 gap-3">
                <StatTile label="Avg aggregator take" value="26.8%" hint="Swiggy 28 · Zomato 26" />
                <StatTile label="Own website margin" value="49%" hint="vs 24% on aggregators" tone="green" />
              </div>
              <div className="mt-3 flex gap-3 rounded-xl border border-warning/30 bg-warning-bg p-3">
                <CloudRain className="h-5 w-5 shrink-0 text-warning" />
                <div className="text-xs"><div className="font-semibold text-foreground">Rain-day margin loss</div><p className="mt-0.5 text-muted-foreground">On rain days, 68% of orders move to aggregators. That costs about <b className="text-foreground">₹38K</b> net margin per day.</p></div>
              </div>
            </Panel>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-5">
          <div className="grid gap-5 xl:grid-cols-3">
            <Panel title="Product matrix" subtitle={`Margin vs volume · ${productDays} days`} className="xl:col-span-2" action={
              <div className="flex flex-wrap items-center justify-end gap-2"><ChartDateFilter onChange={(r) => setProductDays(r.days)} /><DetailsDrawer title="Product matrix"><DataTable columns={[{ key: "n", label: "Product" }, { key: "q", label: "Quadrant" }, { key: "v", label: "Units", align: "right" }, { key: "m", label: "Margin", align: "right" }]} rows={matrix.map((p) => ({ n: p.name, q: p.quadrant, v: formatNum(p.volume), m: `${p.margin}%` }))} /></DetailsDrawer></div>
            }>
              <div className="h-80"><ResponsiveContainer width="100%" height="100%"><ScatterChart margin={{ left: -4, right: 16, top: 10, bottom: 10 }}>
                <CartesianGrid stroke="hsl(var(--border))" />
                <XAxis type="number" dataKey="volume" name="Units" {...axisProps}><Label value="Volume (units)" position="insideBottom" offset={-4} fontSize={11} /></XAxis>
                <YAxis type="number" dataKey="margin" name="Margin" unit="%" domain={[40, 70]} {...axisProps} />
                <ZAxis range={[120, 120]} />
                <ReferenceLine x={320} stroke="hsl(var(--border))" strokeWidth={2} /><ReferenceLine y={58} stroke="hsl(var(--border))" strokeWidth={2} />
                <Tooltip contentStyle={tooltipStyle} content={({ payload }) => { const p = payload?.[0]?.payload as (typeof matrix)[number] | undefined; return p ? <div style={tooltipStyle} className="p-2"><b>{p.name}</b><div>{p.quadrant} · {p.volume} units · {p.margin}%</div></div> : null; }} />
                <Scatter data={matrix}>{matrix.map((p) => <Cell key={p.id} fill={quadColor[p.quadrant]} />)}</Scatter>
              </ScatterChart></ResponsiveContainer></div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] sm:grid-cols-4">
                {[["Star", "High margin, high volume"], ["Plow Horse", "High volume, low margin"], ["Puzzle", "Low volume, high margin"], ["Dog", "Low on both"]].map(([q, d]) => (
                  <div key={q} className="flex items-start gap-1.5"><span className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ background: quadColor[q!] }} /><span><b>{q}s</b> · {d}</span></div>
                ))}
              </div>
            </Panel>
            <Panel title="Order value insights">
              <div className="space-y-3">
                {getSalesInsights().map((i) => (
                  <div key={i.title} className="flex gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground"><Lightbulb className="h-4 w-4" /></span>
                    <div className="min-w-0"><div className="flex flex-wrap items-center gap-2 text-[13px] font-semibold">{i.title}<span className="badge-success rounded-full px-1.5 py-0.5 text-[10px]">{i.metric}</span></div><p className="mt-0.5 text-xs text-muted-foreground">{i.body}</p></div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </TabsContent>
        <TabsContent value="net" className="space-y-5"><SalesBreakdownTab /></TabsContent>
        <TabsContent value="hubs" className="space-y-5"><HubsTab /></TabsContent>
      </Tabs>
    </div>
  );
}

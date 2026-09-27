import { useState } from "react";
import { toast } from "sonner";
import { Check, TrendingUp, X, Zap } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useOwner } from "@/contexts/OwnerContext";
import { channelById, channels, type ChannelId } from "@/data/owner/catalog";
import { campaigns, marketingChannels, marketingProposals, playbooks, socialPerformance } from "@/data/owner/operations";
import { formatINR, formatINRCompact, formatNum } from "@/lib/format";
import { getMarketingInsights, getPromoTrend, getRecommendedActions, getSpendVsLeads } from "@/services/forecastService";
import { ChartDateFilter, Chip, DataTable, DetailsDrawer, Note, PageHeader, Panel, Sparkline, StatTile, axisProps, tooltipStyle } from "@/components/owner/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Marketing() {
  const [ch, setCh] = useState<ChannelId | "all">("all");
  const [spendDays, setSpendDays] = useState(30);
  const [cplDays, setCplDays] = useState(30);
  const [promoDays, setPromoDays] = useState(30);
  const { decisions, decide, log } = useOwner();
  const rows = ch === "all" ? marketingChannels : marketingChannels.filter((m) => m.id === ch);
  const agg = rows.reduce((a, r) => ({ spend: a.spend + r.spend, leads: a.leads + r.leads, sales: a.sales + r.sales }), { spend: 0, leads: 0, sales: 0 });
  const indicative = ch !== "all" && marketingChannels.find((m) => m.id === ch)?.indicative;
  const svl = getSpendVsLeads(ch, spendDays);
  const promo = getPromoTrend(promoDays);
  const cplScale = cplDays / 30;
  const pending = marketingProposals.filter((p) => !decisions[p.id]).length;

  const act = (id: string, title: string, d: "approved" | "rejected") => {
    decide(id, d);
    log({ type: "Marketing", action: `${d === "approved" ? "Approved" : "Rejected"}: ${title}`, store: "All outlets", status: d === "approved" ? "Approved" : "Rejected" });
    toast.success(d === "approved" ? "Approved and sent to Marketing Manager" : "Rejected — Marketing Manager notified");
  };

  return (
    <div className="space-y-5">
      <PageHeader title="Marketing" subtitle="Spend, leads and what's worth doing next" />

      <Tabs defaultValue="forecast">
        <TabsList className="h-9">
          <TabsTrigger value="forecast" className="px-3 text-xs sm:px-4 sm:text-[13px]">Trends & Forecast</TabsTrigger>
          <TabsTrigger value="workspace" className="px-3 text-xs sm:px-4 sm:text-[13px]">Marketing Workspace</TabsTrigger>
        </TabsList>
        <TabsContent value="forecast" className="mt-5 space-y-5">
          <div className="grid gap-5 xl:grid-cols-3">
            <Panel title="Forecast insights" className="xl:col-span-2">
              <div className="grid gap-3 md:grid-cols-3">{getMarketingInsights().map((i) => <div key={i.title} className="rounded-xl border bg-card p-4"><TrendingUp className="h-4 w-4 text-primary" /><div className="mt-2 text-[13px] font-semibold">{i.title}</div><p className="mt-1 text-xs text-muted-foreground">{i.body}</p><span className="mt-2 inline-block rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-accent-foreground">{i.confidence} confidence</span></div>)}</div>
            </Panel>
            <Panel title="Recommended actions"><ul className="space-y-2.5">{getRecommendedActions().map((a) => <li key={a.title} className="flex gap-3 rounded-lg border p-3"><Zap className="mt-0.5 h-4 w-4 shrink-0 text-warning" /><div className="min-w-0"><div className="text-[13px] font-semibold">{a.title}</div><div className="text-xs text-muted-foreground">{a.tag} · <span className="font-semibold text-success">{a.impact}</span></div></div></li>)}</ul></Panel>
          </div>
        </TabsContent>
        <TabsContent value="workspace" className="mt-5 space-y-5">

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-thin">
        <Chip active={ch === "all"} onClick={() => setCh("all")}>All channels</Chip>
        {channels.map((c) => <Chip key={c.id} active={ch === c.id} onClick={() => setCh(c.id)}>{c.name}</Chip>)}
      </div>

      {indicative && <Note tone="warning">Lead and cost-per-lead numbers for {channelById(ch as ChannelId).name} are indicative only. Aggregators don't share true lead data, so these are estimated from menu views and add-to-cart events.</Note>}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatTile label="Spend" value={formatINRCompact(agg.spend)} hint="Last 30 days" />
        <StatTile label="Leads" value={formatNum(agg.leads)} hint={indicative ? "Indicative" : "Tracked"} />
        <StatTile label="Cost per lead" value={formatINR(agg.spend / agg.leads)} />
        <StatTile label="Attributed sales" value={formatINRCompact(agg.sales)} />
        <StatTile label="Return on spend" value={`${(agg.sales / agg.spend).toFixed(1)}×`} tone="green" />
      </div>

      <Panel title="Approval Queue" subtitle={`${pending} proposals from the Marketing Manager waiting for you`} className="border-primary/25">
        <div className="grid gap-3 lg:grid-cols-2">
          {marketingProposals.map((p) => {
            const d = decisions[p.id];
            return (
              <div key={p.id} className="flex flex-col rounded-xl border bg-card p-4">
                <div className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground"><span className="badge-neutral rounded px-2 py-0.5 font-semibold">{p.channel}</span><span>{p.submitted}</span></div>
                <div className="mt-2 text-[13px] font-semibold">{p.title}</div>
                <div className="mt-1 text-xs text-muted-foreground">Cost: <b className="text-foreground">{p.cost < 0 ? `saves ${formatINRCompact(-p.cost)}` : formatINRCompact(p.cost)}</b> · Expected: <b className="text-foreground">{p.expected}</b></div>
                <div className="mt-3">
                  {d ? (
                    <span className={cn("inline-flex items-center gap-1 rounded px-2.5 py-1 text-xs font-semibold", d === "approved" ? "badge-success" : "badge-error")}>{d === "approved" ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}{d === "approved" ? "Approved · logged" : "Rejected · logged"}</span>
                  ) : (
                    <div className="flex gap-2">
                      <Button size="sm" className="h-8 flex-1 text-xs" onClick={() => act(p.id, p.title, "approved")}><Check className="h-3.5 w-3.5" />Approve</Button>
                      <Button size="sm" variant="outline" className="h-8 flex-1 text-xs" onClick={() => act(p.id, p.title, "rejected")}><X className="h-3.5 w-3.5" />Reject</Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      <div className="grid gap-5 xl:grid-cols-2">
        <Panel title="Spend vs leads" subtitle={`Weekly · ${spendDays} days`} action={<ChartDateFilter onChange={(r) => setSpendDays(r.days)} />}>
          <div className="h-64"><ResponsiveContainer width="100%" height="100%"><ComposedChart data={svl} margin={{ left: -4, right: 0 }}>
            <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="week" {...axisProps} /><YAxis yAxisId="l" {...axisProps} tickFormatter={(v) => formatINRCompact(v)} width={58} /><YAxis yAxisId="r" orientation="right" {...axisProps} />
            <Tooltip contentStyle={tooltipStyle} /><Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar yAxisId="l" dataKey="spend" name="Spend (₹)" fill="hsl(var(--primary))" fillOpacity={0.8} radius={[4, 4, 0, 0]} />
            <Line yAxisId="r" dataKey="leads" name="Leads" stroke="hsl(var(--chart-2))" strokeWidth={2.2} dot={false} />
          </ComposedChart></ResponsiveContainer></div>
        </Panel>
        <Panel title="Cost per lead by channel" subtitle={`Aggregator values are indicative · ${cplDays} days`} action={<ChartDateFilter onChange={(r) => setCplDays(r.days)} />}>
          <div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={marketingChannels.map((m) => ({ name: channelById(m.id).name.split(" ")[0], cpl: Math.round((m.spend * cplScale) / Math.max(1, m.leads * cplScale)) }))} margin={{ left: -12 }}>
            <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="name" {...axisProps} /><YAxis {...axisProps} tickFormatter={(v) => `₹${v}`} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatINR(v)} cursor={{ fill: "hsl(var(--muted))" }} />
            <Bar dataKey="cpl" name="CPL" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
          </BarChart></ResponsiveContainer></div>
        </Panel>
      </div>

      <Panel title="Discounts vs orders vs margin" subtitle={`Swiggy + Zomato · ${promoDays} days`} action={<ChartDateFilter onChange={(r) => setPromoDays(r.days)} />}>
        <div className="h-72"><ResponsiveContainer width="100%" height="100%"><ComposedChart data={promo} margin={{ left: -8, right: 0 }}>
          <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
          <XAxis dataKey="day" {...axisProps} /><YAxis yAxisId="l" {...axisProps} /><YAxis yAxisId="r" orientation="right" {...axisProps} unit="%" />
          <Tooltip contentStyle={tooltipStyle} /><Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar yAxisId="l" dataKey="orders" name="Orders" fill="hsl(var(--chart-5))" fillOpacity={0.5} radius={[3, 3, 0, 0]} />
          <Line yAxisId="r" dataKey="discount" name="Discount %" stroke="hsl(var(--chart-4))" strokeWidth={2} dot={false} />
          <Line yAxisId="r" dataKey="netMargin" name="Net margin %" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
        </ComposedChart></ResponsiveContainer></div>
        <div className="mt-3"><Note>On days when Swiggy/Zomato discounts were above 8.5%, orders grew +4% but net margin fell by about 3 points. Revenue barely moved.</Note></div>
      </Panel>

      <div className="grid gap-5 xl:grid-cols-3">
        <Panel title="Forecast insights" className="xl:col-span-2">
          <div className="grid gap-3 md:grid-cols-3">
            {getMarketingInsights().map((i) => (
              <div key={i.title} className="rounded-xl border bg-card p-4">
                <TrendingUp className="h-4 w-4 text-primary" />
                <div className="mt-2 text-[13px] font-semibold">{i.title}</div>
                <p className="mt-1 text-xs text-muted-foreground">{i.body}</p>
                <span className="mt-2 inline-block rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-accent-foreground">{i.confidence} confidence</span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Recommended actions">
          <ul className="space-y-2.5">
            {getRecommendedActions().map((a) => (
              <li key={a.title} className="flex gap-3 rounded-lg border p-3">
                <Zap className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                <div className="min-w-0"><div className="text-[13px] font-semibold">{a.title}</div><div className="text-xs text-muted-foreground">{a.tag} · <span className="font-semibold text-success">{a.impact}</span></div></div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <Panel title="Campaigns" subtitle={`${campaigns.filter((c) => c.status === "Live").length} live`} className="xl:col-span-2" action={
          <DetailsDrawer title="Campaign performance"><DataTable columns={[{ key: "n", label: "Campaign" }, { key: "c", label: "Channel" }, { key: "s", label: "Spend", align: "right" }, { key: "o", label: "Orders", align: "right" }, { key: "r", label: "Return", align: "right" }, { key: "t", label: "Trend" }, { key: "st", label: "Status" }]}
            rows={campaigns.map((c, i) => ({ n: c.name, c: channelById(c.channel as ChannelId).name, s: formatINRCompact(c.spend), o: formatNum(c.orders), r: `${c.roas}×`, t: <Sparkline data={[3, 4, 3.6, 4.4, 4.1, 4.8].map((v, k) => ({ v: v + ((i * k) % 3) * 0.3 }))} positive={c.roas > 4} />, st: c.status }))} /></DetailsDrawer>
        }>
          <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
            {campaigns.slice(0, 6).map((c, i) => (
              <div key={c.name} className="flex items-center justify-between gap-2 rounded-lg border p-3">
                <div className="min-w-0"><div className="truncate text-[13px] font-semibold">{c.name}</div><div className="text-[11px] text-muted-foreground">{c.roas}× return · {c.status}</div></div>
                <Sparkline data={[3, 4, 3.6, 4.4, 4.1, 4.8].map((v, k) => ({ v: v + ((i * k) % 3) * 0.3 }))} positive={c.roas > 4} />
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Social media">
          <ul className="space-y-2">
            {socialPerformance.map((s) => (
              <li key={s.platform} className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-xs">
                <div className="min-w-0"><div className="truncate text-[13px] font-semibold">{s.platform}</div><div className="text-muted-foreground">{formatNum(s.followers)} followers · {s.engagement}% engagement</div></div>
                <div className="text-right"><div className="font-semibold">{s.orders}</div><div className="text-muted-foreground">orders</div></div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel title="Playbooks">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {playbooks.map((p) => <div key={p.title} className="rounded-lg border p-3"><div className="text-[13px] font-semibold">{p.title}</div><p className="mt-1 text-xs text-muted-foreground">{p.desc}</p></div>)}
        </div>
      </Panel>
        </TabsContent>
      </Tabs>
    </div>
  );
}

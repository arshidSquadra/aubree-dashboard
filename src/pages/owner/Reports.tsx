import { useState } from "react";
import { toast } from "sonner";
import { Download } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { ChartDateFilter, PageHeader } from "@/components/owner/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const reports = [
  { id: "daily", name: "Daily Sales", desc: "Revenue, orders and AOV by outlet and channel", seed: [5, 6, 5.5, 7, 6.8, 7.5, 8] },
  { id: "channel", name: "Channel Performance", desc: "Revenue, take rate and net margin per channel", seed: [4, 4.5, 5, 4.8, 5.6, 5.9, 6.2] },
  { id: "mkt", name: "Marketing Spend & CPL", desc: "Spend, leads and cost per lead by channel", seed: [3, 3.4, 3.1, 3.8, 4, 3.7, 4.2] },
  { id: "inv", name: "Inventory & Stock-out", desc: "Red/amber/green stock status by outlet and product", seed: [2, 3, 2.5, 4, 3, 3.5, 5] },
  { id: "spoil", name: "Spoilage", desc: "Spoiled products and ingredients, with cost impact", seed: [6, 5.5, 5, 5.2, 4.6, 4.1, 3.8] },
  { id: "sla", name: "SLA Breaches", desc: "Delayed orders by channel and reason", seed: [3, 3.5, 4, 4.4, 5, 5.8, 6.4] },
  { id: "fva", name: "Forecast vs Actual", desc: "Daily forecast accuracy and confidence bands", seed: [5, 5.2, 5.1, 5.4, 5.3, 5.6, 5.5] },
];

function ReportCard({ r }: { r: (typeof reports)[number] }) {
  const [days, setDays] = useState(7);
  const [label, setLabel] = useState("Last 7 days");
  const points = Array.from({ length: Math.min(days, 30) }, (_, i) => ({ v: r.seed[i % r.seed.length]! * (0.96 + (i % 4) * 0.025) }));
  const dl = (f: string) => toast.success(`${r.name} (${f}) is ready`, { description: `${label} · demo download — no file is created in this prototype.` });
  return (
    <div className="card-hover flex min-w-0 flex-col p-4">
      <div className="text-[15px] font-semibold">{r.name}</div>
      <p className="mt-0.5 text-xs text-muted-foreground">{r.desc}</p>
      <div className="my-3 h-20 rounded-lg bg-muted/40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={points} margin={{ top: 8, bottom: 0, left: 0, right: 0 }}>
            <Area dataKey="v" type="linear" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} strokeWidth={2} isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-auto flex flex-wrap items-center gap-2">
        <ChartDateFilter defaultDays={7} onChange={(next) => { setDays(next.days); setLabel(next.label); }} />
        <div className="ml-auto flex gap-1.5">
          <Button size="sm" variant="outline" className="h-8 gap-1 text-xs" onClick={() => dl("CSV")}><Download className="h-3.5 w-3.5" />CSV</Button>
          <Button size="sm" className="h-8 gap-1 text-xs" onClick={() => dl("PDF")}><Download className="h-3.5 w-3.5" />PDF</Button>
        </div>
      </div>
    </div>
  );
}

export default function Reports() {
  return (
    <div className="space-y-5">
      <PageHeader title="Reports" subtitle="Pick a date range and download any report" />
      <Tabs defaultValue="forecast"><TabsList className="h-9"><TabsTrigger value="forecast" className="px-3 text-xs sm:px-4 sm:text-[13px]">Trends & Forecast</TabsTrigger><TabsTrigger value="all" className="px-3 text-xs sm:px-4 sm:text-[13px]">All Reports</TabsTrigger></TabsList><TabsContent value="forecast" className="mt-5"><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{reports.filter((r) => ["daily", "channel", "fva"].includes(r.id)).map((r) => <ReportCard key={r.id} r={r} />)}</div></TabsContent><TabsContent value="all" className="mt-5"><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">{reports.map((r) => <ReportCard key={r.id} r={r} />)}</div></TabsContent></Tabs>
    </div>
  );
}

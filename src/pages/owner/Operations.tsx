import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, ArrowRight, CheckCircle2, Clock3, RotateCcw, ShieldCheck, Store, Warehouse } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useOwner } from "@/contexts/OwnerContext";
import { channelById, cloudKitchens, ingredients, outletById, outlets, productById, products } from "@/data/owner/catalog";
import { delayedOrders, spoiledIngredients, spoiledProducts, transferSuggestions } from "@/data/owner/operations";
import { formatINR, formatINRCompact, formatNum } from "@/lib/format";
import { getBOM, getCloudKitchenIngredientInventory, getCloudKitchenPredictions, getInventoryHealth, getProcurementBudget, getProductionPlan, getStorePredictions, getTomorrowForecast, type Rag } from "@/services/forecastService";
import { ChartDateFilter, ControlledDrawer, DataTable, DetailsDrawer, Note, PageHeader, Panel, RagDot, StatTile, axisProps, tooltipStyle } from "@/components/owner/ui";
import { PriorityActionList } from "@/components/owner/PriorityActions";
import { ProductionForecastDrawer } from "@/components/owner/ProductionForecastDrawer";
import { EscalationsPanel, ExceptionsHome, StockControlPanel } from "@/components/owner/StockControl";

const tabs = [
  { value: "exceptions", label: "Exceptions" },
  { value: "escalations", label: "Escalations" },
  { value: "forecast", label: "Trends & Forecast" },
  { value: "stores", label: "Stores" },
  { value: "kitchens", label: "Cloud Kitchens" },
  { value: "inventory", label: "Inventory" },
  { value: "actions", label: "Priority Actions" },
  { value: "waste", label: "Waste & Movement" },
  { value: "analytics", label: "Analytics" },
];

export default function Operations() {
  const { done, markDone, log, prices, setPrice, resetPrices, viewLevel, setViewLevel } = useOwner();
  const inv = getInventoryHealth();
  const plan = getProductionPlan(1);
  const tmr = getTomorrowForecast();
  const stores = getStorePredictions(1);
  const kitchens = getCloudKitchenPredictions(1);
  const [selectedStore, setSelectedStore] = useState(stores[0]?.outletId ?? "sdn");
  const [selectedKitchen, setSelectedKitchen] = useState(kitchens[0]?.id ?? "ck-south");
  const [inventoryFilter, setInventoryFilter] = useState<Rag>("red");
  const [spoilageDays, setSpoilageDays] = useState(30);
  const [ingredientDays, setIngredientDays] = useState(30);
  const [delayDays, setDelayDays] = useState(30);
  const [bomProduct, setBomProduct] = useState("belgian");
  const [bomScope, setBomScope] = useState<string>("ind");
  const [planDrawer, setPlanDrawer] = useState<"store" | "kitchen" | null>(null);
  const [tileDetail, setTileDetail] = useState<"production" | "confidence" | "surge" | "exceptions" | null>(null);

  const selectedStoreData = stores.find((store) => store.outletId === selectedStore) ?? stores[0];
  const storeInventory = inv.rows.filter((row) => row.outletId === selectedStore);
  const kitchenInventory = getCloudKitchenIngredientInventory(selectedKitchen);
  const selectedKitchenData = kitchens.find((kitchen) => kitchen.id === selectedKitchen) ?? kitchens[0];
  const bomUnits = useMemo(() => {
    const productPlan = plan.find((item) => item.productId === bomProduct);
    if (!productPlan) return 0;
    if (bomScope === "all") return productPlan.units;
    return productPlan.outlets.find((outlet) => outlet.outletId === bomScope)?.units ?? 0;
  }, [plan, bomProduct, bomScope]);
  const bom = getBOM(bomProduct, bomUnits, prices);
  const budget = getProcurementBudget(prices);
  const scaledSpoilage = spoiledProducts.map((item) => ({ ...item, units: Math.max(1, Math.round(item.units * spoilageDays / 30)) }));
  const scaledIngredients = spoiledIngredients.map((item) => ({ ...item, ordered: Math.max(1, Math.round(item.ordered * ingredientDays / 30)), used: Math.max(1, Math.round(item.used * ingredientDays / 30)), spoiled: Math.max(1, Math.round(item.spoiled * ingredientDays / 30)) }));
  const scaledDelays = delayedOrders.map((item) => ({ ...item, m10: Math.max(1, Math.round(item.m10 * delayDays / 30)), m15: Math.max(1, Math.round(item.m15 * delayDays / 30)), m20: Math.max(1, Math.round(item.m20 * delayDays / 30)) }));
  const scaledSpoiledTotal = scaledSpoilage.reduce((sum, item) => sum + item.units, 0);
  const scaledSpoiledCost = scaledSpoilage.reduce((sum, item) => sum + item.units * productById(item.productId).unitCost, 0);
  const scaledDelayedTotal = scaledDelays.reduce((sum, item) => sum + item.m10 + item.m15 + item.m20, 0);
  const inventoryRows = inv.rows.filter((row) => row.rag === inventoryFilter);
  const inventorySummary = (["red", "amber", "green"] as const).map((rag) => {
    const rows = inv.rows.filter((row) => row.rag === rag);
    return { rag, count: rows.length, stores: new Set(rows.map((row) => row.outletId)).size, capital: rows.reduce((sum, row) => sum + row.capital, 0) };
  });
  const selectedSummary = inventorySummary.find((item) => item.rag === inventoryFilter);
  const statusMeta: Record<Rag, { label: string; description: string; action: string }> = {
    red: { label: "Red · Urgent", description: "Under 40% of tomorrow's requirement", action: "Refill or transfer now" },
    amber: { label: "Orange · Watch", description: "40–80% of tomorrow's requirement", action: "Resolve before end of day" },
    green: { label: "Green · Healthy", description: "At least 80% of tomorrow's requirement", action: "No action needed" },
  };

  const runTransfer = (id: string) => {
    const transfer = transferSuggestions.find((item) => item.id === id);
    if (!transfer) return;
    const text = `Transfer of ${transfer.units} ${productById(transfer.productId).name} from ${outletById(transfer.from).name} to ${outletById(transfer.to).name}`;
    markDone(id);
    log({ type: "Transfer", action: text, store: outletById(transfer.from).name, status: "Notified" });
    toast.success("Notification sent to store", { description: `${outletById(transfer.from).name} will pack the items and hand them to a delivery partner.` });
  };

  return (
    <div className="space-y-5">
      <PageHeader title="Operations" subtitle="Store health, kitchen readiness and tomorrow's production plan" actions={<div className="flex items-center gap-2"><span className="hidden rounded-full border bg-muted/50 px-2.5 py-1 text-[11px] font-medium text-muted-foreground sm:inline">Stock: near real-time · Sales: previous day</span><Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setViewLevel(viewLevel === "leadership" ? "analyst" : "leadership")}>{viewLevel === "leadership" ? "Leadership view" : "Analyst view"}</Button></div>} />
      <Tabs defaultValue="exceptions" className="space-y-5">
        <div className="max-w-full overflow-x-auto scrollbar-thin">
          <TabsList className="h-9">
            {tabs.map((tab) => <TabsTrigger key={tab.value} value={tab.value} className="whitespace-nowrap px-3 text-xs sm:px-4 sm:text-[13px]">{tab.label}</TabsTrigger>)}
          </TabsList>
        </div>

        <TabsContent value="forecast" className="space-y-5">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatTile label="Tomorrow's production" value={`${tmr.units} units`} hint={`${formatINRCompact(tmr.revenue)} predicted revenue`} tone="green" onClick={() => setTileDetail("production")} />
            <StatTile label="Forecast confidence" value={`${Math.round(tmr.confidence * 100)}%`} hint="High confidence" onClick={() => setTileDetail("confidence")} />
            <StatTile label="Demand vs baseline" value={`+${tmr.surgePct.toFixed(1)}%`} hint="Rain and Friday demand" tone="amber" onClick={() => setTileDetail("surge")} />
            <StatTile label="Inventory exceptions" value={`${inv.urgentProducts}`} hint={`${inv.outletsAtRisk} outlets need attention`} tone="red" onClick={() => setTileDetail("exceptions")} />
          </div>
          <ControlledDrawer open={tileDetail !== null} onOpenChange={(open) => { if (!open) setTileDetail(null); }}
            title={tileDetail === "production" ? "Tomorrow's production" : tileDetail === "confidence" ? "Forecast confidence" : tileDetail === "surge" ? "Demand vs baseline" : "Inventory exceptions"}
            description={tileDetail === "production" ? `${tmr.units} units · ${formatINRCompact(tmr.revenue)} predicted revenue` : tileDetail === "confidence" ? `${Math.round(tmr.confidence * 100)}% overall confidence for tomorrow` : tileDetail === "surge" ? `+${tmr.surgePct.toFixed(1)}% above the typical day baseline` : `${inv.urgentProducts} urgent stock positions across ${inv.outletsAtRisk} outlets`}>
            {tileDetail === "production" && <div className="space-y-5">
              <DataTable columns={[{ key: "p", label: "Product" }, { key: "u", label: "Units", align: "right" }, { key: "r", label: "Revenue", align: "right" }]}
                rows={plan.map((productPlan) => ({ p: productPlan.name, u: productPlan.units, r: formatINR(productPlan.units * productById(productPlan.productId).price) }))} />
              <Panel title="Channel split" subtitle="Where tomorrow's demand comes from">
                <DataTable columns={[{ key: "c", label: "Channel" }, { key: "u", label: "Units", align: "right" }, { key: "s", label: "Share", align: "right" }]}
                  rows={tmr.byChannel.map((channel) => ({ c: channel.name, u: channel.units, s: `${((channel.units / tmr.units) * 100).toFixed(1)}%` }))} />
              </Panel>
            </div>}
            {tileDetail === "confidence" && <div className="space-y-5">
              <Note>Confidence reflects how stable each location's demand has been over the last 30 days. Kitchens with steadier order patterns score higher.</Note>
              <DataTable columns={[{ key: "n", label: "Location" }, { key: "t", label: "Type" }, { key: "u", label: "Units", align: "right" }, { key: "c", label: "Confidence", align: "right" }]}
                rows={[...stores.map((store) => ({ n: store.name, t: "Store", u: store.units, c: `${store.confidence}%` })), ...kitchens.map((kitchen) => ({ n: kitchen.name, t: "Cloud kitchen", u: kitchen.units, c: `${kitchen.confidence}%` }))]} />
            </div>}
            {tileDetail === "surge" && <div className="space-y-5">
              <Note>Tomorrow's demand is {tmr.surgePct.toFixed(1)}% above the baseline of a typical day. Key drivers: rain expected in Bengaluru and Friday evening dessert demand. Production and procurement plans already include this uplift.</Note>
              <DataTable columns={[{ key: "c", label: "Channel" }, { key: "u", label: "Tomorrow", align: "right" }, { key: "s", label: "Share", align: "right" }]}
                rows={tmr.byChannel.map((channel) => ({ c: channel.name, u: channel.units, s: `${((channel.units / tmr.units) * 100).toFixed(1)}%` }))} />
            </div>}
            {tileDetail === "exceptions" && <div className="space-y-5">
              <Note>These stock positions are below 40% of tomorrow's requirement. Refill from the central kitchen or transfer from a nearby store before tonight.</Note>
              <DataTable columns={[{ key: "o", label: "Store" }, { key: "p", label: "Product" }, { key: "h", label: "On hand", align: "right" }, { key: "n", label: "Tomorrow", align: "right" }, { key: "r", label: "Refill", align: "right" }]}
                rows={inv.rows.filter((row) => row.rag === "red").map((row) => ({ o: row.outlet, p: row.product, h: row.onHand, n: row.need, r: row.refill }))} />
            </div>}
          </ControlledDrawer>
          <div className="grid gap-5 xl:grid-cols-3">
            <Panel title="Forecast → Production" subtitle={`Tomorrow: ${tmr.units} units to produce`} className="xl:col-span-2" action={
              <ProductionForecastDrawer />
            }>
              <div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={plan.map((productPlan) => ({ name: productPlan.name.split(" ")[0], ...Object.fromEntries(productPlan.outlets.map((outlet) => [outletById(outlet.outletId).name.split(" ")[0] ?? outletById(outlet.outletId).name, outlet.units])) }))} margin={{ left: -16 }}>
                <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" {...axisProps} interval="preserveStartEnd" minTickGap={28} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} /><YAxis {...axisProps} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(var(--muted))" }} /><Legend wrapperStyle={{ fontSize: 11 }} />
                {outlets.map((outlet, index) => <Bar key={outlet.id} dataKey={outlet.name.split(" ")[0] ?? outlet.name} stackId="a" fill={`hsl(var(--chart-${(index % 5) + 1}))`} fillOpacity={index >= 5 ? 0.55 : 1} />)}
              </BarChart></ResponsiveContainer></div>
            </Panel>
            <Panel title="Channel split for tomorrow">
              <ul className="space-y-3">
                {tmr.byChannel.map((channel) => (
                  <li key={channel.id}>
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">{channel.name}</span><b className="tabular-nums">{channel.units} units</b></div>
                    <div className="mt-1 h-2 rounded-full bg-muted"><div className="h-full rounded-full" style={{ width: `${Math.min(100, (channel.units / tmr.units) * 250)}%`, background: channelById(channel.id).color }} /></div>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
          <div className="grid gap-5 xl:grid-cols-2">
            <Panel title="Store demand prediction" subtitle="Tomorrow's units and risk by outlet">
              <div className="space-y-2">
                {stores.map((store) => <div key={store.outletId} className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 rounded-lg border px-3 py-2.5">
                  <div className="min-w-0"><div className="truncate text-[13px] font-semibold">{store.name}</div><div className="text-[11px] text-muted-foreground">{store.confidence}% confidence · {store.red} urgent items</div></div>
                  <span className={cn("text-xs font-semibold", store.change >= 0 ? "text-success" : "text-destructive")}>{store.change >= 0 ? "+" : ""}{store.change}%</span>
                  <b className="w-16 text-right text-sm tabular-nums">{store.units}</b>
                </div>)}
              </div>
            </Panel>
            <Panel title="Cloud kitchen readiness" subtitle="Planned output against capacity">
              <div className="space-y-3">{kitchens.map((kitchen) => <div key={kitchen.id} className="rounded-lg border p-3">
                <div className="flex items-start justify-between gap-3"><div className="min-w-0"><div className="truncate text-[13px] font-semibold">{kitchen.name}</div><div className="text-[11px] text-muted-foreground">{kitchen.area} · dispatch {kitchen.dispatch}</div></div><b className="shrink-0 text-sm">{kitchen.units} units</b></div>
                <div className="mt-2 h-2 rounded-full bg-muted"><div className={cn("h-full rounded-full", kitchen.utilization > 85 ? "bg-warning" : "bg-success")} style={{ width: `${Math.min(100, kitchen.utilization)}%` }} /></div>
                <div className="mt-1 flex justify-between text-[11px] text-muted-foreground"><span>{kitchen.utilization}% capacity</span><span>{kitchen.ingredientRisk} ingredient risks</span></div>
              </div>)}</div>
            </Panel>
          </div>
        </TabsContent>

        <TabsContent value="stores" className="space-y-5">
          <Panel title="Store predictions" subtitle="Select a store to inspect tomorrow's product demand and inventory">
            <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">{stores.map((store) => <Button key={store.outletId} variant="outline" onClick={() => setSelectedStore(store.outletId)} className={cn("h-auto justify-start p-3 text-left", selectedStore === store.outletId && "border-primary bg-accent")}>
              <Store className="mr-3 h-4 w-4 shrink-0" /><span className="min-w-0 flex-1"><span className="block truncate text-[13px] font-semibold">{store.name}</span><span className="block text-[11px] font-normal text-muted-foreground">{store.units} units · {formatINRCompact(store.revenue)} · {store.confidence}% confidence</span></span><RagDot rag={store.risk} />
            </Button>)}</div>
          </Panel>
          {selectedStoreData && <div className="grid gap-5 xl:grid-cols-3">
            <Panel title={`${selectedStoreData.name} · tomorrow`} subtitle="Clean store-level prediction" className="xl:col-span-1">
              <div className="grid grid-cols-2 gap-3"><StatTile label="Tomorrow's plan" onClick={() => setPlanDrawer("store")} value={`${selectedStoreData.units}`} hint={`${selectedStoreData.change >= 0 ? "+" : ""}${selectedStoreData.change}% vs baseline`} /><StatTile label="Revenue" value={formatINRCompact(selectedStoreData.revenue)} hint={`${selectedStoreData.confidence}% confidence`} tone="green" /></div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs"><div className="rounded-lg bg-destructive-bg p-2"><b className="block text-destructive">{selectedStoreData.red}</b>Urgent</div><div className="rounded-lg bg-warning-bg p-2"><b className="block text-warning">{selectedStoreData.amber}</b>Watch</div><div className="rounded-lg bg-success-bg p-2"><b className="block text-success">{selectedStoreData.green}</b>Healthy</div></div>
            </Panel>
            <Panel title="Product inventory & prediction" subtitle="Finished goods at this store" className="xl:col-span-2">
              <DataTable columns={[{ key: "p", label: "Product" }, { key: "s", label: "Status" }, { key: "h", label: "On hand", align: "right" }, { key: "n", label: "Tomorrow", align: "right" }, { key: "r", label: "Refill", align: "right" }]}
                rows={storeInventory.map((row) => ({ p: row.product, s: <span className="inline-flex items-center gap-1.5"><RagDot rag={row.rag} />{statusMeta[row.rag].label.split(" · ")[0]}</span>, h: row.onHand, n: row.need, r: row.refill }))} />
            </Panel>
          </div>}
          {selectedStoreData && (() => {
            const rows = plan.map((p) => { const units = p.outlets.find((o) => o.outletId === selectedStore)?.units ?? 0; const prod = productById(p.productId); const inv = storeInventory.find((r) => r.product === p.name); return { name: p.name, units, revenue: units * prod.price, shelf: prod.shelfLifeHrs, onHand: inv?.onHand, refill: inv?.refill }; }).filter((r) => r.units > 0).sort((a, b) => b.units - a.units);
            const total = rows.reduce((a, r) => a + r.units, 0) || 1;
            return <ControlledDrawer open={planDrawer === "store"} onOpenChange={(v) => !v && setPlanDrawer(null)} title={`Tomorrow's plan · ${selectedStoreData.name}`} description="What this store should stock and sell tomorrow">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-x-5 gap-y-1 rounded-md border bg-muted/40 px-3 py-2 text-xs"><span><b>{selectedStoreData.units}</b> units</span><span><b>{formatINRCompact(selectedStoreData.revenue)}</b> predicted revenue</span><span><b>{selectedStoreData.confidence}%</b> confidence</span><span className={selectedStoreData.change >= 0 ? "text-success" : "text-destructive"}>{selectedStoreData.change >= 0 ? "+" : ""}{selectedStoreData.change}% vs baseline</span></div>
                <Note>Demand drivers: rain expected in Bengaluru and Friday evening dessert demand. {selectedStoreData.red} products are urgent — refill before opening.</Note>
                <DataTable columns={[{ key: "p", label: "Product" }, { key: "u", label: "Units", align: "right" }, { key: "s", label: "Share", align: "right" }, { key: "h", label: "On hand", align: "right" }, { key: "f", label: "Refill", align: "right" }, { key: "r", label: "Revenue", align: "right" }, { key: "l", label: "Shelf life", align: "right" }]}
                  rows={rows.map((r) => ({ p: r.name, u: <b>{r.units}</b>, s: `${Math.round((r.units / total) * 100)}%`, h: r.onHand ?? "—", f: r.refill ?? "—", r: formatINRCompact(r.revenue), l: `${r.shelf}h` }))} />
              </div>
            </ControlledDrawer>;
          })()}
        </TabsContent>

        <TabsContent value="kitchens" className="space-y-5">
          <Panel title="Cloud kitchen predictions" subtitle="Pick a kitchen to inspect tomorrow's production and ingredient readiness" action={
            <Select value={selectedKitchen} onValueChange={setSelectedKitchen}>
              <SelectTrigger className="h-9 w-64 text-xs"><Warehouse className="mr-2 h-4 w-4 shrink-0" /><SelectValue /></SelectTrigger>
              <SelectContent>{kitchens.map((kitchen) => <SelectItem key={kitchen.id} value={kitchen.id}><span className="font-medium">{kitchen.name}</span><span className="ml-2 text-[11px] text-muted-foreground">{kitchen.units} units · {kitchen.utilization}%</span></SelectItem>)}</SelectContent>
            </Select>
          }><div className="text-xs text-muted-foreground">{kitchens.length} kitchens · {kitchens.reduce((s, k) => s + k.units, 0)} units planned for tomorrow</div></Panel>
          {selectedKitchenData && <div className="grid gap-5 xl:grid-cols-3">
            <Panel title={selectedKitchenData.name} subtitle={`${selectedKitchenData.area} · serves ${selectedKitchenData.serves.join(", ")}`}>
              <div className="grid grid-cols-2 gap-3"><StatTile label="Tomorrow's plan" onClick={() => setPlanDrawer("kitchen")} value={`${selectedKitchenData.units}`} hint={`+${selectedKitchenData.change}% demand`} tone="green" /><StatTile label="Capacity use" value={`${selectedKitchenData.utilization}%`} hint={`${selectedKitchenData.capacity} unit capacity`} tone={selectedKitchenData.utilization > 85 ? "amber" : "default"} /></div>
              <div className="mt-3 rounded-lg border p-3 text-xs"><div className="flex justify-between"><span className="text-muted-foreground">First dispatch</span><b>{selectedKitchenData.dispatch}</b></div><div className="mt-2 flex justify-between"><span className="text-muted-foreground">Forecast confidence</span><b>{selectedKitchenData.confidence}%</b></div></div>
            </Panel>
            <Panel title="Ingredient inventory" subtitle="Required for tomorrow's plan" className="xl:col-span-2">
              <DataTable columns={[{ key: "i", label: "Ingredient" }, { key: "s", label: "Status" }, { key: "h", label: "On hand", align: "right" }, { key: "n", label: "Required", align: "right" }, { key: "r", label: "Procure", align: "right" }]}
                rows={kitchenInventory.map((row) => ({ i: row.ingredient, s: <span className="inline-flex items-center gap-1.5"><RagDot rag={row.rag} />{statusMeta[row.rag].label.split(" · ")[0]}</span>, h: `${row.onHand} ${row.unit}`, n: `${row.required} ${row.unit}`, r: `${row.refill} ${row.unit}` }))} />
            </Panel>
          </div>}
          {selectedKitchenData && (() => {
            const w = plan.map((p) => p.units); const sum = w.reduce((a, b) => a + b, 0) || 1;
            let left = selectedKitchenData.units;
            const rows = plan.map((p, i) => { const units = i === plan.length - 1 ? left : Math.round((p.units / sum) * selectedKitchenData.units); left -= units; const prod = productById(p.productId); return { name: p.name, units: Math.max(0, units), revenue: Math.max(0, units) * prod.price, shelf: prod.shelfLifeHrs }; }).filter((r) => r.units > 0).sort((a, b) => b.units - a.units);
            return <ControlledDrawer open={planDrawer === "kitchen"} onOpenChange={(v) => !v && setPlanDrawer(null)} title={`Tomorrow's plan · ${selectedKitchenData.name}`} description={`Production for ${selectedKitchenData.serves.join(", ")}`}>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-x-5 gap-y-1 rounded-md border bg-muted/40 px-3 py-2 text-xs"><span><b>{selectedKitchenData.units}</b> units</span><span><b>{selectedKitchenData.utilization}%</b> of {selectedKitchenData.capacity} capacity</span><span><b>{selectedKitchenData.confidence}%</b> confidence</span><span>First dispatch <b>{selectedKitchenData.dispatch}</b></span></div>
                {selectedKitchenData.ingredientRisk > 0 && <Note tone="warning">{selectedKitchenData.ingredientRisk} ingredients are short for this plan — procure before the morning batch.</Note>}
                <DataTable columns={[{ key: "p", label: "Product" }, { key: "u", label: "Units to produce", align: "right" }, { key: "r", label: "Value", align: "right" }, { key: "l", label: "Shelf life", align: "right" }]}
                  rows={rows.map((r) => ({ p: r.name, u: <b>{r.units}</b>, r: formatINRCompact(r.revenue), l: `${r.shelf}h` }))} />
                <DataTable columns={[{ key: "i", label: "Ingredient" }, { key: "n", label: "Required", align: "right" }, { key: "h", label: "On hand", align: "right" }, { key: "r", label: "Procure", align: "right" }]}
                  rows={kitchenInventory.map((row) => ({ i: row.ingredient, n: `${row.required} ${row.unit}`, h: `${row.onHand} ${row.unit}`, r: `${row.refill} ${row.unit}` }))} />
              </div>
            </ControlledDrawer>;
          })()}
        </TabsContent>

        <TabsContent value="inventory" className="space-y-5">
          <Panel title="Store inventory health" subtitle="Select a status to see only matching finished-goods positions across stores">
            <div className="mb-4 flex items-start gap-3 rounded-lg border border-destructive/35 bg-destructive-bg px-3 py-3"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" /><div className="min-w-0"><div className="text-xs font-bold text-destructive">Immediate attention required</div><p className="mt-0.5 text-xs text-foreground">{inv.urgentProducts} stock positions across {inv.outletsAtRisk} high-risk outlets are below 40% cover.</p></div></div>
            <div className="grid gap-3 sm:grid-cols-3">{inventorySummary.map((item) => { const Icon = item.rag === "red" ? AlertTriangle : item.rag === "amber" ? Clock3 : ShieldCheck; const meta = statusMeta[item.rag]; return <div key={item.rag} className="relative"><StatTile label={meta.label} value={`${item.count} items`} hint={`${item.stores} stores · ${meta.action}`} tone={item.rag} selected={inventoryFilter === item.rag} onClick={() => setInventoryFilter(item.rag)} /><Icon className={cn("pointer-events-none absolute right-4 top-4 h-4 w-4", item.rag === "red" ? "text-destructive" : item.rag === "amber" ? "text-warning" : "text-success")} /></div>; })}</div>
            <div className="mt-5 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3 border-b pb-3"><div className="min-w-0"><div className="flex items-center gap-2 text-sm font-semibold"><RagDot rag={inventoryFilter} />{statusMeta[inventoryFilter].label}</div><p className="mt-0.5 text-xs text-muted-foreground">{statusMeta[inventoryFilter].description}</p></div><div className="text-right text-xs text-muted-foreground">{inventoryRows.length} items · {selectedSummary?.stores ?? 0} stores · {formatINRCompact(selectedSummary?.capital ?? 0)}</div></div>
            <div className="mt-3"><DataTable columns={[{ key: "o", label: "Store" }, { key: "p", label: "Product" }, { key: "cover", label: "Cover", align: "right" }, { key: "h", label: "On hand", align: "right" }, { key: "n", label: "Tomorrow", align: "right" }, { key: "r", label: "Refill", align: "right" }]}
              rows={inventoryRows.map((row) => ({ o: <span className="flex items-center gap-1.5 font-medium"><RagDot rag={row.rag} />{row.outlet}</span>, p: row.product, cover: `${Math.round((row.onHand / Math.max(1, row.need)) * 100)}%`, h: row.onHand, n: row.need, r: row.refill }))} /></div>
          </Panel>
          <Panel title="Bill of Materials" subtitle="Recipe costs and tomorrow's procurement requirement" action={<Button variant="ghost" size="sm" className="h-8 gap-1 text-xs" onClick={resetPrices}><RotateCcw className="h-3.5 w-3.5" />Reset prices</Button>}>
            <div className="flex flex-col gap-3 sm:flex-row"><Select value={bomProduct} onValueChange={setBomProduct}><SelectTrigger className="sm:w-64"><SelectValue /></SelectTrigger><SelectContent>{products.map((product) => <SelectItem key={product.id} value={product.id}>{product.name}</SelectItem>)}</SelectContent></Select><Select value={bomScope} onValueChange={setBomScope}><SelectTrigger className="sm:w-56"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All outlets</SelectItem>{outlets.map((outlet) => <SelectItem key={outlet.id} value={outlet.id}>{outlet.name}</SelectItem>)}</SelectContent></Select></div>
            <div className="mt-4 grid gap-4 xl:grid-cols-4"><div className="overflow-x-auto rounded-lg border scrollbar-thin xl:col-span-3"><table className="w-full min-w-[620px] text-sm"><thead className="bg-muted/60 text-xs text-muted-foreground"><tr><th className="px-3 py-2 text-left font-medium">Ingredient</th><th className="px-3 py-2 text-right font-medium">Per unit</th><th className="px-3 py-2 text-right font-medium">× Units</th><th className="px-3 py-2 text-right font-medium">Total qty</th><th className="px-3 py-2 text-right font-medium">Price / unit</th><th className="px-3 py-2 text-right font-medium">Cost</th></tr></thead><tbody>{bom.lines.map((line) => <tr key={line.ingredientId} className="border-t"><td className="px-3 py-2">{line.name}</td><td className="px-3 py-2 text-right tabular-nums">{line.perUnit} {line.unit === "L" ? "ml" : "g"}</td><td className="px-3 py-2 text-right tabular-nums">{bom.units}</td><td className="px-3 py-2 text-right tabular-nums">{line.totalQty.toFixed(2)} {line.unit}</td><td className="px-3 py-2 text-right"><div className="inline-flex items-center gap-1"><span className="text-muted-foreground">₹</span><Input type="number" min={0} value={line.price} onChange={(event) => setPrice(line.ingredientId, Math.max(0, Number(event.target.value) || 0))} className="h-8 w-20 text-right" aria-label={`${line.name} price`} /><span className="text-xs text-muted-foreground">/{line.unit}</span></div></td><td className="px-3 py-2 text-right font-semibold tabular-nums">{formatINR(line.cost)}</td></tr>)}<tr className="border-t bg-muted/40"><td className="px-3 py-2 font-semibold" colSpan={5}>Total for {bom.units} × {bom.product.name}</td><td className="px-3 py-2 text-right font-bold tabular-nums">{formatINR(bom.total)}</td></tr></tbody></table></div><div className="space-y-3"><StatTile label="This product's procurement" value={formatINR(bom.total)} hint={`${bom.units} units`} /><StatTile label="Total procurement budget" value={formatINR(budget.total)} hint={`All ${products.length} products`} tone="green" /></div></div>
          </Panel>
        </TabsContent>

        <TabsContent value="actions" className="space-y-5"><Panel title="Priority Action Workspace" subtitle="P1 = financial impact · P2 = penalty risk · P3 = shelf life risk"><PriorityActionList /></Panel></TabsContent>

        <TabsContent value="waste" className="space-y-5">
          <div className="grid gap-5 xl:grid-cols-3">
            <Panel title="Spoiled products" subtitle={`${scaledSpoiledTotal} units · ${formatINRCompact(scaledSpoiledCost)} · ${spoilageDays} days`} action={<div className="flex flex-wrap items-center justify-end gap-2"><ChartDateFilter onChange={(range) => setSpoilageDays(range.days)} /><DetailsDrawer title="Spoiled products"><DataTable columns={[{ key: "p", label: "Product" }, { key: "u", label: "Units", align: "right" }, { key: "c", label: "Cost", align: "right" }, { key: "r", label: "Reason" }]} rows={scaledSpoilage.map((item) => ({ p: productById(item.productId).name, u: item.units, c: formatINR(item.units * productById(item.productId).unitCost), r: item.reason }))} /></DetailsDrawer></div>}><div className="h-56"><ResponsiveContainer width="100%" height="100%"><BarChart data={scaledSpoilage.map((item) => ({ name: productById(item.productId).name.split(" ")[0], units: item.units }))} layout="vertical" margin={{ left: 4, right: 8 }}><XAxis type="number" {...axisProps} /><YAxis type="category" dataKey="name" {...axisProps} width={70} /><Tooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(var(--muted))" }} /><Bar dataKey="units" fill="hsl(var(--destructive))" fillOpacity={0.75} radius={[0, 4, 4, 0]} /></BarChart></ResponsiveContainer></div></Panel>
            <Panel title="Kitchen ingredient spoilage" subtitle={`Ordered vs used vs spoiled · ${ingredientDays} days`} action={<ChartDateFilter onChange={(range) => setIngredientDays(range.days)} />}><ul className="space-y-3">{scaledIngredients.map((item) => { const ingredient = ingredients.find((candidate) => candidate.id === item.ingredientId); if (!ingredient) return null; return <li key={item.ingredientId}><div className="flex justify-between text-xs"><span className="font-medium">{ingredient.name}</span><span className="text-muted-foreground">{item.ordered} {ingredient.unit} ordered · <b className="text-destructive">{item.spoiled} spoiled</b></span></div><div className="mt-1 flex h-2 overflow-hidden rounded-full bg-muted"><div className="bg-success" style={{ width: `${(item.used / item.ordered) * 100}%` }} /><div className="bg-destructive" style={{ width: `${(item.spoiled / item.ordered) * 100}%` }} /></div></li>; })}</ul></Panel>
            <Panel title="Delayed orders by channel" subtitle={`${scaledDelayedTotal} SLA breaches · ${delayDays} days`} action={<div className="flex flex-wrap items-center justify-end gap-2"><ChartDateFilter onChange={(range) => setDelayDays(range.days)} /><DetailsDrawer title="Delayed orders"><DataTable columns={[{ key: "c", label: "Channel" }, { key: "a", label: "10+ min", align: "right" }, { key: "b", label: "15+ min", align: "right" }, { key: "d", label: "20+ min", align: "right" }, { key: "r", label: "Main reason" }]} rows={scaledDelays.map((delay) => ({ c: channelById(delay.channel).name, a: delay.m10, b: delay.m15, d: delay.m20, r: delay.reason }))} /></DetailsDrawer></div>}><div className="h-56"><ResponsiveContainer width="100%" height="100%"><BarChart data={scaledDelays.map((delay) => ({ name: channelById(delay.channel).name.split(" ")[0], "10+ min": delay.m10, "15+ min": delay.m15, "20+ min": delay.m20 }))} margin={{ left: -18 }}><XAxis dataKey="name" {...axisProps} /><YAxis {...axisProps} /><Tooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(var(--muted))" }} /><Legend wrapperStyle={{ fontSize: 11 }} /><Bar dataKey="10+ min" stackId="a" fill="hsl(var(--warning))" fillOpacity={0.6} /><Bar dataKey="15+ min" stackId="a" fill="hsl(var(--chart-1))" /><Bar dataKey="20+ min" stackId="a" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div></Panel>
          </div>
          <Note>Spoilage and delay data feed back into tomorrow's production forecast.</Note>
          <Panel title="Store-to-store transfers" subtitle="Move surplus to stores that will run short before it spoils"><div className="grid gap-3 md:grid-cols-2">{transferSuggestions.map((transfer) => <div key={transfer.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border p-3"><div className="min-w-0"><div className="truncate text-[13px] font-semibold">{transfer.units} × {productById(transfer.productId).name}</div><div className="mt-1 flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground"><span className="truncate">{outletById(transfer.from).name}</span><ArrowRight className="h-3 w-3 shrink-0" /><span className="truncate">{outletById(transfer.to).name}</span></div><div className="mt-1 text-xs">Loss saved: <b className="text-success">{formatINR(transfer.lossSaved)}</b></div></div>{done[transfer.id] ? <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-success"><CheckCircle2 className="h-4 w-4" />Notified</span> : <Button size="sm" className="h-8 shrink-0 text-xs" onClick={() => runTransfer(transfer.id)}>Execute</Button>}</div>)}</div></Panel>
          <Panel title="Dispatch plan" subtitle={`${cloudKitchens.length} cloud kitchens → stores, tomorrow morning`} action={<DetailsDrawer title="Dispatch plan" description="Units per store per product"><DataTable columns={[{ key: "o", label: "Store" }, ...products.map((product) => ({ key: product.id, label: product.name.split(" ")[0] ?? product.name, align: "right" as const })), { key: "t", label: "Total", align: "right" }]} rows={outlets.map((outlet) => ({ o: outlet.name, ...Object.fromEntries(plan.map((productPlan) => [productPlan.productId, productPlan.outlets.find((item) => item.outletId === outlet.id)?.units ?? 0])), t: <b>{plan.reduce((total, productPlan) => total + (productPlan.outlets.find((item) => item.outletId === outlet.id)?.units ?? 0), 0)}</b> }))} /></DetailsDrawer>}><DataTable columns={[{ key: "o", label: "Store" }, { key: "k", label: "Cloud kitchen" }, { key: "slot", label: "Dispatch" }, { key: "u", label: "Units", align: "right" }, { key: "s", label: "Status" }]} rows={outlets.map((outlet, index) => ({ o: outlet.name, k: kitchens[index % kitchens.length]?.name ?? "Central kitchen", slot: ["5:30 AM", "6:00 AM", "6:00 AM", "6:30 AM", "6:30 AM", "7:00 AM", "4:45 AM"][index], u: formatNum(plan.reduce((total, productPlan) => total + (productPlan.outlets.find((item) => item.outletId === outlet.id)?.units ?? 0), 0)), s: <span className="badge-info rounded px-2 py-0.5 text-[11px] font-semibold">Scheduled</span> }))} /></Panel>
        </TabsContent>

        <TabsContent value="exceptions" className="space-y-5"><ExceptionsHome /></TabsContent>
        <TabsContent value="escalations" className="space-y-5"><EscalationsPanel /></TabsContent>
        <TabsContent value="analytics" className="space-y-5">
          {viewLevel === "analyst" ? <StockControlPanel /> : (
            <Panel title="Detailed tables are hidden in Leadership view" subtitle="Your profile is set to the exceptions-first view.">
              <Button size="sm" onClick={() => setViewLevel("analyst")}>Switch to Analyst view</Button>
            </Panel>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

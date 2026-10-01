import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AlertOctagon, BellRing, CheckCircle2, ClipboardCheck, PackageX, Settings2, ShieldAlert, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOwner } from "@/contexts/OwnerContext";
import { productById, products } from "@/data/owner/catalog";
import { damageReports, deliveriesInTransit, locationById, stockLocations, stockRows, stockStatus, suggestedReorder, type ActivityType, type StockStatus } from "@/data/owner/stockControl";
import { cn } from "@/lib/utils";
import { Chip, DataTable, Note, Panel } from "./ui";

export const statusMeta: Record<StockStatus, { label: string; dot: string; row: string; badge: string }> = {
  green: { label: "Normal", dot: "bg-success", row: "", badge: "border-success/30 bg-success-bg text-success" },
  orange: { label: "Below minimum", dot: "bg-warning", row: "bg-warning-bg/60", badge: "border-warning/30 bg-warning-bg text-warning" },
  red: { label: "Critical", dot: "bg-destructive", row: "bg-destructive-bg/60", badge: "border-destructive/30 bg-destructive-bg text-destructive" },
};

export function StatusBadge({ status, onClick }: { status: StockStatus; onClick?: (() => void) | undefined }) {
  const Cmp = onClick ? "button" : "span";
  return (
    <Cmp onClick={onClick} className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-semibold", statusMeta[status].badge, onClick && "hover:opacity-80")}>
      <span className={cn("h-2 w-2 rounded-full", statusMeta[status].dot)} />{statusMeta[status].label}{onClick && status !== "green" && " · Indent"}
    </Cmp>
  );
}

/** Live stock rows joined with current thresholds and open indents. */
export function useStockView() {
  const { stock, thresholds, indents } = useOwner();
  return useMemo(() => stockRows.map((r) => {
    const t = thresholds[r.productId]!;
    const onHand = stock[r.id] ?? r.onHand;
    const open = indents.find((i) => i.locationId === r.locationId && i.productId === r.productId && i.status !== "Rejected");
    return { ...r, onHand, min: t.min, critical: t.critical, status: stockStatus(onHand, t), reorder: suggestedReorder(onHand, t), openIndent: open, location: locationById(r.locationId), product: productById(r.productId) };
  }), [stock, thresholds, indents]);
}
export type StockViewRow = ReturnType<typeof useStockView>[number];

export function IndentDialog({ row, onClose }: { row: StockViewRow | null; onClose: () => void }) {
  const { raiseIndent } = useOwner();
  const [qty, setQty] = useState(0);
  useEffect(() => { if (row) setQty(row.reorder); }, [row]);
  if (!row) return null;
  return (
    <Dialog open={!!row} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Raise indent</DialogTitle>
          <DialogDescription>{row.product.name} · {row.location.name}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-2 text-center">
          {[["Current stock", row.onHand], ["Minimum", row.min], ["Critical", row.critical]].map(([l, v]) => (
            <div key={l} className="rounded-lg border bg-muted/40 p-2"><div className="text-[11px] text-muted-foreground">{l}</div><div className="font-display text-lg font-bold">{v}</div></div>
          ))}
        </div>
        <div className="flex items-center justify-between gap-2"><StatusBadge status={row.status} /><span className="text-xs text-muted-foreground">Suggested reorder: <b className="text-foreground">{row.reorder} units</b></span></div>
        <label className="text-xs font-medium text-muted-foreground">Quantity<Input type="number" min={1} value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))} className="mt-1" /></label>
        {row.openIndent && <Note tone="warning">An indent for this item is already {row.openIndent.status.toLowerCase()} ({row.openIndent.qty} units).</Note>}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => { raiseIndent(row.locationId, row.productId, qty, row.location.name, row.product.name); toast.success("Indent raised", { description: `${qty} × ${row.product.name} for ${row.location.name}. Escalation timer stopped.` }); onClose(); }}>Raise Indent</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function StockList({ rows, onIndent, limit }: { rows: StockViewRow[]; onIndent: (r: StockViewRow) => void; limit?: number }) {
  const { raiseIndent } = useOwner();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirm, setConfirm] = useState(false);
  const [qtys, setQtys] = useState<Record<string, number>>({});
  const shown = limit ? rows.slice(0, limit) : rows;
  const eligible = rows.filter((r) => !r.openIndent && r.status !== "green");
  const chosen = eligible.filter((r) => selected.has(r.id));
  const allOn = eligible.length > 0 && chosen.length === eligible.length;
  const toggle = (id: string) => setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const openConfirm = () => { setQtys(Object.fromEntries(chosen.map((r) => [r.id, r.reorder]))); setConfirm(true); };
  const submit = () => {
    chosen.forEach((r) => raiseIndent(r.locationId, r.productId, qtys[r.id] ?? r.reorder, r.location.name, r.product.name));
    const units = chosen.reduce((a, r) => a + (qtys[r.id] ?? r.reorder), 0);
    toast.success(`${chosen.length} indents raised`, { description: `${units} units across ${new Set(chosen.map((r) => r.locationId)).size} locations. Escalation timers stopped.` });
    setSelected(new Set()); setConfirm(false);
  };
  if (!rows.length) return <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">Nothing here — all clear.</div>;
  return (
    <>
      {eligible.length > 0 && (
        <div className="mb-2 flex flex-wrap items-center gap-3 rounded-lg border bg-muted/40 px-3 py-2">
          <label className="flex cursor-pointer items-center gap-2 text-xs font-medium"><Checkbox checked={allOn} onCheckedChange={(v) => setSelected(v ? new Set(eligible.map((r) => r.id)) : new Set())} />Select all ({eligible.length})</label>
          <span className="flex-1 text-xs text-muted-foreground">{chosen.length ? `${chosen.length} selected` : "Tick items to raise indents together"}</span>
          {chosen.length > 0 && <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setSelected(new Set())}>Clear</Button>}
          <Button size="sm" className="h-7 text-xs" disabled={!chosen.length} onClick={openConfirm}>Raise {chosen.length || ""} indent{chosen.length === 1 ? "" : "s"}</Button>
        </div>
      )}
      <div className="divide-y rounded-lg border">
        {shown.map((r) => {
          const can = !r.openIndent && r.status !== "green";
          return (
            <div key={r.id} className={cn("flex flex-wrap items-center gap-3 px-3 py-2.5", statusMeta[r.status].row)}>
              {can ? <Checkbox checked={selected.has(r.id)} onCheckedChange={() => toggle(r.id)} aria-label={`Select ${r.product.name} at ${r.location.name}`} /> : <span className="w-4" />}
              <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", statusMeta[r.status].dot)} />
              <div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold">{r.product.name}</div><div className="truncate text-xs text-muted-foreground">{r.location.name} · {r.location.kind === "hub" ? "Hub" : "Store"}</div></div>
              <div className="text-right text-xs tabular-nums"><b className="text-sm text-foreground">{r.onHand}</b> <span className="text-muted-foreground">/ min {r.min} · crit {r.critical}</span></div>
              {r.openIndent ? <Badge variant="outline" className="text-[11px]">Indent {r.openIndent.status.toLowerCase()}</Badge> : can && <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => onIndent(r)}>Raise Indent</Button>}
            </div>
          );
        })}
        {limit && rows.length > limit && <div className="px-3 py-2 text-xs text-muted-foreground">+ {rows.length - limit} more</div>}
      </div>
      <Dialog open={confirm} onOpenChange={setConfirm}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Raise {chosen.length} indents</DialogTitle><DialogDescription>Suggested quantities are pre-filled — adjust any before confirming.</DialogDescription></DialogHeader>
          <div className="max-h-[50vh] divide-y overflow-y-auto rounded-lg border">
            {chosen.map((r) => (
              <div key={r.id} className="flex items-center gap-3 px-3 py-2">
                <span className={cn("h-2 w-2 shrink-0 rounded-full", statusMeta[r.status].dot)} />
                <div className="min-w-0 flex-1"><div className="truncate text-sm font-medium">{r.product.name}</div><div className="truncate text-[11px] text-muted-foreground">{r.location.name} · on hand {r.onHand}</div></div>
                <Input type="number" min={1} className="h-8 w-20 text-right" value={qtys[r.id] ?? r.reorder} onChange={(e) => setQtys((q) => ({ ...q, [r.id]: Math.max(1, Number(e.target.value) || 1) }))} />
              </div>
            ))}
          </div>
          <div className="text-right text-xs text-muted-foreground">Total <b className="text-foreground">{chosen.reduce((a, r) => a + (qtys[r.id] ?? r.reorder), 0)} units</b></div>
          <DialogFooter><Button variant="outline" onClick={() => setConfirm(false)}>Cancel</Button><Button onClick={submit}>Confirm {chosen.length} indents</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

type Tile = "below" | "zero" | "indents" | "transit" | "damage";

/** Leadership landing: counts only, drill-down inline. */
export function ExceptionsHome() {
  const view = useStockView();
  const { indents, decideIndent, log } = useOwner();
  const [tile, setTile] = useState<Tile>("below");
  const [indentRow, setIndentRow] = useState<StockViewRow | null>(null);
  const [loc, setLoc] = useState("all");
  const [prod, setProd] = useState("all");
  const below = view.filter((r) => r.status !== "green" && r.onHand > 0).sort((a, b) => (a.status === b.status ? a.onHand - b.onHand : a.status === "red" ? -1 : 1));
  const zero = view.filter((r) => r.onHand === 0);
  const pending = indents.filter((i) => i.status === "Pending approval");
  const filt = (rows: StockViewRow[]) => rows.filter((r) => (loc === "all" || r.locationId === loc) && (prod === "all" || r.productId === prod));
  const tiles: { id: Tile; label: string; value: number; icon: typeof AlertOctagon; tone: string }[] = [
    { id: "below", label: "Below minimum stock", value: below.length, icon: ShieldAlert, tone: "border-warning/40 bg-warning-bg" },
    { id: "zero", label: "At zero stock", value: zero.length, icon: PackageX, tone: "border-destructive/40 bg-destructive-bg" },
    { id: "indents", label: "Indents pending approval", value: pending.length, icon: ClipboardCheck, tone: "border-info/30 bg-info-bg" },
    { id: "transit", label: "Deliveries in transit", value: deliveriesInTransit.length, icon: Truck, tone: "" },
    { id: "damage", label: "Damage reports to review", value: damageReports.length, icon: AlertOctagon, tone: "" },
  ];
  const active = tiles.find((t) => t.id === tile)!;
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {tiles.map((t) => (
          <button key={t.id} onClick={() => setTile(t.id)} aria-pressed={tile === t.id} className={cn("card-hover p-4 text-left", t.tone, tile === t.id && "ring-2 ring-foreground/25 ring-offset-2 ring-offset-background")}>
            <t.icon className="h-4 w-4 text-muted-foreground" />
            <div className="mt-2 font-display text-3xl font-bold">{t.value}</div>
            <div className="text-xs font-medium text-muted-foreground">{t.label}</div>
          </button>
        ))}
      </div>
      <Panel title={active.label} subtitle="Only items that need a decision. Detailed tables live in Analytics." action={(tile === "below" || tile === "zero") && (
        <div className="flex flex-wrap gap-2">
          <Select value={loc} onValueChange={setLoc}><SelectTrigger className="h-8 w-44 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All locations</SelectItem>{stockLocations.map((l) => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}</SelectContent></Select>
          <Select value={prod} onValueChange={setProd}><SelectTrigger className="h-8 w-44 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All products</SelectItem>{products.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent></Select>
        </div>
      )}>
        {tile === "below" && <StockList rows={filt(below)} onIndent={setIndentRow} />}
        {tile === "zero" && <StockList rows={filt(zero)} onIndent={setIndentRow} />}
        {tile === "indents" && (pending.length ? <div className="divide-y rounded-lg border">{pending.map((i) => { const l = locationById(i.locationId), p = productById(i.productId); return (
          <div key={i.id} className="flex flex-wrap items-center gap-3 px-3 py-2.5"><div className="min-w-0 flex-1"><div className="text-sm font-semibold">{i.qty} × {p.name}</div><div className="text-xs text-muted-foreground">{l.name}</div></div>
            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => { decideIndent(i.id, "Rejected"); log({ type: "Indent", action: `Indent rejected: ${i.qty} × ${p.name} for ${l.name}`, store: l.name, status: "Rejected" }); }}>Reject</Button>
            <Button size="sm" className="h-7 text-xs" onClick={() => { decideIndent(i.id, "Approved"); log({ type: "Indent", action: `Indent approved: ${i.qty} × ${p.name} for ${l.name}`, store: l.name, status: "Approved" }); toast.success("Indent approved", { description: `${l.name} stock updated.` }); }}>Approve</Button>
          </div>); })}</div> : <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">No indents waiting.</div>)}
        {tile === "transit" && <DataTable columns={[{ key: "to", label: "Destination" }, { key: "items", label: "Items", align: "right" }, { key: "eta", label: "ETA", align: "right" }]} rows={deliveriesInTransit.map((d) => ({ to: d.to, items: d.items, eta: d.eta }))} />}
        {tile === "damage" && <DataTable columns={[{ key: "location", label: "Location" }, { key: "product", label: "Product" }, { key: "qty", label: "Qty", align: "right" }, { key: "reason", label: "Reason" }, { key: "at", label: "Reported" }]} rows={damageReports.map((d) => ({ ...d }))} />}
      </Panel>
      <IndentDialog row={indentRow} onClose={() => setIndentRow(null)} />
    </div>
  );
}

/** Store + hub inventory, configurable thresholds, and activity log. */
export function StockControlPanel() {
  const view = useStockView();
  const { thresholds, setThreshold, activity } = useOwner();
  const [kind, setKind] = useState<"store" | "hub">("store");
  const [loc, setLoc] = useState("all");
  const [status, setStatus] = useState<StockStatus | "all">("all");
  const [actType, setActType] = useState<ActivityType | "all">("all");
  const [indentRow, setIndentRow] = useState<StockViewRow | null>(null);
  const locs = stockLocations.filter((l) => l.kind === kind);
  const rows = view.filter((r) => r.location.kind === kind && (loc === "all" || r.locationId === loc) && (status === "all" || r.status === status));
  const counts = (s: StockStatus) => view.filter((r) => r.location.kind === kind && r.status === s).length;
  return (
    <div className="space-y-5">
      <Panel title="Stock by location" subtitle="Green = above minimum · Orange = below minimum · Red = below critical threshold" action={
        <div className="flex flex-wrap gap-1.5"><Chip active={kind === "store"} onClick={() => { setKind("store"); setLoc("all"); }}>Stores</Chip><Chip active={kind === "hub"} onClick={() => { setKind("hub"); setLoc("all"); }}>Hubs (12)</Chip></div>}>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Select value={loc} onValueChange={setLoc}><SelectTrigger className="h-8 w-52 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All {kind === "hub" ? "hubs" : "stores"}</SelectItem>{locs.map((l) => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}</SelectContent></Select>
          {(["all", "red", "orange", "green"] as const).map((s) => <Chip key={s} active={status === s} onClick={() => setStatus(s)}>{s === "all" ? "All" : `${statusMeta[s].label} (${counts(s)})`}</Chip>)}
        </div>
        <div className="max-h-[480px] overflow-y-auto scrollbar-thin">
          <DataTable columns={[{ key: "status", label: "Status" }, { key: "product", label: "Product" }, { key: "location", label: "Location" }, { key: "onHand", label: "On hand", align: "right" }, { key: "min", label: "Min", align: "right" }, { key: "crit", label: "Critical", align: "right" }]}
            rows={rows.map((r) => ({ status: <StatusBadge status={r.status} onClick={r.status !== "green" ? () => setIndentRow(r) : undefined} />, product: r.product.name, location: r.location.name, onHand: <b className={r.onHand === 0 ? "text-destructive" : ""}>{r.onHand === 0 ? "0 · Out" : r.onHand}</b>, min: r.min, crit: r.critical }))} />
        </div>
      </Panel>
      <div className="grid gap-5 xl:grid-cols-2">
        <Panel title="Stock thresholds" subtitle="Per product. Critical must stay below minimum.">
          <div className="divide-y rounded-lg border">
            {products.map((p) => { const t = thresholds[p.id]!; return (
              <div key={p.id} className="flex items-center gap-3 px-3 py-2"><span className="min-w-0 flex-1 truncate text-sm">{p.name}</span>
                <label className="flex items-center gap-1 text-[11px] text-muted-foreground">Min<Input type="number" className="h-7 w-16 text-xs" value={t.min} onChange={(e) => { const v = Math.max(1, Number(e.target.value) || 1); setThreshold(p.id, { min: v, critical: Math.min(t.critical, v - 1) }); }} /></label>
                <label className="flex items-center gap-1 text-[11px] text-muted-foreground">Critical<Input type="number" className="h-7 w-16 text-xs" value={t.critical} onChange={(e) => setThreshold(p.id, { ...t, critical: Math.min(t.min - 1, Math.max(0, Number(e.target.value) || 0)) })} /></label>
              </div>); })}
          </div>
        </Panel>
        <Panel title="Inventory activity log" subtitle="Indents, transfers and wastage" action={<div className="flex flex-wrap gap-1.5">{(["all", "Indent", "Transfer", "Wastage"] as const).map((t) => <Chip key={t} active={actType === t} onClick={() => setActType(t)}>{t === "all" ? "All" : t}</Chip>)}</div>}>
          <div className="max-h-[420px] overflow-y-auto scrollbar-thin">
            <DataTable columns={[{ key: "at", label: "When" }, { key: "type", label: "Type" }, { key: "item", label: "Item" }, { key: "loc", label: "Location" }, { key: "qty", label: "Qty", align: "right" }]}
              rows={activity.filter((a) => actType === "all" || a.type === actType).map((a) => ({ at: a.at, type: <Badge variant="outline" className="text-[11px]">{a.type}</Badge>, item: productById(a.productId).name, loc: locationById(a.locationId).name, qty: a.qty }))} />
          </div>
        </Panel>
      </div>
      <IndentDialog row={indentRow} onClose={() => setIndentRow(null)} />
    </div>
  );
}

/** Alert escalation chain: Executive → Store Manager → Area Manager → Operations Manager. */
export function EscalationsPanel() {
  const view = useStockView();
  const { escalation, setEscalation, log } = useOwner();
  const [now, setNow] = useState(0);
  const [start] = useState(() => Date.now());
  const [indentRow, setIndentRow] = useState<StockViewRow | null>(null);
  const [ack, setAck] = useState<Record<string, boolean>>({});
  useEffect(() => { setNow(Date.now()); const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const alerts = view.filter((r) => r.status === "red").slice(0, 10).map((r, i) => ({ row: r, ageSec: (i * 97) % 700 + 20 }));
  const levelFor = (sec: number) => {
    let acc = 0;
    for (let i = 0; i < escalation.length; i++) {
      const w = escalation[i]!.minutes * 60;
      if (i === escalation.length - 1 || sec < acc + w) return { i, left: i === escalation.length - 1 ? null : acc + w - sec };
      acc += w;
    }
    return { i: escalation.length - 1, left: null };
  };
  const elapsed = now ? Math.floor((now - start) / 1000) : 0;
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  return (
    <div className="space-y-5">
      <Panel title="Low-stock alerts" subtitle="Unactioned alerts auto-escalate. Raising an indent stops the clock. (Notifications are simulated.)">
        <div className="divide-y rounded-lg border">
          {alerts.map(({ row, ageSec }) => {
            const actioned = !!row.openIndent || ack[row.id];
            const lv = levelFor(ageSec + elapsed);
            const step = escalation[lv.i]!;
            return (
              <div key={row.id} className={cn("flex flex-wrap items-center gap-3 px-3 py-2.5", !actioned && statusMeta.red.row)}>
                <BellRing className={cn("h-4 w-4 shrink-0", actioned ? "text-muted-foreground" : "text-destructive")} />
                <div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold">{row.product.name} · {row.onHand} left</div><div className="truncate text-xs text-muted-foreground">{row.location.name}</div></div>
                {actioned ? <Badge variant="outline" className="gap-1 border-success/30 bg-success-bg text-success"><CheckCircle2 className="h-3 w-3" />Actioned</Badge>
                  : <Badge variant="outline" className={cn("text-[11px]", lv.i === 0 ? "border-warning/30 bg-warning-bg" : "border-destructive/30 bg-destructive-bg text-destructive")}>{lv.i === 0 ? `${step.role} — ${fmt(lv.left ?? 0)} left` : `Escalated to ${step.role}${lv.left !== null ? ` · ${fmt(lv.left)}` : ""}`}</Badge>}
                {!actioned && <><Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => { setAck((x) => ({ ...x, [row.id]: true })); log({ type: "Escalation", action: `Alert acknowledged: ${row.product.name} at ${row.location.name}`, store: row.location.name, status: "Completed" }); }}>Acknowledge</Button><Button size="sm" className="h-7 text-xs" onClick={() => setIndentRow(row)}>Raise Indent</Button></>}
              </div>
            );
          })}
        </div>
      </Panel>
      <Panel title="Escalation settings" subtitle="Recipients and time windows for each level" action={<Settings2 className="h-4 w-4 text-muted-foreground" />}>
        <div className="space-y-2">
          {escalation.map((s, i) => (
            <div key={s.role} className="flex flex-wrap items-center gap-2 rounded-lg border px-3 py-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-bold">{i + 1}</span>
              <span className="w-40 text-sm font-semibold">{s.role}</span>
              <Input className="h-8 min-w-40 flex-1 text-xs" value={s.person} onChange={(e) => setEscalation(escalation.map((x, k) => (k === i ? { ...x, person: e.target.value } : x)))} />
              {i < escalation.length - 1 ? <label className="flex items-center gap-1 text-xs text-muted-foreground">Escalate after<Input type="number" min={1} className="h-8 w-16 text-xs" value={s.minutes} onChange={(e) => setEscalation(escalation.map((x, k) => (k === i ? { ...x, minutes: Math.max(1, Number(e.target.value) || 1) } : x)))} />min</label> : <span className="text-xs text-muted-foreground">Final level</span>}
            </div>
          ))}
        </div>
      </Panel>
      <IndentDialog row={indentRow} onClose={() => setIndentRow(null)} />
    </div>
  );
}

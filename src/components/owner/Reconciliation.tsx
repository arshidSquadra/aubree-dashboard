import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { invoices, settlements, type Invoice } from "@/data/owner/stockControl";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Chip, ControlledDrawer, DataTable, Note, Panel, StatTile } from "./ui";

const payTone = { Successful: "border-success/30 bg-success-bg text-success", Failed: "border-destructive/30 bg-destructive-bg text-destructive", Cancelled: "border-warning/30 bg-warning-bg text-warning" };

export function ReconciliationTab() {
  const [ch, setCh] = useState("All");
  const [open, setOpen] = useState<Invoice | null>(null);
  const list = invoices.filter((i) => ch === "All" || i.channel === ch);
  const mismatches = settlements.filter((s) => s.internal !== s.aggregatorCount);
  return (
    <div className="space-y-5">
      <Note>Invoices sync from the billing system; card payments are pulled automatically from the EDC machines (no manual entry). Previous-day settlement files.</Note>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Invoices (yesterday)" value={String(invoices.length)} />
        <StatTile label="Cancelled / voided" value={String(invoices.filter((i) => i.status !== "Paid").length)} tone="amber" />
        <StatTile label="Failed payments" value={String(invoices.filter((i) => i.payment === "Failed").length)} tone="red" />
        <StatTile label="Settlement mismatches" value={String(mismatches.length)} tone={mismatches.length ? "red" : "green"} />
      </div>
      <Panel title="Invoices across channels" subtitle="Click an invoice to see its detail" action={<div className="flex flex-wrap gap-1.5">{["All", "In-store", "Swiggy", "Zomato", "Own Website"].map((c) => <Chip key={c} active={ch === c} onClick={() => setCh(c)}>{c}</Chip>)}</div>}>
        <div className="max-h-[420px] overflow-y-auto scrollbar-thin">
          <DataTable columns={[{ key: "id", label: "Invoice" }, { key: "ch", label: "Channel" }, { key: "loc", label: "Outlet" }, { key: "st", label: "Status" }, { key: "pay", label: "Payment" }, { key: "amt", label: "Amount", align: "right" }]}
            rows={list.map((i) => ({ id: <button className="font-semibold text-primary hover:underline" onClick={() => setOpen(i)}>{i.id}</button>, ch: i.channel, loc: i.location, st: <span className={cn(i.status !== "Paid" && "font-semibold text-warning")}>{i.status}</span>, pay: <Badge variant="outline" className={cn("text-[11px]", payTone[i.payment])}>{i.payment}</Badge>, amt: formatINR(i.amount) }))} />
        </div>
      </Panel>
      <Panel title="Swiggy / Zomato settlement reconciliation" subtitle="Internal billing order count vs aggregator settlement report">
        <DataTable columns={[{ key: "o", label: "Outlet" }, { key: "a", label: "Aggregator" }, { key: "i", label: "Our billing", align: "right" }, { key: "s", label: "Settlement report", align: "right" }, { key: "d", label: "Difference", align: "right" }]}
          rows={settlements.map((s) => { const d = s.aggregatorCount - s.internal; return { o: s.outlet, a: s.aggregator, i: s.internal, s: s.aggregatorCount, d: d === 0 ? <span className="text-success">Matched</span> : <b className="text-destructive">{d} orders</b> }; })} />
      </Panel>
      <Note tone="warning">Open item: confirm with the backend team whether POS and CRM are one system or several. The in-house database (MongoDB) is the system of record for these figures.</Note>
      <ControlledDrawer open={!!open} onOpenChange={(v) => !v && setOpen(null)} title={open?.id ?? ""} description={open ? `${open.channel} · ${open.location} · ${open.at}` : undefined}>
        {open && <div className="space-y-4">
          <div className="flex flex-wrap gap-2"><Badge variant="outline">{open.status}</Badge><Badge variant="outline" className={payTone[open.payment]}>{open.payment}</Badge><Badge variant="outline">{open.mode}{open.edc && " · auto-synced"}</Badge></div>
          <DataTable columns={[{ key: "n", label: "Item" }, { key: "q", label: "Qty", align: "right" }, { key: "p", label: "Amount", align: "right" }]} rows={[...open.items.map((it) => ({ n: it.name, q: it.qty, p: formatINR(it.qty * it.price) })), { n: "GST included (5%)", q: "", p: formatINR(open.gst) }, { n: <b>Total</b>, q: "", p: <b>{formatINR(open.amount)}</b> }]} />
        </div>}
      </ControlledDrawer>
    </div>
  );
}

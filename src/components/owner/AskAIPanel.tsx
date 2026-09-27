import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { askClaude } from "@/lib/askai.functions";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Bot, Send, X } from "lucide-react";
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useOwner } from "@/contexts/OwnerContext";
import { formatINR, formatINRCompact, formatNum } from "@/lib/format";
import { axisProps, tooltipStyle } from "./ui";
import {
  getForecastDrivers, getForecastForOffset, getOutletForecast, getProcurementBudget, getSevenDayByOutlet, getStockoutRanking, getTomorrowForecast, getProductionPlan,
} from "@/services/forecastService";

const PROMPTS = [
  "What is tomorrow's sales forecast?",
  "Show the 7-day forecast by outlet",
  "Forecast for the day after tomorrow",
  "Which store is at highest stock-out risk?",
  "How many units do we need to produce tomorrow?",
  "Which channel will drive most demand tomorrow?",
  "What is the procurement budget for tomorrow?",
] as const;
const FALLBACK = "I can currently answer forecast and configured data questions. Please pick one of the suggestions.";

type Msg = { id: number; from: "user" | "assistant"; body: ReactNode };

function MiniBars({ data, x, y }: { data: Record<string, string | number>[]; x: string; y: string }) {
  return (
    <div className="mt-2 h-36 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: -18, right: 4, top: 4 }}>
          <XAxis dataKey={x} {...axisProps} interval={0} tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} />
          <YAxis {...axisProps} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(var(--muted))" }} />
          <Bar dataKey={y} fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function Why({ children }: { children: ReactNode }) {
  return <div className="mt-2 rounded-lg bg-muted/70 p-2.5 text-xs text-muted-foreground"><span className="font-semibold text-foreground">Why: </span>{children}</div>;
}

function Drivers() {
  return (
    <ul className="mt-2 space-y-1.5">
      {getForecastDrivers().map((d) => (
        <li key={d.label} className="flex gap-2 text-xs"><span className="shrink-0 rounded bg-accent px-1.5 py-0.5 font-semibold text-accent-foreground">{d.effect}</span><span><b>{d.label}:</b> {d.detail}</span></li>
      ))}
    </ul>
  );
}

function answer(q: string, prices: Record<string, number>): ReactNode {
  switch (q) {
    case PROMPTS[0]: {
      const f = getTomorrowForecast();
      return <><p>Tomorrow ({f.weekday}, {f.date}) we expect <b>{f.units} units</b> worth <b>{formatINRCompact(f.revenue)}</b>, with {Math.round(f.confidence * 100)}% model confidence (range {f.lower}–{f.upper}).</p><p className="mt-1 text-sm">That is {f.surgePct.toFixed(1)}% above the usual baseline of {f.baseline} units.</p><Why>These factors drove the forecast:<Drivers /></Why></>;
    }
    case PROMPTS[1]: {
      const rows = getSevenDayByOutlet();
      const outlets = getOutletForecast(1).map((o) => o.name);
      return <><p>Forecast units per outlet for the next 7 days:</p>
        <div className="mt-2 overflow-x-auto rounded-lg border text-[11px]"><table className="w-full"><thead className="bg-muted/60"><tr><th className="px-2 py-1 text-left">Outlet</th>{rows.map((r) => <th key={String(r.day)} className="px-1.5 py-1 text-right">{r.day}</th>)}</tr></thead>
          <tbody>{outlets.map((o) => <tr key={o} className="border-t"><td className="whitespace-nowrap px-2 py-1">{o}</td>{rows.map((r) => <td key={String(r.day)} className="px-1.5 py-1 text-right tabular-nums">{r[o]}</td>)}</tr>)}</tbody></table></div>
        <Why>Friday and Saturday peak because of birthdays and office orders; the Flagship and Indiranagar lead on volume.</Why></>;
    }
    case PROMPTS[2]: {
      const f = getForecastForOffset(2);
      return <><p>The day after tomorrow ({f.weekday}, {f.date}): <b>{f.units} units</b>, about <b>{formatINRCompact(f.revenue)}</b>, with {Math.round(f.confidence * 100)}% confidence.</p><Why>Confidence is slightly lower further out. The weekend lifts demand, and the Ganesh Chaturthi pre-orders are starting.</Why></>;
    }
    case PROMPTS[3]: {
      const r = getStockoutRanking();
      const top = r[0]!;
      return <><p><b>{top.name}</b> is at the highest stock-out risk: {top.red} products are red and {top.amber} are amber against tomorrow's forecast.</p><MiniBars data={r.map((o) => ({ outlet: o.name.split(" ")[0]!, red: o.red }))} x="outlet" y="red" /><Why>Stock on hand covers less than 40% of tomorrow's forecast for those products. Authorize a dispatch from Operations to fix it.</Why></>;
    }
    case PROMPTS[4]: {
      const plan = getProductionPlan(1);
      const total = plan.reduce((a, p) => a + p.units, 0);
      return <><p>We need to produce <b>{total} units</b> tomorrow.</p><MiniBars data={plan.map((p) => ({ product: p.name.split(" ")[0]!, units: p.units }))} x="product" y="units" /><Why>The plan matches tomorrow's forecast and is split by each product's recent sales share. Spoilage from last week has already been taken into account.</Why></>;
    }
    case PROMPTS[5]: {
      const f = getTomorrowForecast();
      const top = f.byChannel.slice().sort((a, b) => b.units - a.units)[0]!;
      return <><p><b>{top.name}</b> will drive the most demand tomorrow: about {top.units} units ({Math.round((top.units / f.units) * 100)}%).</p><MiniBars data={f.byChannel.map((c) => ({ channel: c.name.split(" ")[0]!, units: c.units }))} x="channel" y="units" /><Why>Rain from 5–9 PM moves orders from walk-ins to delivery apps. Swiggy has the biggest share in our delivery areas.</Why></>;
    }
    case PROMPTS[6]: {
      const b = getProcurementBudget(prices);
      const top = b.perProduct.slice().sort((a, c) => c.cost - a.cost).slice(0, 3);
      return <><p>Tomorrow's procurement budget is <b>{formatINR(b.total)}</b> across {formatNum(b.perProduct.reduce((a, p) => a + p.units, 0))} units.</p><ul className="mt-2 space-y-1 text-xs">{top.map((p) => <li key={p.productId} className="flex justify-between gap-2"><span>{p.name} ({p.units} units)</span><b>{formatINR(p.cost)}</b></li>)}</ul><Why>Calculated from each recipe and the current ingredient prices. If you change a price in Operations, this number updates too.</Why></>;
    }
    default:
      return FALLBACK;
  }
}

function buildContext(prices: Record<string, number>) {
  return JSON.stringify({
    tomorrow: getTomorrowForecast(),
    dayAfter: getForecastForOffset(2),
    drivers: getForecastDrivers(),
    sevenDayByOutlet: getSevenDayByOutlet(),
    outletsTomorrow: getOutletForecast(1),
    stockoutRanking: getStockoutRanking(),
    productionPlanTomorrow: getProductionPlan(1),
    procurementBudget: getProcurementBudget(prices),
  });
}

export function AskAIPanel() {
  const { askOpen, setAskOpen, prices } = useOwner();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [history, setHistory] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const callAI = useServerFn(askClaude);
  useEffect(() => { if (askOpen) inputRef.current?.focus(); }, [askOpen, messages.length]);

  const ask = async (q: string) => {
    const known = (PROMPTS as readonly string[]).find((p) => p.toLowerCase() === q.trim().toLowerCase());
    if (known) {
      setMessages((m) => [...m, { id: m.length, from: "user", body: q }, { id: m.length + 1, from: "assistant", body: answer(known, prices) }]);
      return;
    }
    const next = [...history, { role: "user" as const, content: q }].slice(-20);
    setMessages((m) => [...m, { id: m.length, from: "user", body: q }]);
    setBusy(true);
    try {
      const r = await callAI({ data: { context: buildContext(prices), messages: next } });
      const reply = r.ok ? r.text : r.error;
      if (r.ok) setHistory([...next, { role: "assistant", content: r.text }]);
      setMessages((m) => [...m, { id: m.length, from: "assistant", body: <p className="whitespace-pre-wrap">{reply}</p> }]);
    } catch {
      setMessages((m) => [...m, { id: m.length, from: "assistant", body: "Something went wrong. Please try again." }]);
    } finally { setBusy(false); }
  };
  const submit = (e: FormEvent) => { e.preventDefault(); if (!text.trim() || busy) return; void ask(text); setText(""); };

  return (
    <aside className={cn("fixed bottom-0 right-0 top-16 z-30 flex w-full flex-col border-l bg-card shadow-2xl transition-transform duration-300 sm:w-[400px]", askOpen ? "translate-x-0" : "pointer-events-none translate-x-full")} aria-hidden={!askOpen}>
      <div className="flex items-center gap-3 border-b px-4 py-3">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-accent-foreground"><Bot className="h-4.5 w-4.5" /></span>
        <div className="min-w-0 flex-1"><div className="font-display text-sm font-bold">Ask AI · Copilot</div><div className="text-[11px] text-muted-foreground">Answers come from your live dashboard data</div></div>
        <Button variant="ghost" size="icon-sm" onClick={() => setAskOpen(false)} aria-label="Close Ask AI"><X className="h-4 w-4" /></Button>
      </div>

      <Conversation className="flex-1">
        <ConversationContent className="gap-4 p-4">
          {messages.length === 0 && <p className="text-center text-sm text-muted-foreground">Pick a question below to get started.</p>}
          {messages.map((m) => (
            <Message key={m.id} from={m.from}>
              <MessageContent className={cn("text-sm", m.from === "user" && "bg-primary text-primary-foreground")}>{m.body}</MessageContent>
            </Message>
          ))}
          {busy && <Message from="assistant"><MessageContent className="text-sm text-muted-foreground">Thinking…</MessageContent></Message>}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t p-3">
        <div className="mb-2 flex max-h-32 flex-wrap gap-1.5 overflow-y-auto scrollbar-thin">
          {PROMPTS.map((p) => <button key={p} onClick={() => ask(p)} className="rounded-full border bg-background px-2.5 py-1 text-left text-[11px] font-medium text-foreground hover:border-primary/50 hover:bg-accent">{p}</button>)}
        </div>
        <form onSubmit={submit} className="flex items-center gap-2 rounded-xl border bg-background p-1.5 pl-3">
          <input ref={inputRef} value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask anything about your dashboard…" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
          <Button type="submit" size="icon-sm" aria-label="Send" disabled={busy}><Send className="h-4 w-4" /></Button>
        </form>
        <p className="mt-2 text-[10px] text-muted-foreground">Powered by Claude. Action commands coming in a later phase.</p>
      </div>
    </aside>
  );
}

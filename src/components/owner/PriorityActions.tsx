import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useOwner } from "@/contexts/OwnerContext";
import { priorityActions, type Priority } from "@/data/owner/operations";
import { outletById } from "@/data/owner/catalog";
import { formatINRCompact } from "@/lib/format";

const tierInfo: Record<Priority, { label: string; cls: string }> = {
  P1: { label: "Financial impact", cls: "bg-destructive-bg text-destructive" },
  P2: { label: "Penalty risk", cls: "bg-warning-bg text-warning" },
  P3: { label: "Clear by EOD", cls: "bg-success-bg text-success" },
};

const rowTone: Record<Priority, string> = {
  P1: "border-destructive bg-destructive-bg/60",
  P2: "border-warning bg-warning-bg/60",
  P3: "border-success bg-success-bg/60",
};

export function PriorityActionList({ limit, compact = false }: { limit?: number; compact?: boolean }) {
  const { done, markDone, log } = useOwner();
  const list = priorityActions.slice(0, limit ?? priorityActions.length);
  const open = list.filter((a) => !done[a.id]).length;
  return (
    <div className="min-w-0 overflow-hidden rounded-md border bg-card">
      <div className="flex items-center justify-between border-b px-4 py-2.5 text-xs text-muted-foreground">
        <span>{list.length} items</span><span className="tabular-nums">{open} requiring attention</span>
      </div>
      <ul className="divide-y">
        {list.map((a) => {
          const isDone = !!done[a.id];
          const store = outletById(a.outletId).name;
          return (
            <li key={a.id} className={cn("grid grid-cols-[auto_1fr] items-start gap-x-3 gap-y-2 border-l-4 px-4 py-3 sm:grid-cols-[auto_1fr_auto_auto] sm:items-center", isDone && "opacity-60", rowTone[a.priority])}>
              <span className={cn("mt-0.5 rounded px-1.5 py-0.5 text-[11px] font-semibold tabular-nums sm:mt-0", tierInfo[a.priority].cls)} title={tierInfo[a.priority].label}>{a.priority}</span>
              <div className="min-w-0">
                <div className="text-[13px] font-medium leading-snug text-foreground">{a.title}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{store}{!compact && <> · {a.reason}</>}</div>
              </div>
              <div className="col-start-2 text-xs tabular-nums text-muted-foreground sm:col-start-auto sm:text-right"><span className="font-medium text-foreground">{formatINRCompact(a.impact)}</span> at risk</div>
              <div className="col-start-2 sm:col-start-auto">
                {isDone ? (
                  <div className="flex items-center gap-1.5 text-xs font-medium text-success"><CheckCircle2 className="h-3.5 w-3.5" />{a.doneLabel}</div>
                ) : (
                  <Button size="sm" className="h-7 px-3 text-xs" onClick={() => {
                    markDone(a.id);
                    log({ type: a.actionLabel.includes("Transfer") ? "Transfer" : "Operations", action: a.auditAction, store, status: "Completed" });
                    toast.success("Notification sent to store", { description: a.auditAction });
                  }}>{a.actionLabel}</Button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

import { useState } from "react";
import { LayoutGrid, List, Plus, Filter, Clock, User, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { opsTasks } from "@/data/moduleData";
import { cn } from "@/lib/utils";

const columns = [
  { id: "new", label: "New", color: "bg-blue-500" },
  { id: "in_progress", label: "In Progress", color: "bg-yellow-500" },
  { id: "internal_qa", label: "Internal QA", color: "bg-purple-500" },
  { id: "store_review", label: "Store Review", color: "bg-orange-500" },
  { id: "approved", label: "Approved", color: "bg-green-500" },
];

const priorityColors: Record<string, string> = {
  high: "bg-red-500/10 text-red-400",
  medium: "bg-yellow-500/10 text-yellow-400",
  low: "bg-green-500/10 text-green-400",
};

const moduleColors: Record<string, string> = {
  "Campaign Launch": "border-l-orange-500",
  "Content Production": "border-l-pink-500",
  "Web Development": "border-l-blue-500",
  "Ads Setup": "border-l-purple-500",
  "CRM": "border-l-green-500",
};

export default function OpsWorkboard() {
  const [view, setView] = useState<"kanban" | "list">("kanban");

  const getColumnTasks = (status: string) => opsTasks.filter(t => t.status === status);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Workboard</h1>
          <p className="text-muted-foreground">{opsTasks.length} tasks across all modules</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/50">
            <button
              onClick={() => setView("kanban")}
              className={cn(
                "p-2 rounded-md transition-all",
                view === "kanban" ? "bg-background shadow-sm" : "text-muted-foreground"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={cn(
                "p-2 rounded-md transition-all",
                view === "list" ? "bg-background shadow-sm" : "text-muted-foreground"
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button className="gap-2" style={{ background: 'hsl(var(--module-operations))' }}>
            <Plus className="w-4 h-4" />
            New Task
          </Button>
        </div>
      </div>

      {/* Kanban View */}
      {view === "kanban" && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((column) => {
            const tasks = getColumnTasks(column.id);
            return (
              <div key={column.id} className="flex-shrink-0 w-72">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={cn("w-2 h-2 rounded-full", column.color)} />
                    <h3 className="font-medium text-sm">{column.label}</h3>
                    <span className="text-xs text-muted-foreground">({tasks.length})</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div 
                      key={task.id} 
                      className={cn(
                        "card-base p-4 cursor-pointer hover:border-[hsl(var(--module-operations))]/30 transition-all border-l-4",
                        moduleColors[task.type] || "border-l-gray-500"
                      )}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-medium",
                          priorityColors[task.priority]
                        )}>
                          {task.priority}
                        </span>
                        {task.slaStatus === "at_risk" && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-500/10 text-red-400">
                            SLA Risk
                          </span>
                        )}
                      </div>
                      
                      <h4 className="font-medium text-sm mb-2">{task.title}</h4>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                        <Building2 className="w-3 h-3" />
                        <span>{task.store}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <User className="w-3 h-3" />
                          <span>{task.assignee}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{task.dueDate}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {tasks.length === 0 && (
                    <div className="border border-dashed border-border rounded-lg p-4 text-center text-muted-foreground text-sm">
                      No tasks
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {view === "list" && (
        <div className="card-base overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Task</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Store</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Type</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Assignee</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Priority</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Due Date</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {opsTasks.map((task) => (
                <tr key={task.id} className="border-b border-border hover:bg-muted/20 cursor-pointer">
                  <td className="p-4 font-medium">{task.title}</td>
                  <td className="p-4 text-muted-foreground">{task.store}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full text-xs bg-muted">{task.type}</span>
                  </td>
                  <td className="p-4 text-muted-foreground">{task.assignee}</td>
                  <td className="p-4">
                    <span className={cn("px-2 py-1 rounded-full text-xs font-medium", priorityColors[task.priority])}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground">{task.dueDate}</td>
                  <td className="p-4">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      task.status === "new" && "bg-blue-500/10 text-blue-400",
                      task.status === "in_progress" && "bg-yellow-500/10 text-yellow-400",
                      task.status === "internal_qa" && "bg-purple-500/10 text-purple-400",
                      task.status === "store_review" && "bg-orange-500/10 text-orange-400",
                      task.status === "approved" && "bg-green-500/10 text-green-400"
                    )}>
                      {task.status.replace("_", " ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import { LayoutGrid, Clock, AlertTriangle, CheckCircle2, TrendingUp, ArrowRight, Users, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/router-compat";
import { dashboardMetrics, opsTasks, qaItems } from "@/data/moduleData";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-400",
  in_progress: "bg-yellow-500/10 text-yellow-400",
  internal_qa: "bg-purple-500/10 text-purple-400",
  store_review: "bg-orange-500/10 text-orange-400",
  approved: "bg-green-500/10 text-green-400",
  live: "bg-green-500/10 text-green-400",
};

export default function OpsDashboard() {
  const metrics = dashboardMetrics.operations;
  const atRiskTasks = opsTasks.filter(t => t.slaStatus === "at_risk").length;
  const inQA = qaItems.length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Operations Dashboard</h1>
          <p className="text-muted-foreground">Execution & delivery overview</p>
        </div>
        <Button className="gap-2" style={{ background: 'hsl(var(--module-operations))' }}>
          <LayoutGrid className="w-4 h-4" />
          View Workboard
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-4">
        {metrics.kpis.map((kpi) => {
          const isPositive = kpi.change > 0;
          let displayValue = "";
          if (kpi.format === "percent") displayValue = `${kpi.value}%`;
          else if (kpi.format === "days") displayValue = `${kpi.value} days`;
          else displayValue = kpi.value.toString();

          return (
            <div key={kpi.label} className="card-base p-5 hover:border-[hsl(var(--module-operations))]/30 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'hsl(var(--module-operations) / 0.1)' }}
                >
                  <LayoutGrid className="w-5 h-5" style={{ color: 'hsl(var(--module-operations))' }} />
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                  isPositive && kpi.label !== "At Risk" && "bg-green-500/10 text-green-400",
                  !isPositive && kpi.label !== "At Risk" && "bg-red-500/10 text-red-400",
                  kpi.label === "At Risk" && isPositive && "bg-red-500/10 text-red-400",
                  kpi.label === "At Risk" && !isPositive && "bg-green-500/10 text-green-400"
                )}>
                  <TrendingUp className="w-3 h-3" />
                  {Math.abs(kpi.change)}%
                </div>
              </div>
              <p className="text-2xl font-bold mb-1">{displayValue}</p>
              <p className="text-sm text-muted-foreground">{kpi.label}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Link to="/ops/workboard" className="card-base p-5 hover:border-[hsl(var(--module-operations))]/30 transition-all group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">In Progress</span>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-[hsl(var(--module-operations))] transition-colors" />
          </div>
          <p className="text-3xl font-bold">{opsTasks.filter(t => t.status === "in_progress").length}</p>
          <p className="text-xs text-muted-foreground mt-1">Active tasks</p>
        </Link>

        <Link to="/ops/qa" className="card-base p-5 hover:border-purple-500/30 transition-all group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-purple-400">QA Queue</span>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-purple-400 transition-colors" />
          </div>
          <p className="text-3xl font-bold text-purple-400">{inQA}</p>
          <p className="text-xs text-muted-foreground mt-1">Awaiting review</p>
        </Link>

        <div className="card-base p-5 border-red-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-red-400">SLA At Risk</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-3xl font-bold text-red-400">{atRiskTasks}</p>
          <p className="text-xs text-muted-foreground mt-1">Needs attention</p>
        </div>

        <Link to="/ops/calendar" className="card-base p-5 hover:border-[hsl(var(--module-operations))]/30 transition-all group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Due This Week</span>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-[hsl(var(--module-operations))] transition-colors" />
          </div>
          <p className="text-3xl font-bold">12</p>
          <p className="text-xs text-muted-foreground mt-1">Upcoming deadlines</p>
        </Link>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-6">
        {/* Task Status Breakdown */}
        <div className="card-base p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Task Status Breakdown</h3>
            <Link to="/ops/workboard" className="text-xs text-[hsl(var(--module-operations))] hover:underline">View Workboard</Link>
          </div>
          <div className="space-y-3">
            {["new", "in_progress", "internal_qa", "store_review", "approved"].map((status) => {
              const count = opsTasks.filter(t => t.status === status).length;
              const percentage = (count / opsTasks.length) * 100;
              const labels: Record<string, string> = {
                new: "New",
                in_progress: "In Progress",
                internal_qa: "Internal QA",
                store_review: "Store Review",
                approved: "Approved",
              };

              return (
                <div key={status} className="flex items-center gap-3">
                  <span className="w-24 text-sm text-muted-foreground">{labels[status]}</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full transition-all", statusColors[status]?.replace("bg-", "bg-").split(" ")[0])}
                      style={{ width: `${percentage}%`, background: status === "in_progress" ? "hsl(var(--module-operations))" : undefined }}
                    />
                  </div>
                  <span className="w-8 text-sm font-medium text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottlenecks */}
        <div className="card-base p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Bottlenecks</h3>
            <Button variant="ghost" size="sm" className="text-xs">View All</Button>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/10">
              <Clock className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Waiting on store approval</p>
                <p className="text-xs text-muted-foreground">3 items pending for 2+ days</p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">3</span>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-500/10">
              <Target className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">QA backlog</p>
                <p className="text-xs text-muted-foreground">Items waiting for internal review</p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">{inQA}</span>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/10">
              <Users className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Waiting on store input</p>
                <p className="text-xs text-muted-foreground">Missing brief or assets</p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">2</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="card-base p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Recent Tasks</h3>
          <Link to="/ops/tasks" className="text-xs text-[hsl(var(--module-operations))] hover:underline">View All Tasks</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 text-sm font-medium text-muted-foreground">Task</th>
                <th className="text-left py-3 text-sm font-medium text-muted-foreground">Store</th>
                <th className="text-left py-3 text-sm font-medium text-muted-foreground">Type</th>
                <th className="text-left py-3 text-sm font-medium text-muted-foreground">Assignee</th>
                <th className="text-left py-3 text-sm font-medium text-muted-foreground">Due</th>
                <th className="text-left py-3 text-sm font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {opsTasks.slice(0, 5).map((task) => (
                <tr key={task.id} className="border-b border-border/50 hover:bg-muted/20 cursor-pointer">
                  <td className="py-3 font-medium">{task.title}</td>
                  <td className="py-3 text-muted-foreground">{task.store}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs bg-muted">{task.type}</span>
                  </td>
                  <td className="py-3 text-muted-foreground">{task.assignee}</td>
                  <td className="py-3 text-muted-foreground">{task.dueDate}</td>
                  <td className="py-3">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      statusColors[task.status]
                    )}>
                      {task.status.replace("_", " ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { TrendingUp, TrendingDown, DollarSign, Users, Target, BarChart3, ArrowRight, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/router-compat";
import { dashboardMetrics, salesPipeline, leads } from "@/data/moduleData";
import { formatCurrency, formatNumber, topPerformers, alerts } from "@/data/mockData";
import { cn } from "@/lib/utils";

const kpiIcons: Record<string, typeof TrendingUp> = {
  "Total Spend": DollarSign,
  "Leads": Users,
  "CPL": Target,
  "ROAS": BarChart3,
  "Pipeline Value": TrendingUp,
};

export default function SalesOverview() {
  const metrics = dashboardMetrics.sales;
  const newLeads = leads.filter(l => l.status === "new").length;
  const pipelineValue = salesPipeline.reduce((sum, deal) => sum + deal.value, 0);
  const openDeals = salesPipeline.filter(d => d.stage !== "closed_won" && d.stage !== "closed_lost").length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold">Sales & Marketing Overview</h1>
          <p className="text-muted-foreground">Performance dashboard for Aubree Bengaluru</p>
        </div>
        <Button variant="outline" className="hidden shrink-0 gap-2 sm:inline-flex">
          <BarChart3 className="w-4 h-4" />
          View Full Report
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5 xl:gap-4">
        {metrics.kpis.map((kpi) => {
          const Icon = kpiIcons[kpi.label] || TrendingUp;
          const isPositive = kpi.change > 0;
          const isNegative = kpi.change < 0;
          
          let displayValue = "";
          if (kpi.format === "currency") displayValue = formatCurrency(kpi.value);
          else if (kpi.format === "roas") displayValue = `${kpi.value}x`;
          else if (kpi.format === "percent") displayValue = `${kpi.value}%`;
          else displayValue = formatNumber(kpi.value);

          return (
            <div key={kpi.label} className="card-base p-5 hover:border-primary/30 transition-all">
              <div className="mb-3 flex min-w-0 items-start justify-between gap-2">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'hsl(var(--module-sales) / 0.1)' }}
                >
                  <Icon className="w-5 h-5" style={{ color: 'hsl(var(--module-sales))' }} />
                </div>
                <div className={cn(
                  "flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
                  isPositive && "bg-green-500/10 text-green-400",
                  isNegative && kpi.label !== "CPL" && "bg-red-500/10 text-red-400",
                  isNegative && kpi.label === "CPL" && "bg-green-500/10 text-green-400"
                )}>
                  {(isPositive || (isNegative && kpi.label === "CPL")) ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
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
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 xl:gap-4">
        <Link to="/sales/leads" className="card-base p-5 hover:border-primary/30 transition-all group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">New Leads Today</span>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <p className="text-3xl font-bold">{newLeads}</p>
          <p className="text-xs text-muted-foreground mt-1">Awaiting assignment</p>
        </Link>

        <Link to="/sales/pipeline" className="card-base p-5 hover:border-primary/30 transition-all group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Pipeline Value</span>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <p className="text-3xl font-bold">{formatCurrency(pipelineValue)}</p>
          <p className="text-xs text-muted-foreground mt-1">{openDeals} open deals</p>
        </Link>

        <Link to="/sales/campaigns" className="card-base p-5 hover:border-primary/30 transition-all group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Active Campaigns</span>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <p className="text-3xl font-bold">8</p>
          <p className="text-xs text-muted-foreground mt-1">Across Meta, Google, LinkedIn</p>
        </Link>

        <Link to="/approvals" className="card-base p-5 hover:border-primary/30 transition-all group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Pending Approvals</span>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <p className="text-3xl font-bold">6</p>
          <p className="text-xs text-muted-foreground mt-1">Creatives awaiting review</p>
        </Link>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 xl:gap-6">
        {/* Top Performers */}
        <div className="card-base p-5">
          <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
            <h3 className="font-semibold">Top Performers</h3>
            <Link to="/sales/campaigns" className="text-xs text-primary hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {topPerformers.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <img src={item.thumbnail} alt={item.title} className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-green-400">{item.metricValue}</p>
                  <p className="text-xs text-muted-foreground">{item.metric}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="card-base p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Recent Alerts</h3>
            <Button variant="ghost" size="sm" className="text-xs">Mark All Read</Button>
          </div>
          <div className="space-y-3">
            {alerts.slice(0, 4).map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                  alert.type === "success" && "bg-green-500/10",
                  alert.type === "warning" && "bg-yellow-500/10",
                  alert.type === "error" && "bg-red-500/10",
                  alert.type === "info" && "bg-blue-500/10"
                )}>
                  {alert.type === "success" && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                  {alert.type === "warning" && <AlertTriangle className="w-4 h-4 text-yellow-400" />}
                  {alert.type === "error" && <AlertTriangle className="w-4 h-4 text-red-400" />}
                  {alert.type === "info" && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

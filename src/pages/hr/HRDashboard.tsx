import { Users, UserPlus, Clock, TrendingUp, GraduationCap, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/router-compat";
import { dashboardMetrics, employees, onboardingTasks, lmsCoursesData } from "@/data/moduleData";
import { cn } from "@/lib/utils";

export default function HRDashboard() {
  const metrics = dashboardMetrics.hr;
  const activeOnboarding = onboardingTasks.filter(t => t.status === "in_progress").length;
  const avgTrainingCompletion = Math.round(lmsCoursesData.reduce((sum, c) => sum + (c.completed / c.enrolled) * 100, 0) / lmsCoursesData.length);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">HR Dashboard</h1>
          <p className="text-muted-foreground">People management overview for Aubree Bengaluru</p>
        </div>
        <Button className="gap-2" style={{ background: 'hsl(var(--module-hr))' }}>
          <UserPlus className="w-4 h-4" />
          Add Employee
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-4">
        {metrics.kpis.map((kpi) => {
          const isPositive = kpi.change > 0;
          let displayValue = "";
          if (kpi.format === "percent") displayValue = `${kpi.value}%`;
          else displayValue = kpi.value.toString();

          return (
            <div key={kpi.label} className="card-base p-5 hover:border-[hsl(var(--module-hr))]/30 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'hsl(var(--module-hr) / 0.1)' }}
                >
                  <Users className="w-5 h-5" style={{ color: 'hsl(var(--module-hr))' }} />
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                  isPositive && kpi.label !== "Attrition Rate" && "bg-green-500/10 text-green-400",
                  isPositive && kpi.label === "Attrition Rate" && "bg-red-500/10 text-red-400",
                  !isPositive && kpi.label !== "Attrition Rate" && "bg-red-500/10 text-red-400",
                  !isPositive && kpi.label === "Attrition Rate" && "bg-green-500/10 text-green-400"
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

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <Link to="/hr/onboarding" className="card-base p-5 hover:border-[hsl(var(--module-hr))]/30 transition-all group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Active Onboarding</span>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-[hsl(var(--module-hr))] transition-colors" />
          </div>
          <p className="text-3xl font-bold">{activeOnboarding}</p>
          <p className="text-xs text-muted-foreground mt-1">Employees being onboarded</p>
        </Link>

        <Link to="/hr/learning" className="card-base p-5 hover:border-[hsl(var(--module-hr))]/30 transition-all group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Training Completion</span>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-[hsl(var(--module-hr))] transition-colors" />
          </div>
          <p className="text-3xl font-bold">{avgTrainingCompletion}%</p>
          <p className="text-xs text-muted-foreground mt-1">Across all courses</p>
        </Link>

        <Link to="/hr/leave" className="card-base p-5 hover:border-[hsl(var(--module-hr))]/30 transition-all group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Leave Requests</span>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-[hsl(var(--module-hr))] transition-colors" />
          </div>
          <p className="text-3xl font-bold">3</p>
          <p className="text-xs text-muted-foreground mt-1">Pending approval</p>
        </Link>

        <Link to="/hr/performance" className="card-base p-5 hover:border-[hsl(var(--module-hr))]/30 transition-all group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Review Cycle</span>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-[hsl(var(--module-hr))] transition-colors" />
          </div>
          <p className="text-3xl font-bold">Q1</p>
          <p className="text-xs text-muted-foreground mt-1">In progress</p>
        </Link>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-6">
        {/* Onboarding Progress */}
        <div className="card-base p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Onboarding Progress</h3>
            <Link to="/hr/onboarding" className="text-xs text-[hsl(var(--module-hr))] hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {onboardingTasks.map((task) => (
              <div key={task.id} className="p-4 rounded-lg bg-muted/30">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium">{task.employeeName}</p>
                    <p className="text-xs text-muted-foreground">{task.role} • Started {task.startDate}</p>
                  </div>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    task.status === "completed" && "bg-green-500/10 text-green-400",
                    task.status === "in_progress" && "bg-blue-500/10 text-blue-400"
                  )}>
                    {task.status === "completed" ? "Completed" : "In Progress"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all"
                      style={{ 
                        width: `${task.progress}%`,
                        background: 'hsl(var(--module-hr))'
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium">{task.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* HR Actions */}
        <div className="card-base p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">HR Actions Required</h3>
            <Button variant="ghost" size="sm" className="text-xs">Mark All Read</Button>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/10">
              <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Training overdue</p>
                <p className="text-xs text-muted-foreground">3 employees have overdue mandatory training</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/10">
              <Clock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Leave approval pending</p>
                <p className="text-xs text-muted-foreground">2 leave requests awaiting your approval</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-green-500/10">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Onboarding completed</p>
                <p className="text-xs text-muted-foreground">Meera Reddy completed onboarding</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-500/10">
              <GraduationCap className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">New course available</p>
                <p className="text-xs text-muted-foreground">Advanced Meta Ads course added to Lynk</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lynk Integration Banner */}
      <div className="card-base p-5 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, hsl(var(--module-hr) / 0.1), transparent)' }}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'hsl(var(--module-hr) / 0.2)' }}>
            <GraduationCap className="w-6 h-6" style={{ color: 'hsl(var(--module-hr))' }} />
          </div>
          <div>
            <p className="font-semibold">Lynk LMS Connected</p>
            <p className="text-sm text-muted-foreground">{lmsCoursesData.length} courses • {employees.length * 2} enrolled</p>
          </div>
        </div>
        <Link to="/hr/learning">
          <Button style={{ background: 'hsl(var(--module-hr))' }}>Launch Lynk</Button>
        </Link>
      </div>
    </div>
  );
}

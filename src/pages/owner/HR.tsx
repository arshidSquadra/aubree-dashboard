import { useState } from "react";
import { GraduationCap, UserPlus } from "lucide-react";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { hrAttendance, hrHeadcount, hrOnboarding } from "@/data/owner/operations";
import { ChartDateFilter, DataTable, PageHeader, Panel, StatTile, SyncedLabel, axisProps, tooltipStyle } from "@/components/owner/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getHiringForecast } from "@/services/forecastService";
import { formatNum } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function HR() {
  const [attendanceDays, setAttendanceDays] = useState(7);
  const total = hrHeadcount.reduce((a, h) => a + h.staff, 0);
  const avg = hrAttendance.reduce((a, d) => a + d.present, 0) / hrAttendance.length;
  return (
    <div className="space-y-5">
      <PageHeader title="HR" subtitle="Summary view — managed in your HR system" actions={<SyncedLabel system="Keka HR" />} />
      <Tabs defaultValue="forecast">
        <TabsList className="h-9"><TabsTrigger value="forecast" className="px-3 text-xs sm:px-4 sm:text-[13px]">Trends & Forecast</TabsTrigger><TabsTrigger value="summary" className="px-3 text-xs sm:px-4 sm:text-[13px]">Workforce Summary</TabsTrigger></TabsList>
        <TabsContent value="forecast" className="mt-5 space-y-5">
          <HiringForecast />
          <Panel title="Attendance trend" subtitle={`${attendanceDays} days · operational staffing indicator only`} action={<ChartDateFilter defaultDays={7} onChange={(r) => setAttendanceDays(r.days)} />}><div className="h-64"><ResponsiveContainer width="100%" height="100%"><LineChart data={Array.from({ length: attendanceDays }, (_, i) => { const item = hrAttendance[i % hrAttendance.length] ?? { day: `D${i + 1}`, present: 0 }; return { ...item, day: attendanceDays <= 7 ? item.day : `D${i + 1}` }; })} margin={{ left: -20 }}><XAxis dataKey="day" {...axisProps} /><YAxis {...axisProps} domain={[80, 100]} unit="%" /><Tooltip contentStyle={tooltipStyle} /><Line dataKey="present" stroke="hsl(var(--chart-2))" strokeWidth={2.2} dot={{ r: 3 }} /></LineChart></ResponsiveContainer></div></Panel>
        </TabsContent>
        <TabsContent value="summary" className="mt-5 space-y-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Total headcount" value={`${total}`} hint="7 outlets + cloud kitchen" />
        <StatTile label="Joined this month" value={`${hrOnboarding.joined}`} hint={`${hrOnboarding.completed} fully onboarded`} />
        <StatTile label="Onboarding in progress" value={`${hrOnboarding.inProgress}`} hint={`${hrOnboarding.pendingDocs} pending documents`} tone="amber" />
        <StatTile label="Avg attendance (7 days)" value={`${avg.toFixed(1)}%`} tone="green" />
      </div>
        </TabsContent>
      </Tabs>
      <div className="grid gap-5 xl:grid-cols-3">
        <Panel title="Headcount by outlet" className="xl:col-span-2">
          <div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={hrHeadcount.map((h) => ({ name: h.outlet.split(" ")[0], staff: h.staff }))} margin={{ left: -16 }}>
            <XAxis dataKey="name" {...axisProps} /><YAxis {...axisProps} /><Tooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(var(--muted))" }} />
            <Bar dataKey="staff" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
          </BarChart></ResponsiveContainer></div>
        </Panel>
        <div className="space-y-5">
          <Panel title="Attendance" subtitle={`${attendanceDays} days`} action={<ChartDateFilter defaultDays={7} onChange={(r) => setAttendanceDays(r.days)} />}>
            <div className="h-40"><ResponsiveContainer width="100%" height="100%"><LineChart data={Array.from({ length: attendanceDays }, (_, i) => { const item = hrAttendance[i % hrAttendance.length] ?? { day: `D${i + 1}`, present: 0 }; return { ...item, day: attendanceDays <= 7 ? item.day : `D${i + 1}` }; })} margin={{ left: -20 }}>
              <XAxis dataKey="day" {...axisProps} /><YAxis {...axisProps} domain={[80, 100]} unit="%" /><Tooltip contentStyle={tooltipStyle} />
              <Line dataKey="present" stroke="hsl(var(--chart-2))" strokeWidth={2.2} dot={{ r: 3 }} />
            </LineChart></ResponsiveContainer></div>
          </Panel>
          <div className="rounded-xl border border-dashed border-primary/40 bg-accent/50 p-4">
            <div className="flex items-center gap-2"><GraduationCap className="h-5 w-5 text-primary" /><span className="text-[13px] font-semibold">Add Learning Management System</span></div>
            <p className="mt-1 text-xs text-muted-foreground">Connect a training platform to track food-safety and baking courses for your staff.</p>
            <span className="mt-2 inline-block text-[11px] font-semibold text-primary">Available in a later phase</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const urgencyStyles = {
  high: "border-destructive/40 bg-destructive-bg/60 text-destructive",
  medium: "border-warning/40 bg-warning-bg/60 text-warning",
  low: "border-success/40 bg-success-bg/60 text-success",
} as const;

function HiringForecast() {
  const forecast = getHiringForecast();
  return (
    <Panel title="Hiring forecast" subtitle="Based on current operations — demand, kitchen utilization and store growth">
      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Recommended hires" value={`${forecast.totalHires}`} hint="Across all roles" tone="amber" />
        <StatTile label="Next 7 days demand" value={`${formatNum(forecast.weeklyUnits)} units`} hint="Drives staffing needs" />
        <StatTile label="Avg kitchen utilization" value={`${forecast.avgUtilization}%`} hint="Above 60% = add shifts" tone="amber" />
        <StatTile label="Urgent roles" value={`${forecast.roles.filter((r) => r.urgency === "high").length}`} hint="Start hiring now" tone="red" />
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {forecast.roles.map((role) => (
          <div key={role.role} className="rounded-md border border-border p-3.5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <UserPlus className="h-4 w-4 shrink-0 text-primary" />
                <span className="text-[13px] font-semibold">{role.role}</span>
              </div>
              <span className={cn("rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide", urgencyStyles[role.urgency])}>{role.urgency}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
              <span><b className="text-foreground">{role.count}</b> hires</span>
              <span>{role.by}</span>
              <span>{role.location}</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{role.reason}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-muted-foreground">{forecast.note}</p>
      <div className="mt-4">
        <DataTable
          columns={[{ key: "r", label: "Role" }, { key: "l", label: "Location" }, { key: "c", label: "Hires", align: "right" }, { key: "t", label: "Timeline" }, { key: "u", label: "Priority" }]}
          rows={forecast.roles.map((role) => ({ r: role.role, l: role.location, c: role.count, t: role.by, u: <span className={cn("rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase", urgencyStyles[role.urgency])}>{role.urgency}</span> }))}
        />
      </div>
    </Panel>
  );
}

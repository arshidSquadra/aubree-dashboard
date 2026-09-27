import { useState } from "react";
import { FileText, Download, Eye, Calendar, BarChart3, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useModule, ModuleType } from "@/contexts/ModuleContext";
import { cn } from "@/lib/utils";

// Module-specific reports
const moduleReports: Record<ModuleType, Array<{
  id: number;
  name: string;
  type: "weekly" | "monthly" | "quarterly" | "custom";
  period: string;
  status: "ready" | "generating";
  generatedAt: string;
}>> = {
  sales: [
    { id: 1, name: "Weekly Performance Report", type: "weekly", period: "Mar 18-24, 2024", status: "ready", generatedAt: "Mar 25, 2024" },
    { id: 2, name: "Monthly Marketing Report", type: "monthly", period: "February 2024", status: "ready", generatedAt: "Mar 1, 2024" },
    { id: 3, name: "Campaign ROI Analysis", type: "quarterly", period: "Q1 2024", status: "generating", generatedAt: "" },
    { id: 4, name: "Content Performance Summary", type: "monthly", period: "February 2024", status: "ready", generatedAt: "Mar 1, 2024" },
  ],
  hr: [
    { id: 1, name: "Headcount Report", type: "monthly", period: "March 2024", status: "ready", generatedAt: "Mar 20, 2024" },
    { id: 2, name: "Training Completion Report", type: "quarterly", period: "Q1 2024", status: "ready", generatedAt: "Mar 15, 2024" },
    { id: 3, name: "Onboarding Status Report", type: "weekly", period: "Mar 18-24, 2024", status: "ready", generatedAt: "Mar 25, 2024" },
    { id: 4, name: "Attrition Analysis", type: "quarterly", period: "Q1 2024", status: "generating", generatedAt: "" },
  ],
  accounts: [
    { id: 1, name: "Receivables Report", type: "monthly", period: "March 2024", status: "ready", generatedAt: "Mar 20, 2024" },
    { id: 2, name: "Monthly P&L Statement", type: "monthly", period: "February 2024", status: "ready", generatedAt: "Mar 5, 2024" },
    { id: 3, name: "Expense Summary", type: "monthly", period: "February 2024", status: "ready", generatedAt: "Mar 5, 2024" },
    { id: 4, name: "Cash Flow Analysis", type: "quarterly", period: "Q1 2024", status: "generating", generatedAt: "" },
  ],
  operations: [
    { id: 1, name: "SLA Performance Report", type: "weekly", period: "Mar 18-24, 2024", status: "ready", generatedAt: "Mar 25, 2024" },
    { id: 2, name: "Workload Distribution", type: "weekly", period: "Week 12", status: "ready", generatedAt: "Mar 25, 2024" },
    { id: 3, name: "Delivery Timeline Report", type: "monthly", period: "February 2024", status: "ready", generatedAt: "Mar 1, 2024" },
    { id: 4, name: "Resource Utilization", type: "monthly", period: "February 2024", status: "ready", generatedAt: "Mar 1, 2024" },
  ],
};

const typeColors: Record<string, string> = {
  weekly: "bg-blue-500/10 text-blue-400",
  monthly: "bg-green-500/10 text-green-400",
  quarterly: "bg-purple-500/10 text-purple-400",
  custom: "bg-orange-500/10 text-orange-400",
};

export default function Reports() {
  const { activeModule, getModuleLabel } = useModule();
  const [selectedReport, setSelectedReport] = useState<typeof moduleReports.sales[0] | null>(null);

  const reports = moduleReports[activeModule];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{getModuleLabel(activeModule)} Reports</h1>
          <p className="text-muted-foreground">View and download performance reports</p>
        </div>
        <Button className="gap-2" style={{ background: `hsl(var(--module-${activeModule}))` }}>
          <BarChart3 className="w-4 h-4" />
          Generate Report
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card-base p-4">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-5 h-5" style={{ color: `hsl(var(--module-${activeModule}))` }} />
            <span className="text-sm text-muted-foreground">Total Reports</span>
          </div>
          <p className="text-2xl font-bold">{reports.length}</p>
        </div>
        <div className="card-base p-4">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-muted-foreground">Weekly</span>
          </div>
          <p className="text-2xl font-bold">{reports.filter(r => r.type === "weekly").length}</p>
        </div>
        <div className="card-base p-4">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-sm text-muted-foreground">Monthly</span>
          </div>
          <p className="text-2xl font-bold">{reports.filter(r => r.type === "monthly").length}</p>
        </div>
        <div className="card-base p-4">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-muted-foreground">Quarterly</span>
          </div>
          <p className="text-2xl font-bold">{reports.filter(r => r.type === "quarterly").length}</p>
        </div>
      </div>

      {/* Reports List */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Reports</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-2 gap-4">
            {reports.map((report) => (
              <div key={report.id} className="card-base p-5 hover:border-primary/30 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", typeColors[report.type])}>
                    {report.type}
                  </span>
                  {report.status === "generating" && (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-500/10 text-yellow-400 animate-pulse">
                      Generating...
                    </span>
                  )}
                </div>
                <h3 className="font-semibold mb-1">{report.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{report.period}</p>
                {report.status === "ready" ? (
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 gap-1"
                      onClick={() => setSelectedReport(report)}
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 gap-1"
                      style={{ background: `hsl(var(--module-${activeModule}))` }}
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                ) : (
                  <Button size="sm" variant="outline" className="w-full" disabled>
                    Generating...
                  </Button>
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        {["weekly", "monthly", "quarterly"].map((type) => (
          <TabsContent key={type} value={type} className="mt-6">
            <div className="grid grid-cols-2 gap-4">
              {reports.filter(r => r.type === type).map((report) => (
                <div key={report.id} className="card-base p-5 hover:border-primary/30 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", typeColors[report.type])}>
                      {report.type}
                    </span>
                  </div>
                  <h3 className="font-semibold mb-1">{report.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{report.period}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 gap-1">
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 gap-1"
                      style={{ background: `hsl(var(--module-${activeModule}))` }}
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Report Viewer Dialog */}
      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedReport?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="p-4 rounded-lg bg-muted/30">
              <p className="text-sm text-muted-foreground">Period: {selectedReport?.period}</p>
              <p className="text-sm text-muted-foreground">Generated: {selectedReport?.generatedAt}</p>
            </div>
            <div className="h-64 rounded-lg bg-muted/20 flex items-center justify-center">
              <p className="text-muted-foreground">Report preview would display here</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-1">
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
              <Button variant="outline" className="gap-1">
                <Download className="w-4 h-4" />
                Export Excel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

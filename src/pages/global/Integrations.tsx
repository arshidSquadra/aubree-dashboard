import { useState } from "react";
import { Link2, CheckCircle2, AlertCircle, RefreshCw, Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModule, ModuleType } from "@/contexts/ModuleContext";
import { cn } from "@/lib/utils";

// Module-specific integrations
const moduleIntegrations: Record<ModuleType, Array<{
  id: number;
  name: string;
  icon: string;
  status: "connected" | "not_connected" | "error";
  lastSync?: string;
  description: string;
}>> = {
  sales: [
    { id: 1, name: "Meta Ads", icon: "M", status: "connected", lastSync: "2 mins ago", description: "Facebook & Instagram advertising" },
    { id: 2, name: "Google Ads", icon: "G", status: "connected", lastSync: "5 mins ago", description: "Search and display advertising" },
    { id: 3, name: "LinkedIn Ads", icon: "in", status: "connected", lastSync: "10 mins ago", description: "B2B advertising platform" },
    { id: 4, name: "Google Analytics", icon: "GA", status: "connected", lastSync: "1 min ago", description: "Website analytics" },
    { id: 5, name: "Zoho CRM", icon: "Z", status: "connected", lastSync: "3 mins ago", description: "Customer relationship management" },
    { id: 6, name: "HubSpot", icon: "H", status: "not_connected", description: "Marketing automation" },
  ],
  hr: [
    { id: 1, name: "Keka", icon: "K", status: "connected", lastSync: "5 mins ago", description: "Attendance & Payroll management" },
    { id: 2, name: "Lynk LMS", icon: "L", status: "connected", lastSync: "10 mins ago", description: "Learning management system" },
    { id: 3, name: "Slack", icon: "S", status: "not_connected", description: "Team communication" },
    { id: 4, name: "Greenhouse", icon: "GH", status: "not_connected", description: "Applicant tracking system" },
  ],
  accounts: [
    { id: 1, name: "Tally", icon: "T", status: "connected", lastSync: "15 mins ago", description: "Accounting software" },
    { id: 2, name: "Zoho Books", icon: "ZB", status: "not_connected", description: "Online accounting" },
    { id: 3, name: "Razorpay", icon: "R", status: "connected", lastSync: "30 mins ago", description: "Payment gateway" },
    { id: 4, name: "QuickBooks", icon: "QB", status: "not_connected", description: "Small business accounting" },
  ],
  operations: [
    { id: 1, name: "Slack", icon: "S", status: "connected", lastSync: "1 min ago", description: "Team communication" },
    { id: 2, name: "Google Calendar", icon: "GC", status: "connected", lastSync: "2 mins ago", description: "Scheduling" },
    { id: 3, name: "ClickUp", icon: "CU", status: "not_connected", description: "Project management" },
    { id: 4, name: "Jira", icon: "J", status: "not_connected", description: "Issue tracking" },
  ],
};

const iconColors: Record<string, string> = {
  M: "bg-blue-500",
  G: "bg-red-500",
  in: "bg-blue-600",
  GA: "bg-orange-500",
  Z: "bg-red-600",
  H: "bg-orange-600",
  K: "bg-purple-500",
  L: "bg-indigo-500",
  S: "bg-purple-600",
  GH: "bg-green-500",
  T: "bg-blue-700",
  ZB: "bg-green-600",
  R: "bg-blue-500",
  QB: "bg-green-700",
  GC: "bg-blue-400",
  CU: "bg-gradient-to-r from-pink-500 to-purple-500",
  J: "bg-blue-600",
};

export default function Integrations() {
  const { activeModule, getModuleLabel } = useModule();
  const integrations = moduleIntegrations[activeModule];

  const connectedCount = integrations.filter(i => i.status === "connected").length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{getModuleLabel(activeModule)} Integrations</h1>
          <p className="text-muted-foreground">{connectedCount} of {integrations.length} integrations connected</p>
        </div>
        <Button className="gap-2" style={{ background: `hsl(var(--module-${activeModule}))` }}>
          <Plus className="w-4 h-4" />
          Add Integration
        </Button>
      </div>

      {/* Connected Integrations */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Connected</h2>
        <div className="grid grid-cols-3 gap-4">
          {integrations.filter(i => i.status === "connected").map((integration) => (
            <div key={integration.id} className="card-base p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm",
                    iconColors[integration.icon]
                  )}>
                    {integration.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{integration.name}</h3>
                    <p className="text-xs text-muted-foreground">{integration.description}</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs bg-green-500/10 text-green-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <RefreshCw className="w-3 h-3" />
                  Last sync: {integration.lastSync}
                </div>
                <Button variant="ghost" size="sm" className="gap-1">
                  <Settings className="w-3 h-3" />
                  Settings
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Available Integrations */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Available</h2>
        <div className="grid grid-cols-3 gap-4">
          {integrations.filter(i => i.status === "not_connected").map((integration) => (
            <div key={integration.id} className="card-base p-5 opacity-75 hover:opacity-100 transition-opacity">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm opacity-50",
                    iconColors[integration.icon]
                  )}>
                    {integration.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{integration.name}</h3>
                    <p className="text-xs text-muted-foreground">{integration.description}</p>
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full gap-1"
              >
                <Link2 className="w-4 h-4" />
                Connect
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Data Sources Status */}
      <div className="card-base p-5">
        <h3 className="font-semibold mb-4">Data Sources Status</h3>
        <div className="space-y-3">
          {integrations.filter(i => i.status === "connected").map((integration) => (
            <div key={integration.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs",
                  iconColors[integration.icon]
                )}>
                  {integration.icon}
                </div>
                <span className="font-medium">{integration.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground">{integration.lastSync}</span>
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

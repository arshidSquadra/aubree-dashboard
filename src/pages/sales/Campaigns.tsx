import { useState } from "react";
import { TrendingUp, TrendingDown, Play, Pause, BarChart3, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { campaigns, formatCurrency, experiments } from "@/data/mockData";
import { cn } from "@/lib/utils";

const platformTabs = [
  { id: "all", label: "All Platforms" },
  { id: "meta", label: "Meta" },
  { id: "google", label: "Google" },
  { id: "linkedin", label: "LinkedIn" },
];

export default function Campaigns() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [showExperiments, setShowExperiments] = useState(false);

  const filteredCampaigns = selectedTab === "all" 
    ? campaigns 
    : campaigns.filter(c => c.platform === selectedTab);

  const totalSpend = filteredCampaigns.reduce((sum, c) => sum + c.spend, 0);
  const totalLeads = filteredCampaigns.reduce((sum, c) => sum + c.results, 0);
  const avgCPL = totalSpend / totalLeads;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground">Manage your ad campaigns across all platforms</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => setShowExperiments(!showExperiments)}
          >
            <BarChart3 className="w-4 h-4" />
            Experiments ({experiments.length})
          </Button>
          <Button className="gap-2">
            <Play className="w-4 h-4" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card-base p-5">
          <p className="text-sm text-muted-foreground mb-1">Total Spend</p>
          <p className="text-2xl font-bold">{formatCurrency(totalSpend)}</p>
        </div>
        <div className="card-base p-5">
          <p className="text-sm text-muted-foreground mb-1">Total Leads</p>
          <p className="text-2xl font-bold">{totalLeads.toLocaleString()}</p>
        </div>
        <div className="card-base p-5">
          <p className="text-sm text-muted-foreground mb-1">Avg. CPL</p>
          <p className="text-2xl font-bold">{formatCurrency(avgCPL)}</p>
        </div>
        <div className="card-base p-5">
          <p className="text-sm text-muted-foreground mb-1">Active Campaigns</p>
          <p className="text-2xl font-bold">{campaigns.filter(c => c.status === "active").length}</p>
        </div>
      </div>

      {/* Experiments Panel */}
      {showExperiments && (
        <div className="card-base p-5">
          <h3 className="font-semibold mb-4">A/B Experiments</h3>
          <div className="grid grid-cols-2 gap-4">
            {experiments.map((exp) => (
              <div key={exp.id} className="p-4 rounded-lg bg-muted/30">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{exp.name}</h4>
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-medium",
                    exp.status === "running" && "bg-blue-500/10 text-blue-400",
                    exp.status === "completed" && "bg-green-500/10 text-green-400"
                  )}>
                    {exp.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">Campaign: {exp.campaign}</p>
                <div className="space-y-2">
                  {exp.variants.map((variant, idx) => (
                    <div key={idx} className={cn(
                      "flex items-center justify-between p-2 rounded",
                      variant.name === exp.winner && "bg-green-500/10"
                    )}>
                      <span className="text-sm">{variant.name}</span>
                      <div className="flex items-center gap-3 text-sm">
                        <span>CPL: {formatCurrency(variant.cpl)}</span>
                        <span>CTR: {variant.ctr}%</span>
                        {variant.name === exp.winner && (
                          <span className="text-green-400 text-xs font-medium">Winner</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Platform Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          {platformTabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>{tab.label}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedTab} className="mt-4">
          <div className="card-base overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Campaign</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Platform</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Spend</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Results</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">CPL</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">CTR</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="border-b border-border hover:bg-muted/30">
                    <td className="p-4">
                      <p className="font-medium">{campaign.name}</p>
                      <p className="text-xs text-muted-foreground">{campaign.objective}</p>
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium capitalize",
                        campaign.platform === "meta" && "bg-blue-500/10 text-blue-400",
                        campaign.platform === "google" && "bg-red-500/10 text-red-400",
                        campaign.platform === "linkedin" && "bg-blue-600/10 text-blue-300"
                      )}>
                        {campaign.platform}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        campaign.status === "active" && "bg-green-500/10 text-green-400",
                        campaign.status === "paused" && "bg-yellow-500/10 text-yellow-400"
                      )}>
                        {campaign.status}
                      </span>
                    </td>
                    <td className="p-4 font-medium">{formatCurrency(campaign.spend)}</td>
                    <td className="p-4">{campaign.results.toLocaleString()}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{formatCurrency(campaign.cpl)}</span>
                        {campaign.cpl < avgCPL ? (
                          <TrendingDown className="w-4 h-4 text-green-400" />
                        ) : (
                          <TrendingUp className="w-4 h-4 text-red-400" />
                        )}
                      </div>
                    </td>
                    <td className="p-4">{campaign.ctr}%</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          {campaign.status === "active" ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { useState } from "react";
import { DollarSign, User, MoreHorizontal, Plus, Filter, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { salesPipeline } from "@/data/moduleData";
import { formatCurrency } from "@/data/mockData";
import { cn } from "@/lib/utils";

const stages = [
  { id: "discovery", label: "Discovery", color: "bg-blue-500" },
  { id: "qualified", label: "Qualified", color: "bg-purple-500" },
  { id: "proposal", label: "Proposal", color: "bg-yellow-500" },
  { id: "negotiation", label: "Negotiation", color: "bg-orange-500" },
  { id: "closed_won", label: "Closed Won", color: "bg-green-500" },
  { id: "closed_lost", label: "Closed Lost", color: "bg-red-500" },
];

export default function SalesPipeline() {
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState<"kanban" | "list">("kanban");

  const filteredDeals = salesPipeline.filter(deal => 
    deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deal.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStageDeals = (stageId: string) => filteredDeals.filter(d => d.stage === stageId);
  const getStageValue = (stageId: string) => getStageDeals(stageId).reduce((sum, d) => sum + d.value, 0);
  const totalPipelineValue = filteredDeals.filter(d => d.stage !== "closed_lost").reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sales Pipeline</h1>
          <p className="text-muted-foreground">Total Pipeline Value: <span className="text-foreground font-semibold">{formatCurrency(totalPipelineValue)}</span></p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/50">
            <button
              onClick={() => setView("kanban")}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                view === "kanban" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              )}
            >
              Kanban
            </button>
            <button
              onClick={() => setView("list")}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                view === "list" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              )}
            >
              List
            </button>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Deal
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <Input
          placeholder="Search deals..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-64"
        />
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <ArrowUpDown className="w-4 h-4" />
          Sort
        </Button>
      </div>

      {/* Kanban View */}
      {view === "kanban" && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stages.filter(s => s.id !== "closed_lost").map((stage) => (
            <div key={stage.id} className="flex-shrink-0 w-72">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={cn("w-2 h-2 rounded-full", stage.color)} />
                  <h3 className="font-medium text-sm">{stage.label}</h3>
                  <span className="text-xs text-muted-foreground">({getStageDeals(stage.id).length})</span>
                </div>
                <span className="text-xs font-medium text-muted-foreground">{formatCurrency(getStageValue(stage.id))}</span>
              </div>
              
              <div className="space-y-3">
                {getStageDeals(stage.id).map((deal) => (
                  <div 
                    key={deal.id} 
                    className="card-base p-4 cursor-pointer hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{deal.name}</h4>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{deal.company}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-green-400" />
                        <span className="font-semibold text-sm">{formatCurrency(deal.value)}</span>
                      </div>
                      <div className={cn(
                        "px-2 py-0.5 rounded-full text-xs",
                        deal.probability >= 70 && "bg-green-500/10 text-green-400",
                        deal.probability >= 40 && deal.probability < 70 && "bg-yellow-500/10 text-yellow-400",
                        deal.probability < 40 && "bg-red-500/10 text-red-400"
                      )}>
                        {deal.probability}%
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                      <User className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{deal.owner}</span>
                    </div>
                  </div>
                ))}
                
                {getStageDeals(stage.id).length === 0 && (
                  <div className="border border-dashed border-border rounded-lg p-4 text-center text-muted-foreground text-sm">
                    No deals in this stage
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {view === "list" && (
        <div className="card-base overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Deal Name</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Company</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Value</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Stage</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Probability</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Owner</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Next Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeals.map((deal) => {
                const stage = stages.find(s => s.id === deal.stage);
                return (
                  <tr key={deal.id} className="border-b border-border hover:bg-muted/30 cursor-pointer">
                    <td className="p-4">
                      <p className="font-medium">{deal.name}</p>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{deal.company}</td>
                    <td className="p-4 font-semibold">{formatCurrency(deal.value)}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={cn("w-2 h-2 rounded-full", stage?.color)} />
                        <span className="text-sm">{stage?.label}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        deal.probability >= 70 && "bg-green-500/10 text-green-400",
                        deal.probability >= 40 && deal.probability < 70 && "bg-yellow-500/10 text-yellow-400",
                        deal.probability < 40 && "bg-red-500/10 text-red-400"
                      )}>
                        {deal.probability}%
                      </span>
                    </td>
                    <td className="p-4 text-sm">{deal.owner}</td>
                    <td className="p-4 text-sm text-muted-foreground">{deal.nextAction}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Integration Banner */}
      <div className="card-base p-4 flex items-center justify-between bg-gradient-to-r from-primary/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">Zoho CRM Connected</p>
            <p className="text-xs text-muted-foreground">Syncing deals automatically</p>
          </div>
        </div>
        <Button variant="outline" size="sm">Manage Integration</Button>
      </div>
    </div>
  );
}

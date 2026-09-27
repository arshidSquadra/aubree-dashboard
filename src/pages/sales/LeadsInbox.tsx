import { useState } from "react";
import { Mail, Phone, Globe, MessageSquare, User, MoreHorizontal, Filter, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { leads } from "@/data/moduleData";
import { cn } from "@/lib/utils";

const sourceIcons: Record<string, typeof Mail> = {
  meta: Globe,
  google: Globe,
  linkedin: Globe,
  website: Globe,
  whatsapp: MessageSquare,
};

const sourceColors: Record<string, string> = {
  meta: "bg-blue-500/10 text-blue-400",
  google: "bg-red-500/10 text-red-400",
  linkedin: "bg-blue-600/10 text-blue-300",
  website: "bg-purple-500/10 text-purple-400",
  whatsapp: "bg-green-500/10 text-green-400",
};

const statusConfig: Record<string, { label: string; color: string }> = {
  new: { label: "New", color: "bg-blue-500/10 text-blue-400" },
  contacted: { label: "Contacted", color: "bg-yellow-500/10 text-yellow-400" },
  qualified: { label: "Qualified", color: "bg-green-500/10 text-green-400" },
  unqualified: { label: "Unqualified", color: "bg-red-500/10 text-red-400" },
};

export default function LeadsInbox() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    const matchesSource = sourceFilter === "all" || lead.source === sourceFilter;
    return matchesSearch && matchesStatus && matchesSource;
  });

  const newLeadsCount = leads.filter(l => l.status === "new").length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Leads Inbox</h1>
          <p className="text-muted-foreground">{newLeadsCount} new leads awaiting assignment</p>
        </div>
        <Button className="gap-2">
          <Mail className="w-4 h-4" />
          Export Leads
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <Input
          placeholder="Search leads..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-64"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="qualified">Qualified</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            <SelectItem value="meta">Meta</SelectItem>
            <SelectItem value="google">Google</SelectItem>
            <SelectItem value="linkedin">LinkedIn</SelectItem>
            <SelectItem value="website">Website</SelectItem>
            <SelectItem value="whatsapp">WhatsApp</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" className="gap-2">
          <ArrowUpDown className="w-4 h-4" />
          Sort by Score
        </Button>
      </div>

      {/* Leads Table */}
      <div className="card-base overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Lead</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Company</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Source</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Score</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Assigned To</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Created</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((lead) => {
              const SourceIcon = sourceIcons[lead.source] || Globe;
              const status = statusConfig[lead.status] ?? statusConfig["new"];
              if (!status) return null;
              
              return (
                <tr key={lead.id} className="border-b border-border hover:bg-muted/30 cursor-pointer">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{lead.name}</p>
                        <p className="text-xs text-muted-foreground">{lead.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm">{lead.company}</td>
                  <td className="p-4">
                    <div className={cn("inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium", sourceColors[lead.source])}>
                      <SourceIcon className="w-3 h-3" />
                      {lead.source.charAt(0).toUpperCase() + lead.source.slice(1)}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={cn("px-2 py-1 rounded-full text-xs font-medium", status.color)}>
                      {status.label}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full",
                            lead.score >= 80 && "bg-green-500",
                            lead.score >= 60 && lead.score < 80 && "bg-yellow-500",
                            lead.score < 60 && "bg-red-500"
                          )}
                          style={{ width: `${lead.score}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{lead.score}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    {lead.assignedTo ? (
                      <span className="text-sm">{lead.assignedTo}</span>
                    ) : (
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        Assign
                      </Button>
                    )}
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{lead.createdAt}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Mail className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card-base p-4">
          <p className="text-2xl font-bold text-blue-400">{leads.filter(l => l.source === "meta").length}</p>
          <p className="text-sm text-muted-foreground">From Meta</p>
        </div>
        <div className="card-base p-4">
          <p className="text-2xl font-bold text-red-400">{leads.filter(l => l.source === "google").length}</p>
          <p className="text-sm text-muted-foreground">From Google</p>
        </div>
        <div className="card-base p-4">
          <p className="text-2xl font-bold text-blue-300">{leads.filter(l => l.source === "linkedin").length}</p>
          <p className="text-sm text-muted-foreground">From LinkedIn</p>
        </div>
        <div className="card-base p-4">
          <p className="text-2xl font-bold text-green-400">{leads.filter(l => l.source === "whatsapp").length}</p>
          <p className="text-sm text-muted-foreground">From WhatsApp</p>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Rocket, Video, Globe, Search, Workflow, Palette, Calendar, UserPlus, BookOpen, FileText, Receipt, CreditCard, FolderPlus, CheckSquare, AlertTriangle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useModule, ModuleType } from "@/contexts/ModuleContext";
import { cn } from "@/lib/utils";

// Module-specific service catalogs
const serviceCatalogs: Record<ModuleType, Array<{ id: number; name: string; icon: typeof Rocket; description: string; timeline: string; category: string }>> = {
  sales: [
    { id: 1, name: "Launch Seasonal Cake Campaign", icon: Rocket, description: "Full-funnel paid campaign across Meta, Google, or LinkedIn", timeline: "5-7 days", category: "ads" },
    { id: 2, name: "Create 10 Dessert Reels", icon: Video, description: "Short-form video content for Instagram/YouTube Shorts", timeline: "7-10 days", category: "content" },
    { id: 3, name: "Website Celebration Cake Landing Page", icon: Globe, description: "Conversion-optimized landing page design & development", timeline: "7-14 days", category: "web" },
    { id: 4, name: "Local Dessert SEO Sprint", icon: Search, description: "Technical SEO audit and quick-win optimizations", timeline: "5-7 days", category: "seo" },
    { id: 5, name: "Birthday Reminder Automation", icon: Workflow, description: "Email sequences and lead nurturing automation", timeline: "7-10 days", category: "crm" },
    { id: 6, name: "Packaging & Gifting Pack", icon: Palette, description: "Brand refresh or new brand identity design", timeline: "14-21 days", category: "design" },
    { id: 7, name: "Social Media Calendar", icon: Calendar, description: "Monthly content calendar with posts & creatives", timeline: "5-7 days", category: "content" },
  ],
  hr: [
    { id: 1, name: "Create Onboarding Plan", icon: UserPlus, description: "New hire onboarding checklist and task assignment", timeline: "1-2 days", category: "onboarding" },
    { id: 2, name: "Assign Mandatory Training", icon: BookOpen, description: "Assign courses to employees via Lynk LMS", timeline: "Same day", category: "learning" },
    { id: 3, name: "Create/Update Policy", icon: FileText, description: "Draft new HR policy or update existing one", timeline: "3-5 days", category: "policy" },
    { id: 4, name: "Start Performance Review", icon: CheckSquare, description: "Initiate performance review cycle", timeline: "1-2 days", category: "performance" },
    { id: 5, name: "New Hire Setup Request", icon: UserPlus, description: "IT setup, access provisioning for new employee", timeline: "2-3 days", category: "onboarding" },
  ],
  accounts: [
    { id: 1, name: "Raise Invoice", icon: Receipt, description: "Create and send invoice to store", timeline: "Same day", category: "invoicing" },
    { id: 2, name: "Payment Follow-up", icon: CreditCard, description: "Follow up on overdue payment", timeline: "Same day", category: "collections" },
    { id: 3, name: "Submit Expense", icon: CreditCard, description: "Submit expense for approval", timeline: "Same day", category: "expenses" },
    { id: 4, name: "Create Purchase Request", icon: FolderPlus, description: "Create purchase request for approval", timeline: "1-2 days", category: "purchase" },
    { id: 5, name: "Contract Renewal", icon: FileText, description: "Initiate contract renewal process", timeline: "3-5 days", category: "contracts" },
  ],
  operations: [
    { id: 1, name: "Create Project", icon: FolderPlus, description: "Set up new project workspace", timeline: "Same day", category: "projects" },
    { id: 2, name: "Add Task", icon: CheckSquare, description: "Create task from template", timeline: "Same day", category: "tasks" },
    { id: 3, name: "Urgent Fix Request", icon: AlertTriangle, description: "Priority bug/issue fix", timeline: "4-8 hours", category: "support" },
    { id: 4, name: "Schedule Meeting", icon: Calendar, description: "Book store/team meeting", timeline: "Same day", category: "meetings" },
  ],
};

const categoryColors: Record<string, string> = {
  ads: "bg-orange-500/10 border-orange-500/20",
  content: "bg-pink-500/10 border-pink-500/20",
  web: "bg-blue-500/10 border-blue-500/20",
  seo: "bg-green-500/10 border-green-500/20",
  crm: "bg-purple-500/10 border-purple-500/20",
  design: "bg-yellow-500/10 border-yellow-500/20",
  onboarding: "bg-blue-500/10 border-blue-500/20",
  learning: "bg-purple-500/10 border-purple-500/20",
  policy: "bg-gray-500/10 border-gray-500/20",
  performance: "bg-green-500/10 border-green-500/20",
  invoicing: "bg-green-500/10 border-green-500/20",
  collections: "bg-yellow-500/10 border-yellow-500/20",
  expenses: "bg-red-500/10 border-red-500/20",
  purchase: "bg-blue-500/10 border-blue-500/20",
  contracts: "bg-purple-500/10 border-purple-500/20",
  projects: "bg-blue-500/10 border-blue-500/20",
  tasks: "bg-yellow-500/10 border-yellow-500/20",
  support: "bg-red-500/10 border-red-500/20",
  meetings: "bg-purple-500/10 border-purple-500/20",
};

export default function Requests() {
  const { activeModule, getModuleLabel } = useModule();
  const [selectedService, setSelectedService] = useState<typeof serviceCatalogs.sales[0] | null>(null);
  const [showForm, setShowForm] = useState(false);

  const services = serviceCatalogs[activeModule];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{getModuleLabel(activeModule)} Requests</h1>
          <p className="text-muted-foreground">Request services and track your submissions</p>
        </div>
      </div>

      {/* Service Catalog */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Service Catalog</h2>
        <div className="grid grid-cols-3 gap-4">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                onClick={() => setSelectedService(service)}
                className={cn(
                  "card-base p-5 cursor-pointer transition-all hover:border-primary/30 hover:shadow-lg hover:-translate-y-1",
                  categoryColors[service.category]
                )}
              >
                <div className="flex items-start gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: `hsl(var(--module-${activeModule}) / 0.1)` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: `hsl(var(--module-${activeModule}))` }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{service.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                    <span className="text-xs text-muted-foreground">Timeline: {service.timeline}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Requests */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Requests</h2>
        <div className="card-base overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Request</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Type</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Submitted</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border hover:bg-muted/20">
                <td className="p-4 font-medium">Launch Summer Mango Collection</td>
                <td className="p-4"><span className="px-2 py-0.5 rounded-full text-xs bg-orange-500/10 text-orange-400">Campaign</span></td>
                <td className="p-4 text-muted-foreground">Mar 15, 2024</td>
                <td className="p-4"><span className="px-2 py-1 rounded-full text-xs bg-yellow-500/10 text-yellow-400">In Progress</span></td>
                <td className="p-4"><Button variant="ghost" size="sm">View</Button></td>
              </tr>
              <tr className="border-b border-border hover:bg-muted/20">
                <td className="p-4 font-medium">Create 10 Dessert Reels - March Batch</td>
                <td className="p-4"><span className="px-2 py-0.5 rounded-full text-xs bg-pink-500/10 text-pink-400">Content</span></td>
                <td className="p-4 text-muted-foreground">Mar 12, 2024</td>
                <td className="p-4"><span className="px-2 py-1 rounded-full text-xs bg-blue-500/10 text-blue-400">New</span></td>
                <td className="p-4"><Button variant="ghost" size="sm">View</Button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Service Detail Dialog */}
      <Dialog open={!!selectedService && !showForm} onOpenChange={() => setSelectedService(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedService?.name}</DialogTitle>
            <DialogDescription>{selectedService?.description}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <span className="text-sm text-muted-foreground">Timeline</span>
              <span className="font-medium">{selectedService?.timeline}</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedService(null)}>Cancel</Button>
            <Button 
              onClick={() => setShowForm(true)}
              style={{ background: `hsl(var(--module-${activeModule}))` }}
            >
              Request This Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request Form Dialog */}
      <Dialog open={showForm} onOpenChange={() => { setShowForm(false); setSelectedService(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Request: {selectedService?.name}</DialogTitle>
            <DialogDescription>Fill in the details for your request</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Goal / Objective</label>
              <Textarea placeholder="What do you want to achieve?" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Priority</label>
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Deadline</label>
                <Input type="date" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Additional Notes</label>
              <Textarea placeholder="Any specific requirements or references?" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowForm(false); setSelectedService(null); }}>Cancel</Button>
            <Button 
              onClick={() => { setShowForm(false); setSelectedService(null); }}
              style={{ background: `hsl(var(--module-${activeModule}))` }}
            >
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

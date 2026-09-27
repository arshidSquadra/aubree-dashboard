import { useState } from "react";
import { CheckCircle2, XCircle, Clock, Eye, MessageSquare, Image, FileText, CreditCard, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useModule, ModuleType } from "@/contexts/ModuleContext";
import { cn } from "@/lib/utils";

// Module-specific approvals
const moduleApprovals: Record<ModuleType, Array<{
  id: number;
  title: string;
  type: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  submittedBy: string;
  thumbnail?: string;
  content?: string;
}>> = {
  sales: [
    { id: 1, title: "Signature Cake Collection Carousel v3", type: "Creative", status: "pending", submittedAt: "2024-03-18", submittedBy: "Design Team", thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop" },
    { id: 2, title: "Celebration Cake Ad Copy", type: "Copy", status: "pending", submittedAt: "2024-03-17", submittedBy: "Content Team", content: "Ensure your kitchen team is prepared for any situation. Our Celebration Cake Collection program covers emergency protocols, equipment handling, and regulatory compliance." },
    { id: 3, title: "Celebration Cake Landing Page - Celebration Cakes", type: "Celebration Cake Landing Page", status: "pending", submittedAt: "2024-03-16", submittedBy: "Dev Team", thumbnail: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=400&h=300&fit=crop" },
  ],
  hr: [
    { id: 1, title: "Leave Request - Vikram Singh", type: "Leave", status: "pending", submittedAt: "2024-03-18", submittedBy: "Vikram Singh", content: "Annual leave request for March 25-29 (5 days)" },
    { id: 2, title: "Remote Work Policy Update", type: "Policy", status: "pending", submittedAt: "2024-03-15", submittedBy: "HR Team", content: "Updated remote work guidelines for 2024" },
  ],
  accounts: [
    { id: 1, title: "Festive Campaign Spend - March", type: "Expense", status: "pending", submittedAt: "2024-03-18", submittedBy: "Marketing", content: "Monthly ad spend for Meta campaigns: ₹2,50,000" },
    { id: 2, title: "Invoice #INV-2024-007", type: "Invoice", status: "pending", submittedAt: "2024-03-17", submittedBy: "Finance Team", content: "Invoice for Aubree Bengaluru - Quarterly retainer" },
  ],
  operations: [
    { id: 1, title: "Celebration Cake Landing Page Final", type: "Deliverable", status: "pending", submittedAt: "2024-03-18", submittedBy: "Dev Team", thumbnail: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=400&h=300&fit=crop" },
    { id: 2, title: "Campaign Assets Pack", type: "Deliverable", status: "pending", submittedAt: "2024-03-17", submittedBy: "Design Team", thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop" },
  ],
};

const typeIcons: Record<string, typeof Image> = {
  Creative: Image,
  Copy: FileText,
  "Celebration Cake Landing Page": FileText,
  Leave: Calendar,
  Policy: FileText,
  Expense: CreditCard,
  Invoice: FileText,
  Deliverable: Image,
};

export default function Approvals() {
  const { activeModule, getModuleLabel } = useModule();
  const [selectedItem, setSelectedItem] = useState<typeof moduleApprovals.sales[0] | null>(null);
  const [comment, setComment] = useState("");

  const approvals = moduleApprovals[activeModule];
  const pendingCount = approvals.filter(a => a.status === "pending").length;

  const handleApprove = () => {
    setSelectedItem(null);
    setComment("");
  };

  const handleReject = () => {
    setSelectedItem(null);
    setComment("");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{getModuleLabel(activeModule)} Approvals</h1>
          <p className="text-muted-foreground">{pendingCount} items pending your approval</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">
            Pending
            {pendingCount > 0 && (
              <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold" style={{ background: `hsl(var(--module-${activeModule}))`, color: 'white' }}>
                {pendingCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          <div className="grid grid-cols-2 gap-4">
            {approvals.filter(a => a.status === "pending").map((item) => {
              const Icon = typeIcons[item.type] || FileText;
              return (
                <div
                  key={item.id}
                  className="card-base p-5 cursor-pointer hover:border-primary/30 transition-all"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="flex items-start gap-4">
                    {item.thumbnail ? (
                      <img src={item.thumbnail} alt={item.title} className="w-20 h-20 rounded-lg object-cover" />
                    ) : (
                      <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center">
                        <Icon className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <span className="px-2 py-0.5 rounded-full text-xs bg-muted">{item.type}</span>
                        <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-500/10 text-yellow-400">Pending</span>
                      </div>
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {item.submittedBy} • {item.submittedAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button 
                      size="sm" 
                      className="flex-1 gap-1"
                      style={{ background: `hsl(var(--module-${activeModule}))` }}
                      onClick={(e) => { e.stopPropagation(); handleApprove(); }}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 gap-1"
                      onClick={(e) => { e.stopPropagation(); setSelectedItem(item); }}
                    >
                      <Eye className="w-4 h-4" />
                      Review
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="approved" className="mt-6">
          <div className="card-base p-8 text-center">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-green-400" />
            <h3 className="font-semibold mb-2">All caught up!</h3>
            <p className="text-muted-foreground">Approved items will appear here</p>
          </div>
        </TabsContent>

        <TabsContent value="rejected" className="mt-6">
          <div className="card-base p-8 text-center">
            <XCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">No rejected items</h3>
            <p className="text-muted-foreground">Rejected items will appear here</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Review Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedItem?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedItem?.thumbnail && (
              <img src={selectedItem.thumbnail} alt={selectedItem.title} className="w-full h-64 rounded-lg object-cover" />
            )}
            {selectedItem?.content && (
              <div className="p-4 rounded-lg bg-muted/30">
                <p className="text-sm">{selectedItem.content}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 rounded-lg bg-muted/30">
                <span className="text-muted-foreground">Type:</span>
                <span className="ml-2 font-medium">{selectedItem?.type}</span>
              </div>
              <div className="p-3 rounded-lg bg-muted/30">
                <span className="text-muted-foreground">Submitted:</span>
                <span className="ml-2 font-medium">{selectedItem?.submittedAt}</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Add Comment</label>
              <Textarea 
                placeholder="Add feedback or notes..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="gap-1" onClick={handleReject}>
              <XCircle className="w-4 h-4" />
              Request Changes
            </Button>
            <Button 
              className="gap-1"
              style={{ background: `hsl(var(--module-${activeModule}))` }}
              onClick={handleApprove}
            >
              <CheckCircle2 className="w-4 h-4" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

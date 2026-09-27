import { useState } from "react";
import { Receipt, Download, Send, MoreHorizontal, Plus, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { invoices } from "@/data/moduleData";
import { formatCurrency } from "@/data/mockData";
import { cn } from "@/lib/utils";

export default function Invoices() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.store.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPending = invoices.filter(i => i.status === "pending").reduce((sum, i) => sum + i.amount, 0);
  const totalOverdue = invoices.filter(i => i.status === "overdue").reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Invoices</h1>
          <p className="text-muted-foreground">{invoices.length} total invoices</p>
        </div>
        <Button className="gap-2" style={{ background: 'hsl(var(--module-accounts))' }}>
          <Plus className="w-4 h-4" />
          Create Invoice
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card-base p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Outstanding</p>
          <p className="text-2xl font-bold">{formatCurrency(totalPending + totalOverdue)}</p>
        </div>
        <div className="card-base p-4">
          <p className="text-sm text-muted-foreground mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-400">{formatCurrency(totalPending)}</p>
        </div>
        <div className="card-base p-4">
          <p className="text-sm text-muted-foreground mb-1">Overdue</p>
          <p className="text-2xl font-bold text-red-400">{formatCurrency(totalOverdue)}</p>
        </div>
        <div className="card-base p-4">
          <p className="text-sm text-muted-foreground mb-1">Paid This Month</p>
          <p className="text-2xl font-bold text-green-400">{formatCurrency(680000)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-10"
            />
          </div>
          <Tabs value={statusFilter} onValueChange={setStatusFilter}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="overdue">Overdue</TabsTrigger>
              <TabsTrigger value="paid">Paid</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          More Filters
        </Button>
      </div>

      {/* Invoice Table */}
      <div className="card-base overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Invoice #</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Store</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Amount</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Issued</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Due Date</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((invoice) => (
              <tr key={invoice.id} className="border-b border-border hover:bg-muted/20 cursor-pointer">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      invoice.status === "paid" && "bg-green-500/10",
                      invoice.status === "pending" && "bg-yellow-500/10",
                      invoice.status === "overdue" && "bg-red-500/10"
                    )}>
                      <Receipt className={cn(
                        "w-5 h-5",
                        invoice.status === "paid" && "text-green-400",
                        invoice.status === "pending" && "text-yellow-400",
                        invoice.status === "overdue" && "text-red-400"
                      )} />
                    </div>
                    <span className="font-medium">{invoice.invoiceNo}</span>
                  </div>
                </td>
                <td className="p-4">{invoice.store}</td>
                <td className="p-4 font-semibold">{formatCurrency(invoice.amount)}</td>
                <td className="p-4 text-muted-foreground">{invoice.issuedDate}</td>
                <td className="p-4 text-muted-foreground">{invoice.dueDate}</td>
                <td className="p-4">
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    invoice.status === "paid" && "bg-green-500/10 text-green-400",
                    invoice.status === "pending" && "bg-yellow-500/10 text-yellow-400",
                    invoice.status === "overdue" && "bg-red-500/10 text-red-400"
                  )}>
                    {invoice.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Send className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

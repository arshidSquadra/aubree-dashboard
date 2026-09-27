import { DollarSign, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Clock, ArrowRight, Receipt, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/router-compat";
import { dashboardMetrics, invoices, expenses } from "@/data/moduleData";
import { formatCurrency } from "@/data/mockData";
import { cn } from "@/lib/utils";

export default function AccountsDashboard() {
  const metrics = dashboardMetrics.accounts;
  const overdueInvoices = invoices.filter(i => i.status === "overdue");
  const pendingExpenses = expenses.filter(e => e.status === "pending");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Finance Dashboard</h1>
          <p className="text-muted-foreground">Financial overview for Aubree Bengaluru</p>
        </div>
        <Button className="gap-2" style={{ background: 'hsl(var(--module-accounts))' }}>
          <Receipt className="w-4 h-4" />
          Raise Invoice
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-4">
        {metrics.kpis.map((kpi) => {
          const isPositive = kpi.change > 0;
          const displayValue = formatCurrency(kpi.value);

          return (
            <div key={kpi.label} className="card-base p-5 hover:border-[hsl(var(--module-accounts))]/30 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'hsl(var(--module-accounts) / 0.1)' }}
                >
                  <DollarSign className="w-5 h-5" style={{ color: 'hsl(var(--module-accounts))' }} />
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                  isPositive && kpi.label !== "Overdue" && "bg-green-500/10 text-green-400",
                  isPositive && kpi.label === "Overdue" && "bg-red-500/10 text-red-400",
                  !isPositive && kpi.label !== "Overdue" && "bg-red-500/10 text-red-400",
                  !isPositive && kpi.label === "Overdue" && "bg-green-500/10 text-green-400"
                )}>
                  {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(kpi.change)}%
                </div>
              </div>
              <p className="text-2xl font-bold mb-1">{displayValue}</p>
              <p className="text-sm text-muted-foreground">{kpi.label}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Link to="/accounts/invoices" className="card-base p-5 hover:border-[hsl(var(--module-accounts))]/30 transition-all group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Pending Invoices</span>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-[hsl(var(--module-accounts))] transition-colors" />
          </div>
          <p className="text-3xl font-bold">{invoices.filter(i => i.status === "pending").length}</p>
          <p className="text-xs text-muted-foreground mt-1">Awaiting payment</p>
        </Link>

        <Link to="/accounts/payments" className="card-base p-5 hover:border-red-500/30 transition-all group border-red-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-red-400">Overdue</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-3xl font-bold text-red-400">{overdueInvoices.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Requires follow-up</p>
        </Link>

        <Link to="/accounts/expenses" className="card-base p-5 hover:border-[hsl(var(--module-accounts))]/30 transition-all group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Expense Approvals</span>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-[hsl(var(--module-accounts))] transition-colors" />
          </div>
          <p className="text-3xl font-bold">{pendingExpenses.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Pending approval</p>
        </Link>

        <Link to="/accounts/contracts" className="card-base p-5 hover:border-[hsl(var(--module-accounts))]/30 transition-all group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Contract Renewals</span>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-[hsl(var(--module-accounts))] transition-colors" />
          </div>
          <p className="text-3xl font-bold">2</p>
          <p className="text-xs text-muted-foreground mt-1">Due this quarter</p>
        </Link>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <div className="card-base p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Recent Invoices</h3>
            <Link to="/accounts/invoices" className="text-xs text-[hsl(var(--module-accounts))] hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {invoices.slice(0, 4).map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
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
                  <div>
                    <p className="font-medium text-sm">{invoice.invoiceNo}</p>
                    <p className="text-xs text-muted-foreground">{invoice.store}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(invoice.amount)}</p>
                  <span className={cn(
                    "text-xs font-medium",
                    invoice.status === "paid" && "text-green-400",
                    invoice.status === "pending" && "text-yellow-400",
                    invoice.status === "overdue" && "text-red-400"
                  )}>
                    {invoice.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Expenses */}
        <div className="card-base p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Expense Approvals</h3>
            <Link to="/accounts/expenses" className="text-xs text-[hsl(var(--module-accounts))] hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {expenses.filter(e => e.status === "pending").map((expense) => (
              <div key={expense.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{expense.description}</p>
                    <p className="text-xs text-muted-foreground">{expense.submittedBy} • {expense.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(expense.amount)}</p>
                  <div className="flex gap-2 mt-1">
                    <Button size="sm" variant="ghost" className="h-6 px-2 text-xs text-red-400">Reject</Button>
                    <Button size="sm" className="h-6 px-2 text-xs" style={{ background: 'hsl(var(--module-accounts))' }}>Approve</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Integration Banner */}
      <div className="card-base p-5 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, hsl(var(--module-accounts) / 0.1), transparent)' }}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'hsl(var(--module-accounts) / 0.2)' }}>
            <DollarSign className="w-6 h-6" style={{ color: 'hsl(var(--module-accounts))' }} />
          </div>
          <div>
            <p className="font-semibold">Tally Connected</p>
            <p className="text-sm text-muted-foreground">Syncing invoices and expenses automatically</p>
          </div>
        </div>
        <Button variant="outline">Manage Integration</Button>
      </div>
    </div>
  );
}

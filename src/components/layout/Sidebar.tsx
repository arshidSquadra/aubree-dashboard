import { Link, useLocation, useNavigate } from "@/lib/router-compat";
import {
  Home,
  TrendingUp,
  Users,
  FileText,
  BarChart3,
  Palette,
  Link2,
  Settings,
  LayoutGrid,
  Inbox,
  Activity,
  Calendar,
  BookOpen,
  Sparkles,
  Target,
  Mail,
  Megaphone,
  GraduationCap,
  ClipboardList,
  Clock,
  Star,
  FileCheck,
  CreditCard,
  Receipt,
  PiggyBank,
  DollarSign,
  FileSignature,
  CheckSquare,
  Shield,
  FolderOpen,
  Calculator,
  Settings2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useModule, ModuleType } from "@/contexts/ModuleContext";
import { ModuleSwitcher } from "./ModuleSwitcher";

// Module-specific navigation items
const moduleNavItems: Record<ModuleType, Array<{ path: string; icon: typeof Home; label: string; badge?: string }>> = {
  sales: [
    { path: "/sales", icon: Home, label: "Overview" },
    { path: "/sales/pipeline", icon: Target, label: "Sales Pipeline" },
    { path: "/sales/leads", icon: Mail, label: "Leads", badge: "12" },
    { path: "/sales/campaigns", icon: Megaphone, label: "Campaigns" },
    { path: "/sales/content", icon: BarChart3, label: "Content Performance" },
    { path: "/sales/playbooks", icon: BookOpen, label: "Playbooks" },
    { path: "/sales/meetings", icon: Calendar, label: "Meetings & MOM" },
  ],
  hr: [
    { path: "/hr", icon: Home, label: "HR Dashboard" },
    { path: "/hr/employees", icon: Users, label: "Employees" },
    { path: "/hr/onboarding", icon: ClipboardList, label: "Onboarding", badge: "4" },
    { path: "/hr/leave", icon: Clock, label: "Leave & Attendance" },
    { path: "/hr/performance", icon: Star, label: "Performance" },
    { path: "/hr/learning", icon: GraduationCap, label: "Learning (Lynk)" },
    { path: "/hr/policies", icon: FileCheck, label: "Policies & Docs" },
  ],
  accounts: [
    { path: "/accounts", icon: Home, label: "Finance Dashboard" },
    { path: "/accounts/invoices", icon: Receipt, label: "Invoices" },
    { path: "/accounts/payments", icon: CreditCard, label: "Payments & Collections", badge: "5" },
    { path: "/accounts/expenses", icon: DollarSign, label: "Expenses" },
    { path: "/accounts/profitability", icon: PiggyBank, label: "Profitability" },
    { path: "/accounts/contracts", icon: FileSignature, label: "Contracts" },
  ],
  operations: [
    { path: "/ops", icon: Home, label: "Ops Dashboard" },
    { path: "/ops/workboard", icon: LayoutGrid, label: "Workboard" },
    { path: "/ops/tasks", icon: CheckSquare, label: "Tasks", badge: "8" },
    { path: "/ops/qa", icon: Shield, label: "QA & Checklists" },
    { path: "/ops/calendar", icon: Calendar, label: "Calendar" },
    { path: "/ops/templates", icon: FolderOpen, label: "SOP / Templates" },
  ],
};

// Global navigation items (shared across all modules)
const globalNavItems = [
  { path: "/requests", icon: Inbox, label: "Requests" },
  { path: "/approvals", icon: FileText, label: "Approvals", badge: "6" },
  { path: "/reports", icon: BarChart3, label: "Reports" },
  { path: "/integrations", icon: Link2, label: "Integrations" },
  { path: "/settings", icon: Settings, label: "Settings" },
];

interface SidebarProps {
  mobile?: boolean;
  onNavigate?: () => void;
}

export function Sidebar({ mobile = false, onNavigate }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { activeModule, selectedCompany, getModuleLabel } = useModule();
  
  const navItems = moduleNavItems[activeModule];

  const handleModuleChange = () => {
    // Navigate to the module's home page when switching
    const defaultPaths: Record<ModuleType, string> = {
      sales: "/sales",
      hr: "/hr",
      accounts: "/accounts",
      operations: "/ops",
    };
    navigate(defaultPaths[activeModule]);
  };

  return (
    <aside
      className={cn(
        "h-screen flex-col transition-all duration-300",
        mobile ? "relative flex w-full" : "fixed left-0 top-0 z-50 hidden lg:flex",
        "w-[260px]"
      )}
      style={{ background: 'hsl(var(--sidebar))' }}
    >
      {/* Logo */}
      <div className="h-16 px-4 flex items-center gap-3 border-b" style={{ borderColor: 'hsl(var(--sidebar-border))' }}>
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `linear-gradient(135deg, hsl(var(--module-${activeModule})), hsl(var(--module-${activeModule}) / 0.7))` }}
        >
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        {(
          <div>
            <h1 className="text-base font-bold text-[hsl(var(--sidebar-foreground))]">Aubree</h1>
            <p className="text-[11px]" style={{ color: 'hsl(var(--sidebar-muted))' }}>
              {getModuleLabel(activeModule)}
            </p>
          </div>
        )}
      </div>

      {/* Company indicator */}
      {(
        <div className="px-4 py-3 border-b" style={{ borderColor: 'hsl(var(--sidebar-border))' }}>
          <div className="flex items-center gap-3">
            <div 
              className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold" 
              style={{ background: 'hsl(var(--sidebar-accent))', color: 'hsl(var(--sidebar-foreground))' }}
            >
              {selectedCompany.logo}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[hsl(var(--sidebar-foreground))] truncate">{selectedCompany.name}</p>
              <div className="flex items-center gap-1.5">
                <span className={cn(
                  "w-2 h-2 rounded-full",
                  selectedCompany.health === "green" && "bg-green-500",
                  selectedCompany.health === "amber" && "bg-yellow-500",
                  selectedCompany.health === "red" && "bg-red-500"
                )} />
                <p className="text-[11px] capitalize" style={{ color: 'hsl(var(--sidebar-muted))' }}>
                  {selectedCompany.health} status
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Module Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          // Module home paths ("/sales", "/hr", ...) match exactly so they
          // don't stay highlighted while a sub-page of the same module is open.
          const isModuleHome = ["/sales", "/hr", "/accounts", "/ops"].includes(item.path);
          const isActive = location.pathname === item.path ||
            (!isModuleHome && location.pathname.startsWith(item.path + "/"));
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                isActive 
                  ? "font-medium" 
                  : "hover:bg-[hsl(var(--sidebar-accent))]"
              )}
              style={{
                color: isActive ? 'hsl(var(--sidebar-foreground))' : 'hsl(var(--sidebar-foreground) / 0.65)',
                background: isActive ? 'hsl(var(--sidebar-accent))' : undefined,
                borderLeft: isActive ? `3px solid hsl(var(--module-${activeModule}))` : '3px solid transparent',
              }}
            >
              <Icon 
                className="w-[18px] h-[18px] flex-shrink-0"
                style={{ color: isActive ? `hsl(var(--module-${activeModule}))` : undefined }} 
              />
              {(
                <>
                  <span className="flex-1 text-[13px]">{item.label}</span>
                  {item.badge && (
                    <span 
                      className="px-1.5 py-0.5 text-[10px] font-bold rounded-full"
                      style={{ background: `hsl(var(--module-${activeModule}))`, color: 'white' }}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}

        {/* Global Nav */}
        {(
          <div className="pt-4 mt-4 border-t" style={{ borderColor: 'hsl(var(--sidebar-border))' }}>
            <p className="px-3 mb-2 text-[10px] uppercase tracking-wider" 
               style={{ color: 'hsl(var(--sidebar-muted))' }}>
              Global
            </p>
          </div>
        )}
        
        {globalNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                isActive 
                  ? "font-medium" 
                  : "hover:bg-[hsl(var(--sidebar-accent))]"
              )}
              style={{
                color: isActive ? 'hsl(var(--sidebar-foreground))' : 'hsl(var(--sidebar-foreground) / 0.65)',
                background: isActive ? 'hsl(var(--sidebar-accent))' : undefined,
              }}
            >
              <Icon className="w-[18px] h-[18px] flex-shrink-0" />
              {(
                <>
                  <span className="flex-1 text-[13px]">{item.label}</span>
                  {item.badge && (
                    <span 
                      className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-primary"
                      style={{ color: 'white' }}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Module Switcher */}
      <div className="border-t" style={{ borderColor: 'hsl(var(--sidebar-border))' }}>
        <ModuleSwitcher />
      </div>
    </aside>
  );
}

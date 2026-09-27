import { TrendingUp, Users, Calculator, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useModule, ModuleType } from "@/contexts/ModuleContext";
import { useNavigate } from "@/lib/router-compat";

const modules: { id: ModuleType; label: string; icon: typeof TrendingUp }[] = [
  { id: "sales", label: "Sales & Marketing", icon: TrendingUp },
  { id: "hr", label: "HR", icon: Users },
  { id: "accounts", label: "Accounts", icon: Calculator },
  { id: "operations", label: "Operations", icon: Settings2 },
];

interface ModuleSwitcherProps {
  collapsed?: boolean;
}

export function ModuleSwitcher({ collapsed = false }: ModuleSwitcherProps) {
  const { activeModule, setActiveModule } = useModule();
  const navigate = useNavigate();
  const defaultPaths: Record<ModuleType, string> = {
    sales: "/sales",
    hr: "/hr",
    accounts: "/accounts",
    operations: "/ops",
  };

  return (
    <div className="p-2">
      {!collapsed && (
        <p className="px-2 mb-2 text-[10px] uppercase tracking-wider" 
           style={{ color: 'hsl(var(--sidebar-muted))' }}>
          Modules
        </p>
      )}
      <div className={cn(
        "grid gap-1",
        collapsed ? "grid-cols-1" : "grid-cols-2"
      )}>
        {modules.map((module) => {
          const isActive = activeModule === module.id;
          const Icon = module.icon;
          
          return (
            <button
              key={module.id}
              onClick={() => {
                setActiveModule(module.id);
                navigate(defaultPaths[module.id]);
              }}
              className={cn(
                "relative flex items-center gap-2 px-2.5 py-2 rounded-lg transition-all duration-300",
                collapsed && "justify-center",
                isActive 
                  ? "module-active" 
                  : "hover:bg-[hsl(var(--sidebar-accent))]"
              )}
              style={{
                background: isActive ? `hsl(var(--module-${module.id}) / 0.15)` : undefined,
                borderLeft: collapsed ? undefined : (isActive ? `3px solid hsl(var(--module-${module.id}))` : '3px solid transparent'),
              }}
            >
              <Icon 
                className={cn("w-4 h-4 flex-shrink-0 transition-colors duration-300")}
                style={{ color: isActive ? `hsl(var(--module-${module.id}))` : 'hsl(var(--sidebar-foreground) / 0.6)' }}
              />
              {!collapsed && (
                <span 
                  className={cn(
                    "text-[11px] font-medium truncate transition-colors duration-300",
                    isActive ? "text-[hsl(var(--sidebar-foreground))]" : "text-[hsl(var(--sidebar-foreground)_/_0.6)]"
                  )}
                >
                  {module.label}
                </span>
              )}
              {isActive && !collapsed && (
                <span 
                  className="absolute right-2 w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: `hsl(var(--module-${module.id}))` }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

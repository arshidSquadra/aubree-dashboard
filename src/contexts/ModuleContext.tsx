import type React from "react";
import { createContext, useContext, useState, ReactNode, useCallback } from "react";

export type ModuleType = "sales" | "hr" | "accounts" | "operations";
export type UserRole = "owner" | "dept_head" | "core_member";

interface Company {
  id: string;
  name: string;
  logo: string;
  health: "green" | "amber" | "red";
}

interface ModuleContextType {
  activeModule: ModuleType;
  setActiveModule: (module: ModuleType) => void;
  selectedCompany: Company;
  setSelectedCompany: (company: Company) => void;
  companies: Company[];
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  dateRange: "7d" | "30d" | "custom";
  setDateRange: (range: "7d" | "30d" | "custom") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  getModuleColor: (module: ModuleType) => string;
  getModuleIcon: (module: ModuleType) => string;
  getModuleLabel: (module: ModuleType) => string;
}

const companies: Company[] = [
  { id: "bengaluru", name: "Aubree Bengaluru", logo: "AB", health: "green" },
  { id: "koramangala", name: "Aubree Koramangala", logo: "AK", health: "amber" },
  { id: "indiranagar", name: "Aubree Indiranagar", logo: "AI", health: "red" },
];

// Keep one context instance across hot reloads so providers and consumers always match.
const globalKey = "__aubreeModuleContext" as const;
const g = globalThis as unknown as Record<string, React.Context<ModuleContextType | undefined> | undefined>;
const ModuleContext = g[globalKey] ?? (g[globalKey] = createContext<ModuleContextType | undefined>(undefined));

export function ModuleProvider({ children }: { children: ReactNode }) {
  const [activeModule, setActiveModule] = useState<ModuleType>("sales");
  const [selectedCompany, setSelectedCompany] = useState<Company>({ id: "bengaluru", name: "Aubree Bengaluru", logo: "AB", health: "green" });
  const [userRole, setUserRole] = useState<UserRole>("owner");
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "custom">("7d");
  const [searchQuery, setSearchQuery] = useState("");

  const getModuleColor = useCallback((module: ModuleType): string => {
    const colors = {
      sales: "hsl(var(--module-sales))",
      hr: "hsl(var(--module-hr))",
      accounts: "hsl(var(--module-accounts))",
      operations: "hsl(var(--module-operations))",
    };
    return colors[module];
  }, []);

  const getModuleIcon = useCallback((module: ModuleType): string => {
    const icons = {
      sales: "TrendingUp",
      hr: "Users",
      accounts: "Calculator",
      operations: "Settings",
    };
    return icons[module];
  }, []);

  const getModuleLabel = useCallback((module: ModuleType): string => {
    const labels = {
      sales: "Sales & Marketing",
      hr: "HR",
      accounts: "Accounts",
      operations: "Operations",
    };
    return labels[module];
  }, []);

  return (
    <ModuleContext.Provider
      value={{
        activeModule,
        setActiveModule,
        selectedCompany,
        setSelectedCompany,
        companies,
        userRole,
        setUserRole,
        dateRange,
        setDateRange,
        searchQuery,
        setSearchQuery,
        getModuleColor,
        getModuleIcon,
        getModuleLabel,
      }}
    >
      {children}
    </ModuleContext.Provider>
  );
}

export function useModule() {
  const context = useContext(ModuleContext);
  if (!context) {
    throw new Error("useModule must be used within ModuleProvider");
  }
  return context;
}

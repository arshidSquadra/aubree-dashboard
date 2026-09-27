import { useEffect, useState, type ComponentType } from "react";
import { NavigationProvider } from "@/lib/router-compat";
import { OwnerProvider, useOwner } from "@/contexts/OwnerContext";
import { OwnerSidebar } from "@/components/owner/OwnerSidebar";
import { OwnerHeader } from "@/components/owner/OwnerHeader";
import { AskAIPanel } from "@/components/owner/AskAIPanel";
import { Toaster } from "@/components/ui/sonner";
import { permissions, sections } from "@/config/roles";
import { cn } from "@/lib/utils";
import Overview from "@/pages/owner/Overview";
import Sales from "@/pages/owner/Sales";
import Marketing from "@/pages/owner/Marketing";
import Operations from "@/pages/owner/Operations";
import Reports from "@/pages/owner/Reports";
import HR from "@/pages/owner/HR";
import Accounts from "@/pages/owner/Accounts";
import AuditLog from "@/pages/owner/AuditLog";
import ComingSoon from "@/pages/owner/ComingSoon";

const pages: Record<string, ComponentType> = {
  "/": Overview, "/sales": Sales, "/marketing": Marketing, "/operations": Operations,
  "/reports": Reports, "/hr": HR, "/accounts": Accounts, "/audit-log": AuditLog,
};

function Shell({ path }: { path: string }) {
  const { role, askOpen } = useOwner();
  const section = sections.find((s) => s.path === path);
  const allowed = !section || permissions[role].includes(section.id);
  const Page = role !== "owner" || !allowed ? ComingSoon : pages[path] ?? Overview;
  return (
    <div className="min-h-screen bg-background">
      <OwnerSidebar />
      <OwnerHeader />
      <main className={cn("min-h-screen min-w-0 pt-16 transition-[padding] duration-300 lg:ml-[248px]", askOpen && "xl:pr-[400px]")}>
        <div className="mx-auto max-w-[1800px] p-3 sm:p-4 lg:p-5 xl:p-6"><Page /></div>
      </main>
      <AskAIPanel />
      <Toaster position="top-center" />
    </div>
  );
}

export function AubreeApp({ initialPath = "/" }: { initialPath?: string }) {
  const [path, setPath] = useState(initialPath);
  useEffect(() => { setPath(window.location.pathname); const onPop = () => setPath(window.location.pathname); window.addEventListener("popstate", onPop); return () => window.removeEventListener("popstate", onPop); }, []);
  const navigate = (to: string) => { if (to === path) return; window.history.pushState({}, "", to); setPath(to); window.scrollTo({ top: 0, behavior: "smooth" }); };
  return <NavigationProvider path={path} navigate={navigate}><OwnerProvider><Shell path={path} /></OwnerProvider></NavigationProvider>;
}

import { useState } from "react";
import { Bell, ChevronDown, Menu, Sparkles, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { roles } from "@/config/roles";
import { useOwner } from "@/contexts/OwnerContext";
import { useNavigate } from "@/lib/router-compat";
import { OwnerSidebar } from "./OwnerSidebar";
import { BRAND } from "@/data/owner/brand";

export function OwnerHeader() {
  const { role, setRole, askOpen, setAskOpen, audit } = useOwner();
  const [navOpen, setNavOpen] = useState(false);
  const navigate = useNavigate();
  const roleLabel = roles.find((r) => r.id === role)!.label;

  return (
    <header className="fixed left-0 right-0 top-0 z-30 h-16 border-b bg-card lg:left-[248px]">
      <div className="flex h-full items-center gap-2 px-3 sm:px-4 lg:px-6">
        <Sheet open={navOpen} onOpenChange={setNavOpen}>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setNavOpen(true)} aria-label="Open menu"><Menu className="h-5 w-5" /></Button>
          <SheetContent side="left" className="w-[260px] p-0"><SheetTitle className="sr-only">Menu</SheetTitle><OwnerSidebar mobile onNavigate={() => setNavOpen(false)} /></SheetContent>
        </Sheet>
        <div className="min-w-0 lg:hidden"><div className="truncate text-sm font-semibold">{BRAND.name}</div></div>

        <div className="hidden min-w-0 items-center gap-2 lg:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-success/80" />
          <span className="whitespace-nowrap text-[12px] text-muted-foreground">Synced 2 min ago</span>
        </div>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1.5 px-2.5 text-[12px] font-normal">
                <UserRound className="h-4 w-4" /><span className="hidden max-w-36 truncate sm:inline">{roleLabel}</span><ChevronDown className="h-3.5 w-3.5 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="text-xs">Switch role</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {roles.map((r) => (
                <DropdownMenuItem key={r.id} onClick={() => setRole(r.id)} className="justify-between text-[13px]">
                  <span className={cn(r.id === role && "font-semibold")}>{r.label}</span>
                  {!r.ready && <span className="text-[10px] text-muted-foreground">Coming soon</span>}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" className="relative" aria-label="Recent activity" onClick={() => navigate("/audit-log")}>
            <Bell className="h-4 w-4" /><span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[9px] font-semibold text-destructive-foreground">{Math.min(audit.length, 9)}</span>
          </Button>

          <Button size="sm" onClick={() => setAskOpen(!askOpen)} className="h-8 gap-1.5 px-3 text-[13px] font-medium">
            <Sparkles className="h-3.5 w-3.5" /><span className="hidden sm:inline">Ask AI</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

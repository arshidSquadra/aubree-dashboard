import { useState } from "react";
import { Bell, HelpCircle, Search, Plus, ChevronDown, Check, RefreshCw, Menu, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useModule } from "@/contexts/ModuleContext";
import { useNavigate } from "@/lib/router-compat";
import { Sidebar } from "./Sidebar";

export function TopBar() {
  const navigate = useNavigate();
  const [navigationOpen, setNavigationOpen] = useState(false);
  const {
    selectedCompany,
    setSelectedCompany,
    companies,
    dateRange,
    setDateRange,
    searchQuery,
    setSearchQuery,
    activeModule,
    getModuleLabel,
  } = useModule();

  return (
    <header className="fixed inset-x-0 top-0 z-40 grid h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b bg-background/95 px-3 backdrop-blur-xl lg:left-[260px] lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:px-4 2xl:px-6">
      <div className="flex min-w-0 items-center gap-1.5 xl:gap-3 2xl:gap-4">
        <Sheet open={navigationOpen} onOpenChange={setNavigationOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0 lg:hidden" aria-label="Open navigation">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] max-w-[86vw] p-0 [&>button]:z-[60]">
            <SheetTitle className="sr-only">Aubree navigation</SheetTitle>
            <Sidebar mobile onNavigate={() => setNavigationOpen(false)} />
          </SheetContent>
        </Sheet>

        <div className="hidden shrink-0 items-center gap-2 sm:flex lg:hidden">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-display text-sm font-bold">Aubree</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-10 min-w-0 max-w-full gap-2 px-2 xl:px-3">
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold"
                style={{ background: `hsl(var(--module-${activeModule}) / 0.2)`, color: `hsl(var(--module-${activeModule}))` }}
              >
                {selectedCompany.logo}
              </div>
              <span className="max-w-32 truncate text-[13px] font-semibold 2xl:max-w-40">{selectedCompany.name}</span>
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {companies.map((company) => (
              <DropdownMenuItem key={company.id} onClick={() => setSelectedCompany(company)} className="gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-xs font-bold text-foreground">
                  {company.logo}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{company.name}</p>
                  <div className="flex items-center gap-1.5">
                    <span className={cn("h-2 w-2 rounded-full", company.health === "green" && "bg-green-500", company.health === "amber" && "bg-yellow-500", company.health === "red" && "bg-red-500")} />
                    <span className="text-xs capitalize text-muted-foreground">{company.health}</span>
                  </div>
                </div>
                {selectedCompany.id === company.id && <Check className="h-4 w-4 text-primary" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className={cn(
          "hidden shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-2.5 py-1.5 text-[11px] font-semibold xl:flex 2xl:px-3",
          selectedCompany.health === "green" && "bg-green-500/10 text-green-600",
          selectedCompany.health === "amber" && "bg-yellow-500/10 text-yellow-600",
          selectedCompany.health === "red" && "bg-red-500/10 text-red-600",
        )}>
          <span className={cn("h-2 w-2 rounded-full", selectedCompany.health === "green" && "bg-green-500", selectedCompany.health === "amber" && "bg-yellow-500", selectedCompany.health === "red" && "bg-red-500")} />
          Account Health
        </div>

        <div className="hidden shrink-0 lg:block">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex shrink-0 cursor-help items-center gap-1.5 whitespace-nowrap text-[11px] text-muted-foreground">
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span className="inline 2xl:hidden">2m</span>
                  <span className="hidden 2xl:inline">2 mins ago</span>
                </div>
              </TooltipTrigger>
              <TooltipContent><p>Last synced with integrations</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="hidden min-w-0 items-center gap-2 md:flex xl:gap-3">
        <div className="flex h-11 shrink-0 items-center gap-0.5 rounded-lg bg-muted/60 p-1">
          {(["7d", "30d", "custom"] as const).map((range) => (
            <Button
              key={range}
              type="button"
              variant="ghost"
              onClick={() => setDateRange(range)}
              className={cn("h-9 rounded-md px-2.5 text-[12px] font-semibold shadow-none 2xl:px-3", dateRange === range ? "bg-background text-foreground shadow-sm hover:bg-background" : "text-muted-foreground")}
            >
              {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "Custom"}
            </Button>
          ))}
        </div>

        <div className="relative hidden min-w-0 xl:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={`Search in ${getModuleLabel(activeModule)}...`}
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="h-10 w-[clamp(10rem,15vw,20rem)] border-0 bg-muted/50 pl-9 text-[13px] focus-visible:ring-1"
          />
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-0.5 xl:gap-1.5">
        <Button variant="ghost" size="icon" className="relative h-10 w-10" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </Button>
        <Button variant="ghost" size="icon" className="hidden h-10 w-10 sm:inline-flex" aria-label="Help">
          <HelpCircle className="h-5 w-5" />
        </Button>
        <Button
          className="ml-1 h-10 gap-2 px-3 text-[13px] font-semibold shadow-sm xl:px-4"
          style={{ background: `hsl(var(--module-${activeModule}))`, color: "hsl(var(--primary-foreground))" }}
          onClick={() => navigate("/requests")}
          aria-label="Raise Request"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden whitespace-nowrap sm:inline">Raise Request</span>
        </Button>
      </div>
    </header>
  );
}
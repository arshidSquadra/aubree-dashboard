import { Outlet } from "@/lib/router-compat";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

export function MainLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopBar />
      <main className="min-h-screen min-w-0 pt-16 lg:ml-[260px]">
        <div className="p-3 sm:p-4 lg:p-5 xl:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

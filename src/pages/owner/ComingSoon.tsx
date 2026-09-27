import { Clock } from "lucide-react";
import { roles } from "@/config/roles";
import { useOwner } from "@/contexts/OwnerContext";
import { Button } from "@/components/ui/button";

export default function ComingSoon() {
  const { role, setRole } = useOwner();
  const label = roles.find((r) => r.id === role)!.label;
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="card-base max-w-md p-8 text-center animate-fade-in">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-accent text-accent-foreground"><Clock className="h-6 w-6" /></span>
        <h1 className="mt-4 text-xl font-bold">{label} view — coming soon</h1>
        <p className="mt-2 text-sm text-muted-foreground">This dashboard is planned for the next phase. The Owner view is ready to explore now.</p>
        <Button className="mt-5" onClick={() => setRole("owner")}>Switch to Owner view</Button>
      </div>
    </div>
  );
}

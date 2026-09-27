import { FileText, Download, BookOpen, Users, Palette, Target, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { marketingPlaybooks } from "@/data/moduleData";
import { cn } from "@/lib/utils";

const typeIcons: Record<string, typeof FileText> = {
  brand: Palette,
  messaging: FileText,
  icp: Users,
  strategy: Target,
};

const typeColors: Record<string, string> = {
  brand: "bg-purple-500/10 text-purple-400",
  messaging: "bg-blue-500/10 text-blue-400",
  icp: "bg-green-500/10 text-green-400",
  strategy: "bg-orange-500/10 text-orange-400",
};

export default function Playbooks() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Playbooks</h1>
          <p className="text-muted-foreground">Brand guidelines, messaging, and marketing strategy</p>
        </div>
        <Button className="gap-2">
          <FileText className="w-4 h-4" />
          Upload Document
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="brand">Brand</TabsTrigger>
          <TabsTrigger value="messaging">Messaging</TabsTrigger>
          <TabsTrigger value="icp">ICP</TabsTrigger>
          <TabsTrigger value="strategy">Strategy</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-2 gap-4">
            {marketingPlaybooks.map((doc) => {
              const Icon = typeIcons[doc.type] || FileText;
              return (
                <div key={doc.id} className="card-base p-5 hover:border-primary/30 transition-all cursor-pointer group">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                      typeColors[doc.type]
                    )}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold mb-1">{doc.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{doc.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Updated: {doc.lastUpdated}</span>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" className="h-8 gap-1">
                            <ExternalLink className="w-3 h-3" />
                            View
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 gap-1">
                            <Download className="w-3 h-3" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {["brand", "messaging", "icp", "strategy"].map((type) => (
          <TabsContent key={type} value={type} className="mt-6">
            <div className="grid grid-cols-2 gap-4">
              {marketingPlaybooks.filter(d => d.type === type).map((doc) => {
                const Icon = typeIcons[doc.type] || FileText;
                return (
                  <div key={doc.id} className="card-base p-5 hover:border-primary/30 transition-all cursor-pointer group">
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                        typeColors[doc.type]
                      )}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-1">{doc.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{doc.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Updated: {doc.lastUpdated}</span>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="sm" className="h-8 gap-1">
                              <ExternalLink className="w-3 h-3" />
                              View
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 gap-1">
                              <Download className="w-3 h-3" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Quick Links */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card-base p-5 text-center">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mx-auto mb-3">
            <Palette className="w-6 h-6 text-purple-400" />
          </div>
          <h4 className="font-medium mb-1">Brand Assets</h4>
          <p className="text-sm text-muted-foreground mb-3">Logos, colors, fonts</p>
          <Button variant="outline" size="sm">Open Library</Button>
        </div>
        <div className="card-base p-5 text-center">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mx-auto mb-3">
            <BookOpen className="w-6 h-6 text-blue-400" />
          </div>
          <h4 className="font-medium mb-1">Tone of Voice</h4>
          <p className="text-sm text-muted-foreground mb-3">Writing guidelines</p>
          <Button variant="outline" size="sm">View Guide</Button>
        </div>
        <div className="card-base p-5 text-center">
          <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6 text-green-400" />
          </div>
          <h4 className="font-medium mb-1">Target Personas</h4>
          <p className="text-sm text-muted-foreground mb-3">ICP & buyer journey</p>
          <Button variant="outline" size="sm">View Personas</Button>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Eye, Heart, Bookmark, Share2, Grid, List, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { contentPosts, formatNumber } from "@/data/mockData";
import { cn } from "@/lib/utils";

const platformColors: Record<string, string> = {
  instagram: "bg-pink-500",
  linkedin: "bg-blue-600",
  facebook: "bg-blue-500",
  twitter: "bg-sky-500",
  youtube: "bg-red-500",
};

export default function ContentPerformance() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = contentPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = selectedTab === "all" || post.platform === selectedTab;
    return matchesSearch && matchesPlatform;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => b.reach - a.reach);
  const topPost = sortedPosts[0];
  const totalReach = filteredPosts.reduce((sum, p) => sum + p.reach, 0);
  const avgEngagement = filteredPosts.reduce((sum, p) => sum + p.engagement, 0) / filteredPosts.length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Content Performance</h1>
          <p className="text-muted-foreground">Track your content performance across all platforms</p>
        </div>
        <Button variant="outline" className="gap-2">
          <TrendingUp className="w-4 h-4" />
          Content Calendar
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card-base p-5">
          <p className="text-sm text-muted-foreground mb-1">Total Reach</p>
          <p className="text-2xl font-bold">{formatNumber(totalReach)}</p>
        </div>
        <div className="card-base p-5">
          <p className="text-sm text-muted-foreground mb-1">Avg. Engagement</p>
          <p className="text-2xl font-bold">{avgEngagement.toFixed(1)}%</p>
        </div>
        <div className="card-base p-5">
          <p className="text-sm text-muted-foreground mb-1">Total Saves</p>
          <p className="text-2xl font-bold">{formatNumber(filteredPosts.reduce((sum, p) => sum + p.saves, 0))}</p>
        </div>
        <div className="card-base p-5">
          <p className="text-sm text-muted-foreground mb-1">Total Shares</p>
          <p className="text-2xl font-bold">{formatNumber(filteredPosts.reduce((sum, p) => sum + p.shares, 0))}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="instagram">Instagram</TabsTrigger>
              <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
              <TabsTrigger value="facebook">Facebook</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/50">
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "p-2 rounded-md transition-all",
              viewMode === "grid" ? "bg-background shadow-sm" : "text-muted-foreground"
            )}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "p-2 rounded-md transition-all",
              viewMode === "list" ? "bg-background shadow-sm" : "text-muted-foreground"
            )}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Grid */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-3 gap-4">
          {sortedPosts.map((post, idx) => (
            <div key={post.id} className="card-base overflow-hidden hover:border-primary/30 transition-all cursor-pointer group">
              <div className="relative">
                <img src={post.thumbnail} alt={post.title} className="w-full h-48 object-cover" />
                <div className={cn(
                  "absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold",
                  platformColors[post.platform]
                )}>
                  {post.platform.charAt(0).toUpperCase()}
                </div>
                {idx === 0 && (
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-green-500 text-white text-xs font-bold flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Top
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button variant="secondary" size="sm">View Details</Button>
                </div>
              </div>
              <div className="p-4">
                <p className="font-medium text-sm mb-2 line-clamp-2">{post.title}</p>
                <p className="text-xs text-muted-foreground mb-3">{post.type} • {post.publishedAt}</p>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                      <Eye className="w-3 h-3" />
                    </div>
                    <p className="text-sm font-medium">{formatNumber(post.reach)}</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                      <Heart className="w-3 h-3" />
                    </div>
                    <p className="text-sm font-medium">{post.engagement}%</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                      <Bookmark className="w-3 h-3" />
                    </div>
                    <p className="text-sm font-medium">{formatNumber(post.saves)}</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                      <Share2 className="w-3 h-3" />
                    </div>
                    <p className="text-sm font-medium">{formatNumber(post.shares)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Content List */}
      {viewMode === "list" && (
        <div className="card-base overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Content</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Platform</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Reach</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Engagement</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Saves</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Shares</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Published</th>
              </tr>
            </thead>
            <tbody>
              {sortedPosts.map((post) => (
                <tr key={post.id} className="border-b border-border hover:bg-muted/30 cursor-pointer">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={post.thumbnail} alt={post.title} className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <p className="font-medium">{post.title}</p>
                        <p className="text-xs text-muted-foreground">{post.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium text-white capitalize",
                      platformColors[post.platform]
                    )}>
                      {post.platform}
                    </span>
                  </td>
                  <td className="p-4 font-medium">{formatNumber(post.reach)}</td>
                  <td className="p-4">{post.engagement}%</td>
                  <td className="p-4">{formatNumber(post.saves)}</td>
                  <td className="p-4">{formatNumber(post.shares)}</td>
                  <td className="p-4 text-sm text-muted-foreground">{post.publishedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

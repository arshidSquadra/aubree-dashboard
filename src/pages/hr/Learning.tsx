import { useState } from "react";
import { GraduationCap, Play, Clock, Star, CheckCircle2, Users, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { lmsCoursesData } from "@/data/moduleData";
import { cn } from "@/lib/utils";

const categoryColors: Record<string, string> = {
  Marketing: "bg-orange-500/10 text-orange-400",
  Ads: "bg-blue-500/10 text-blue-400",
  Content: "bg-pink-500/10 text-pink-400",
  SEO: "bg-green-500/10 text-green-400",
  "Soft Skills": "bg-purple-500/10 text-purple-400",
  Operations: "bg-cyan-500/10 text-cyan-400",
};

export default function Learning() {
  const [selectedCourse, setSelectedCourse] = useState<typeof lmsCoursesData[0] | null>(null);

  const totalEnrolled = lmsCoursesData.reduce((sum, c) => sum + c.enrolled, 0);
  const totalCompleted = lmsCoursesData.reduce((sum, c) => sum + c.completed, 0);
  const avgCompletion = Math.round((totalCompleted / totalEnrolled) * 100);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div 
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: 'hsl(var(--module-hr) / 0.1)' }}
          >
            <GraduationCap className="w-7 h-7" style={{ color: 'hsl(var(--module-hr))' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Learning (Lynk)</h1>
            <p className="text-muted-foreground">Training & development platform</p>
          </div>
        </div>
        <Button className="gap-2" style={{ background: 'hsl(var(--module-hr))' }}>
          <Play className="w-4 h-4" />
          Add Course
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card-base p-5">
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap className="w-5 h-5" style={{ color: 'hsl(var(--module-hr))' }} />
            <span className="text-sm text-muted-foreground">Total Courses</span>
          </div>
          <p className="text-3xl font-bold">{lmsCoursesData.length}</p>
        </div>
        <div className="card-base p-5">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5" style={{ color: 'hsl(var(--module-hr))' }} />
            <span className="text-sm text-muted-foreground">Total Enrolled</span>
          </div>
          <p className="text-3xl font-bold">{totalEnrolled}</p>
        </div>
        <div className="card-base p-5">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <span className="text-sm text-muted-foreground">Completed</span>
          </div>
          <p className="text-3xl font-bold">{totalCompleted}</p>
        </div>
        <div className="card-base p-5">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-muted-foreground">Avg Completion</span>
          </div>
          <p className="text-3xl font-bold">{avgCompletion}%</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="courses">
        <TabsList>
          <TabsTrigger value="courses">All Courses</TabsTrigger>
          <TabsTrigger value="assigned">My Assignments</TabsTrigger>
          <TabsTrigger value="mandatory">Mandatory</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="mt-6">
          <div className="grid grid-cols-3 gap-4">
            {lmsCoursesData.map((course) => (
              <div 
                key={course.id} 
                className="card-base p-5 hover:border-[hsl(var(--module-hr))]/30 transition-all cursor-pointer"
                onClick={() => setSelectedCourse(course)}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    categoryColors[course.category] || "bg-muted text-muted-foreground"
                  )}>
                    {course.category}
                  </span>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium">{course.rating}</span>
                  </div>
                </div>

                <h3 className="font-semibold mb-2">{course.name}</h3>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {course.enrolled}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Completion</span>
                    <span className="font-medium">{Math.round((course.completed / course.enrolled) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all"
                      style={{ 
                        width: `${(course.completed / course.enrolled) * 100}%`,
                        background: 'hsl(var(--module-hr))'
                      }}
                    />
                  </div>
                </div>

                <Button 
                  className="w-full mt-4 gap-2" 
                  variant="outline"
                >
                  <Play className="w-4 h-4" />
                  Start Course
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="assigned" className="mt-6">
          <div className="card-base p-8 text-center">
            <GraduationCap className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">No assignments yet</h3>
            <p className="text-muted-foreground mb-4">Courses assigned to you will appear here</p>
            <Button style={{ background: 'hsl(var(--module-hr))' }}>Browse Courses</Button>
          </div>
        </TabsContent>

        <TabsContent value="mandatory" className="mt-6">
          <div className="grid grid-cols-3 gap-4">
            {lmsCoursesData.filter(c => c.category === "Soft Skills").map((course) => (
              <div key={course.id} className="card-base p-5 border-yellow-500/30">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400">
                    Mandatory
                  </span>
                </div>
                <h3 className="font-semibold mb-2">{course.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {course.duration}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <div className="card-base p-8 text-center">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-green-400" />
            <h3 className="font-semibold mb-2">Great progress!</h3>
            <p className="text-muted-foreground">Completed courses will appear here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

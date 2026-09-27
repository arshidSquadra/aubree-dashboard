import { useState } from "react";
import { Calendar, Clock, Users, Video, FileText, CheckCircle2, Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { meetings } from "@/data/mockData";
import { cn } from "@/lib/utils";

export default function SalesMeetings() {
  const [selectedMeeting, setSelectedMeeting] = useState<typeof meetings[0] | null>(null);

  const upcomingMeetings = meetings.filter(m => m.status === "upcoming");
  const completedMeetings = meetings.filter(m => m.status === "completed");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Meetings & MOM</h1>
          <p className="text-muted-foreground">Track meetings and minutes of meetings</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Schedule Meeting
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Meetings List */}
        <div className="col-span-2 space-y-6">
          <Tabs defaultValue="upcoming">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming ({upcomingMeetings.length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completedMeetings.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="mt-4 space-y-3">
              {upcomingMeetings.map((meeting) => (
                <div 
                  key={meeting.id} 
                  className={cn(
                    "card-base p-4 cursor-pointer transition-all",
                    selectedMeeting?.id === meeting.id && "border-primary"
                  )}
                  onClick={() => setSelectedMeeting(meeting)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Video className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{meeting.title}</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {meeting.date}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {meeting.time}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {meeting.attendees.length} attendees
                          </div>
                        </div>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400">
                      Upcoming
                    </span>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="completed" className="mt-4 space-y-3">
              {completedMeetings.map((meeting) => (
                <div 
                  key={meeting.id} 
                  className={cn(
                    "card-base p-4 cursor-pointer transition-all",
                    selectedMeeting?.id === meeting.id && "border-primary"
                  )}
                  onClick={() => setSelectedMeeting(meeting)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{meeting.title}</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {meeting.date}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {meeting.attendees.length} attendees
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="gap-1">
                      <FileText className="w-3 h-3" />
                      MOM
                    </Button>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Meeting Details / MOM */}
        <div className="card-base p-5 h-fit sticky top-24">
          {selectedMeeting ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{selectedMeeting.title}</h3>
                {selectedMeeting.status === "completed" && (
                  <Button variant="outline" size="sm" className="gap-1">
                    <Download className="w-3 h-3" />
                    Download
                  </Button>
                )}
              </div>

              <div className="text-sm text-muted-foreground">
                {selectedMeeting.date} at {selectedMeeting.time}
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-2">Attendees</p>
                <div className="flex flex-wrap gap-2">
                  {selectedMeeting.attendees.map((attendee, idx) => (
                    <span key={idx} className="px-2 py-1 rounded-full bg-muted text-xs">{attendee}</span>
                  ))}
                </div>
              </div>

              {'agenda' in selectedMeeting && selectedMeeting.agenda && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Agenda</p>
                  <ul className="space-y-1">
                    {(selectedMeeting.agenda as string[]).map((item, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <span className="text-muted-foreground">{idx + 1}.</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {'decisions' in selectedMeeting && selectedMeeting.decisions && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Decisions</p>
                  <ul className="space-y-1">
                    {(selectedMeeting.decisions as string[]).map((item, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {'actionItems' in selectedMeeting && selectedMeeting.actionItems && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Action Items</p>
                  <ul className="space-y-2">
                    {(selectedMeeting.actionItems as Array<{task: string; owner: string; status: string}>).map((item, idx) => (
                      <li key={idx} className="text-sm p-2 rounded-lg bg-muted/30">
                        <p className="font-medium">{item.task}</p>
                        <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                          <span>{item.owner}</span>
                          <span className={cn(
                            "px-1.5 py-0.5 rounded-full",
                            item.status === "done" && "bg-green-500/10 text-green-400",
                            item.status === "in_progress" && "bg-yellow-500/10 text-yellow-400"
                          )}>
                            {item.status}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Select a meeting to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

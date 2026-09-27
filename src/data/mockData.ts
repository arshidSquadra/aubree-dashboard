import chocolateCake from "@/assets/aubree-chocolate-cake.jpg";
import macarons from "@/assets/aubree-macarons.jpg";
import cheesecake from "@/assets/aubree-cheesecake.jpg";

// Extended Mock Data for demo Execution OS

export const storeInfo = {
  name: "Aubree Bengaluru",
  logo: "AB",
  accountManager: "Priya Sharma",
  industry: "Premium Cakes & Desserts",
  since: "January 2024",
  healthStatus: "green" as const,
  lastSync: "2 mins ago",
};

export const kpiData = {
  spend: { value: 847500, change: 12.5, trend: "up" },
  leads: { value: 1247, change: 18.3, trend: "up" },
  cpl: { value: 679, change: -8.2, trend: "down" },
  roas: { value: 4.2, change: 15.6, trend: "up" },
  revenue: { value: 3562000, change: 22.1, trend: "up" },
  conversions: { value: 892, change: 9.7, trend: "up" },
  pipelineValue: { value: 12500000, change: 31.2, trend: "up" },
};

export const statusWidget = {
  status: "green" as const,
  title: "Campaigns Performing Well",
  reason: "CPL decreased 8.2% WoW while lead volume increased 18.3%",
  action: "Consider increasing budget on top 3 performers",
};

export const topPerformers = [
  {
    id: 1,
    title: "Signature Chocolate Cake",
    type: "Meta Carousel",
    metric: "Best CPL",
    metricValue: "₹412",
    thumbnail: macarons,
    ctr: "3.8%",
    leads: 142,
  },
  {
    id: 2,
    title: "Celebration Cake Collection",
    type: "Google Search",
    metric: "Highest CTR",
    metricValue: "4.2%",
    thumbnail: cheesecake,
    ctr: "4.2%",
    leads: 98,
  },
  {
    id: 3,
    title: "Behind the Scenes: Pastry Kitchen",
    type: "Instagram Reel",
    metric: "Best Engagement",
    metricValue: "12.4%",
    thumbnail: chocolateCake,
    ctr: "2.9%",
    leads: 87,
  },
];

export const bottomPerformers = [
  {
    id: 4,
    title: "Generic Brand Awareness",
    type: "Meta Static",
    metric: "High CPL",
    metricValue: "₹1,890",
    thumbnail: macarons,
    insight: "Audience too broad - recommend narrowing to industry professionals",
  },
  {
    id: 5,
    title: "LinkedIn Text Ad",
    type: "LinkedIn",
    metric: "Low CTR",
    metricValue: "0.4%",
    thumbnail: cheesecake,
    insight: "Creative fatigue detected - refresh imagery",
  },
  {
    id: 6,
    title: "Corporate Video",
    type: "YouTube",
    metric: "Low Watch Time",
    metricValue: "18%",
    thumbnail: chocolateCake,
    insight: "First 5 seconds need stronger hook",
  },
];

export const alerts: Array<{ id: number; type: "success" | "warning" | "error" | "info"; message: string; time: string }> = [
  { id: 1, type: "warning", message: "CPL increased 18% WoW on LinkedIn campaigns", time: "2 hours ago" },
  { id: 2, type: "success", message: "Top post 'Signature Cake Collection' spiking - 2.4x avg reach", time: "4 hours ago" },
  { id: 3, type: "error", message: "Landing page conversion dropped 12% - investigate", time: "6 hours ago" },
  { id: 4, type: "info", message: "New leads synced to CRM successfully", time: "8 hours ago" },
];

export const trendData = {
  spendVsLeads: [
    { date: "Week 1", spend: 180000, leads: 245 },
    { date: "Week 2", spend: 195000, leads: 289 },
    { date: "Week 3", spend: 220000, leads: 312 },
    { date: "Week 4", spend: 252500, leads: 401 },
  ],
  cplTrend: [
    { date: "Jan", cpl: 820 },
    { date: "Feb", cpl: 780 },
    { date: "Mar", cpl: 745 },
    { date: "Apr", cpl: 679 },
  ],
  organicReach: [
    { date: "Week 1", reach: 45000, engagement: 3200 },
    { date: "Week 2", reach: 52000, engagement: 4100 },
    { date: "Week 3", reach: 61000, engagement: 4800 },
    { date: "Week 4", reach: 78000, engagement: 6200 },
  ],
};

// Timeline Feed Events
export const timelineFeed: Array<{
  id: number;
  type: "ads" | "content" | "web" | "crm" | "report" | "request" | "approval";
  action: string;
  description: string;
  owner: string;
  timestamp: string;
  linkedItem?: { type: string; id: number; name: string };
}> = [
  { id: 1, type: "ads", action: "Ad Set Paused", description: "Signature Cake Collection - Ad Set 3 paused due to CPL spike (₹1,200 vs ₹450 target)", owner: "Priya Sharma", timestamp: "15 mins ago", linkedItem: { type: "campaign", id: 1, name: "Signature Chocolate Cake" } },
  { id: 2, type: "approval", action: "Creative Uploaded", description: "Celebration Cake Collection v3 creative uploaded for approval", owner: "Design Team", timestamp: "45 mins ago", linkedItem: { type: "approval", id: 2, name: "Celebration Cake Creative v3" } },
  { id: 3, type: "report", action: "Report Generated", description: "Weekly Performance Report (Mar 18-24) auto-generated", owner: "System", timestamp: "1 hour ago", linkedItem: { type: "report", id: 1, name: "Weekly Performance Report" } },
  { id: 4, type: "request", action: "Request Created", description: "New campaign request for February product launch", owner: "Rajesh Mehta (Store)", timestamp: "2 hours ago", linkedItem: { type: "request", id: 3, name: "Feb Product Launch Campaign" } },
  { id: 5, type: "web", action: "Celebration Cake Landing Page Deployed", description: "Signature Cake Collection LP v2 deployed to production", owner: "Dev Team", timestamp: "3 hours ago", linkedItem: { type: "task", id: 15, name: "Signature Cake Collection LP Update" } },
  { id: 6, type: "content", action: "Post Published", description: "Instagram Reel 'Behind the Scenes at Aubree Kitchen' went live", owner: "Content Team", timestamp: "4 hours ago", linkedItem: { type: "post", id: 1, name: "Aubree Kitchen BTS Reel" } },
  { id: 7, type: "ads", action: "Budget Increased", description: "Meta Ads budget increased from ₹50K to ₹75K/week", owner: "Priya Sharma", timestamp: "5 hours ago", linkedItem: { type: "campaign", id: 1, name: "Signature Chocolate Cake" } },
  { id: 8, type: "crm", action: "Leads Synced", description: "142 new leads synced to Zoho CRM", owner: "System", timestamp: "6 hours ago" },
  { id: 9, type: "approval", action: "Creative Approved", description: "Pastry Kitchen carousel approved by store", owner: "Anita Kumar (Store)", timestamp: "8 hours ago", linkedItem: { type: "approval", id: 5, name: "Pastry Kitchen Carousel" } },
  { id: 10, type: "ads", action: "A/B Test Started", description: "Carousel vs Single Image test launched for Signature Cake Collection", owner: "Priya Sharma", timestamp: "10 hours ago" },
  { id: 11, type: "content", action: "Content Scheduled", description: "5 posts scheduled for next week across LinkedIn and Instagram", owner: "Content Team", timestamp: "12 hours ago" },
  { id: 12, type: "web", action: "Analytics Updated", description: "GA4 tracking code updated on all landing pages", owner: "Dev Team", timestamp: "1 day ago" },
  { id: 13, type: "request", action: "Request Completed", description: "Video editing for CEO interview delivered", owner: "Video Team", timestamp: "1 day ago", linkedItem: { type: "request", id: 4, name: "CEO Interview Video" } },
  { id: 14, type: "ads", action: "Targeting Updated", description: "LinkedIn audience refined to dessert buyers and event planners", owner: "Priya Sharma", timestamp: "1 day ago" },
  { id: 15, type: "approval", action: "Changes Requested", description: "Store requested copy changes for newsletter template", owner: "Rajesh Mehta (Store)", timestamp: "1 day ago" },
  { id: 16, type: "content", action: "Reel Performance", description: "Eggless Baking Reel reached 45K views in 24 hours", owner: "System", timestamp: "2 days ago" },
  { id: 17, type: "crm", action: "Pipeline Updated", description: "12 leads moved to 'Qualified' stage", owner: "Sales Team", timestamp: "2 days ago" },
  { id: 18, type: "ads", action: "New Creative Live", description: "Signature Cake Collection carousel v2 now running", owner: "Priya Sharma", timestamp: "2 days ago" },
  { id: 19, type: "web", action: "Form Optimization", description: "Lead form simplified from 8 to 5 fields", owner: "Dev Team", timestamp: "3 days ago" },
  { id: 20, type: "report", action: "Monthly Report Sent", description: "February 2024 Monthly Report sent to stakeholders", owner: "System", timestamp: "3 days ago" },
];

// Workboard Tasks
export const workboardTasks: Array<{
  id: number;
  title: string;
  store: string;
  serviceType: "Ads" | "Content" | "Web" | "CRM" | "Design" | "SEO";
  owner: string;
  ownerPod: string;
  dueDate: string;
  status: "new" | "in_progress" | "internal_qa" | "store_review" | "approved" | "live";
  slaDays: number;
  slaRemaining: number;
  priority: "high" | "medium" | "low";
  brief?: string;
  checklist?: Array<{ item: string; done: boolean }>;
}> = [
  { id: 1, title: "Launch Summer Mango Collection", store: "Aubree Bengaluru", serviceType: "Ads", owner: "Priya Sharma", ownerPod: "Performance", dueDate: "2024-03-25", status: "in_progress", slaDays: 5, slaRemaining: 3, priority: "high", brief: "Launch Meta and Google campaigns for new festive cake collection", checklist: [{ item: "Creative assets ready", done: true }, { item: "Audience targeting finalized", done: true }, { item: "Tracking pixels verified", done: false }, { item: "Budget approved", done: true }] },
  { id: 2, title: "Create 10 Dessert Reels - March Batch", store: "Aubree Bengaluru", serviceType: "Content", owner: "Amit Joshi", ownerPod: "Content", dueDate: "2024-03-28", status: "in_progress", slaDays: 7, slaRemaining: 5, priority: "medium", brief: "10 Instagram Reels covering pastry kitchen, team spotlight, and eggless baking" },
  { id: 3, title: "Celebration Cake Celebration Cake Landing Page", store: "Aubree Bengaluru", serviceType: "Web", owner: "Dev Team", ownerPod: "Tech", dueDate: "2024-03-22", status: "store_review", slaDays: 4, slaRemaining: 0, priority: "high", brief: "Redesign landing page with improved conversion flow" },
  { id: 4, title: "Instagram Retargeting Setup", store: "Aubree Bengaluru", serviceType: "Ads", owner: "Priya Sharma", ownerPod: "Performance", dueDate: "2024-03-20", status: "internal_qa", slaDays: 3, slaRemaining: 1, priority: "medium" },
  { id: 5, title: "Birthday Reminder Automation", store: "Aubree Bengaluru", serviceType: "CRM", owner: "CRM Team", ownerPod: "Growth", dueDate: "2024-03-30", status: "new", slaDays: 7, slaRemaining: 7, priority: "medium" },
  { id: 6, title: "Signature Cake Collection Video Edit", store: "Aubree Bengaluru", serviceType: "Content", owner: "Video Team", ownerPod: "Content", dueDate: "2024-03-19", status: "approved", slaDays: 3, slaRemaining: 0, priority: "high" },
  { id: 7, title: "Google Ads Optimization Sprint", store: "Aubree Bengaluru", serviceType: "Ads", owner: "Priya Sharma", ownerPod: "Performance", dueDate: "2024-03-21", status: "in_progress", slaDays: 2, slaRemaining: 1, priority: "high" },
  { id: 8, title: "Brand Refresh - Social Templates", store: "Aubree Bengaluru", serviceType: "Design", owner: "Design Team", ownerPod: "Creative", dueDate: "2024-03-26", status: "new", slaDays: 5, slaRemaining: 5, priority: "low" },
  { id: 9, title: "SEO Audit Report", store: "Aubree Bengaluru", serviceType: "SEO", owner: "SEO Team", ownerPod: "Growth", dueDate: "2024-03-24", status: "in_progress", slaDays: 4, slaRemaining: 2, priority: "medium" },
  { id: 10, title: "WhatsApp Business Setup", store: "Aubree Bengaluru", serviceType: "CRM", owner: "CRM Team", ownerPod: "Growth", dueDate: "2024-04-01", status: "new", slaDays: 7, slaRemaining: 7, priority: "low" },
  { id: 11, title: "Q1 Performance Presentation", store: "Aubree Bengaluru", serviceType: "Content", owner: "Account Team", ownerPod: "Strategy", dueDate: "2024-03-29", status: "in_progress", slaDays: 5, slaRemaining: 4, priority: "high" },
  { id: 12, title: "Meta Pixel Audit", store: "Aubree Bengaluru", serviceType: "Web", owner: "Dev Team", ownerPod: "Tech", dueDate: "2024-03-18", status: "live", slaDays: 2, slaRemaining: 0, priority: "high" },
  { id: 13, title: "Eggless Collection Creatives", store: "Aubree Bengaluru", serviceType: "Design", owner: "Design Team", ownerPod: "Creative", dueDate: "2024-03-27", status: "internal_qa", slaDays: 4, slaRemaining: 2, priority: "medium" },
  { id: 14, title: "CRM Lead Scoring Setup", store: "Aubree Bengaluru", serviceType: "CRM", owner: "CRM Team", ownerPod: "Growth", dueDate: "2024-04-05", status: "new", slaDays: 10, slaRemaining: 10, priority: "low" },
  { id: 15, title: "Patisserie Conference Ads", store: "Aubree Bengaluru", serviceType: "Ads", owner: "Priya Sharma", ownerPod: "Performance", dueDate: "2024-03-23", status: "store_review", slaDays: 3, slaRemaining: 1, priority: "high" },
];

// Approvals Queue
export const approvalsQueue: Array<{
  id: number;
  title: string;
  type: "creative" | "copy" | "landing_page" | "ad_change" | "strategy";
  status: "pending" | "approved" | "changes_requested";
  submittedAt: string;
  submittedBy: string;
  slaHours: number;
  slaRemaining: number;
  thumbnail?: string;
  content?: string;
  version: number;
  previousVersions?: number[];
  linkedTask?: number;
}> = [
  { id: 1, title: "Signature Cake Collection Carousel v3", type: "creative", status: "pending", submittedAt: "2024-03-18", submittedBy: "Design Team", slaHours: 24, slaRemaining: 12, thumbnail: macarons, version: 3, previousVersions: [1, 2], linkedTask: 1 },
  { id: 2, title: "Celebration Cake Ad Copy", type: "copy", status: "pending", submittedAt: "2024-03-17", submittedBy: "Content Team", slaHours: 12, slaRemaining: -6, content: "Ensure your kitchen team is prepared for any situation. Our Celebration Cake Collection program covers emergency protocols, equipment handling, and regulatory compliance. Get certified in 4 weeks.", version: 2, previousVersions: [1], linkedTask: 3 },
  { id: 3, title: "Celebration Cake Landing Page - Celebration Cakes", type: "landing_page", status: "pending", submittedAt: "2024-03-16", submittedBy: "Dev Team", slaHours: 48, slaRemaining: 24, thumbnail: cheesecake, version: 1, linkedTask: 3 },
  { id: 4, title: "LinkedIn Budget Increase Request", type: "ad_change", status: "pending", submittedAt: "2024-03-18", submittedBy: "Priya Sharma", slaHours: 8, slaRemaining: 4, content: "Requesting budget increase from ₹30K to ₹50K/week for LinkedIn campaigns. Current performance: CPL ₹650, CTR 2.1%. Expected improvement with scale.", version: 1 },
  { id: 5, title: "Pastry Kitchen Video", type: "creative", status: "pending", submittedAt: "2024-03-17", submittedBy: "Video Team", slaHours: 24, slaRemaining: 8, thumbnail: chocolateCake, version: 2, previousVersions: [1], linkedTask: 6 },
  { id: 6, title: "Email Newsletter Template", type: "creative", status: "pending", submittedAt: "2024-03-16", submittedBy: "Design Team", slaHours: 24, slaRemaining: -12, thumbnail: macarons, version: 1 },
  { id: 7, title: "Q2 Strategy Document", type: "strategy", status: "pending", submittedAt: "2024-03-15", submittedBy: "Priya Sharma", slaHours: 72, slaRemaining: 48, content: "Q2 2024 Marketing Strategy covering channel allocation, budget optimization, and content calendar.", version: 1 },
  { id: 8, title: "Eggless Collection Creative", type: "creative", status: "pending", submittedAt: "2024-03-18", submittedBy: "Design Team", slaHours: 24, slaRemaining: 18, thumbnail: cheesecake, version: 1, linkedTask: 13 },
  { id: 9, title: "Google Ads Copy Refresh", type: "copy", status: "pending", submittedAt: "2024-03-17", submittedBy: "Content Team", slaHours: 12, slaRemaining: 2, content: "Updated ad copy for Search campaigns with new value propositions and CTAs.", version: 3, previousVersions: [1, 2] },
  { id: 10, title: "Festive Pop-up Design", type: "creative", status: "pending", submittedAt: "2024-03-16", submittedBy: "Design Team", slaHours: 48, slaRemaining: 36, thumbnail: chocolateCake, version: 1, linkedTask: 15 },
  { id: 11, title: "Instagram Story Templates", type: "creative", status: "pending", submittedAt: "2024-03-18", submittedBy: "Design Team", slaHours: 24, slaRemaining: 20, thumbnail: macarons, version: 2, previousVersions: [1] },
  { id: 12, title: "CEO Interview Thumbnail", type: "creative", status: "pending", submittedAt: "2024-03-17", submittedBy: "Design Team", slaHours: 12, slaRemaining: 6, thumbnail: cheesecake, version: 1 },
];

// Service Catalog
export const serviceCatalog = [
  { id: 1, name: "Launch Seasonal Cake Campaign", icon: "rocket", description: "Full-funnel paid campaign across Meta, Google, or LinkedIn", deliverables: ["Campaign strategy", "Ad creatives (5 variants)", "Audience targeting", "Landing page review", "Tracking setup"], timeline: "5-7 days", category: "ads" },
  { id: 2, name: "Create 10 Dessert Reels", icon: "video", description: "Short-form video content for Instagram/YouTube Shorts", deliverables: ["10 edited Reels", "Captions & hashtags", "Thumbnail designs", "Publishing schedule"], timeline: "7-10 days", category: "content" },
  { id: 3, name: "Website Celebration Cake Landing Page", icon: "globe", description: "Conversion-optimized landing page design & development", deliverables: ["Wireframe", "UI Design", "Development", "Mobile optimization", "Form integration"], timeline: "7-14 days", category: "web" },
  { id: 4, name: "Local Dessert SEO Sprint", icon: "search", description: "Technical SEO audit and quick-win optimizations", deliverables: ["Technical audit", "Keyword research", "On-page optimization", "Meta tag updates", "Performance report"], timeline: "5-7 days", category: "seo" },
  { id: 5, name: "Birthday Reminder Automation", icon: "workflow", description: "Email sequences and lead nurturing automation", deliverables: ["Workflow design", "Email templates", "Trigger setup", "Testing", "Analytics dashboard"], timeline: "7-10 days", category: "crm" },
  { id: 6, name: "Packaging & Gifting Pack", icon: "palette", description: "Brand refresh or new brand identity design", deliverables: ["Logo variations", "Color palette", "Typography", "Social templates", "Brand guidelines"], timeline: "14-21 days", category: "design" },
  { id: 7, name: "Social Media Calendar", icon: "calendar", description: "Monthly content calendar with posts & creatives", deliverables: ["30 posts", "Captions", "Hashtag strategy", "Creative designs", "Scheduling"], timeline: "5-7 days", category: "content" },
  { id: 8, name: "Performance Audit", icon: "chart", description: "Deep-dive analysis of marketing performance", deliverables: ["Channel analysis", "Competitor benchmarking", "Recommendations", "Action plan", "Executive summary"], timeline: "3-5 days", category: "strategy" },
];

// Meetings & MOMs
export const meetings = [
  { id: 1, title: "Weekly Performance Review", type: "weekly", date: "2024-03-18", time: "11:00 AM", attendees: ["Priya Sharma", "Rajesh Mehta", "Anita Kumar"], status: "completed", agenda: ["Review weekly KPIs", "Campaign performance", "Content calendar review", "Upcoming priorities"], decisions: ["Increase Meta budget by 20%", "Prioritize video content", "Launch LinkedIn retargeting"], actionItems: [{ task: "Prepare budget proposal", owner: "Priya", dueDate: "2024-03-20", status: "done" }, { task: "Create video brief", owner: "Amit", dueDate: "2024-03-22", status: "in_progress" }], notes: "Strong performance this week. CPL down 8%, leads up 18%. Store happy with results." },
  { id: 2, title: "Monthly Strategy Review", type: "monthly", date: "2024-03-01", time: "02:00 PM", attendees: ["Priya Sharma", "Rajesh Mehta", "Anita Kumar", "CFO"], status: "completed", agenda: ["February recap", "Q1 progress", "Q2 planning", "Budget allocation"], decisions: ["Approve Q2 budget of ₹25L", "Focus on LinkedIn for B2B", "Invest in video production"], actionItems: [{ task: "Q2 strategy document", owner: "Priya", dueDate: "2024-03-15", status: "done" }], notes: "Q1 targets exceeded. Store approved Q2 budget increase." },
  { id: 3, title: "Ad-hoc: Campaign Crisis", type: "adhoc", date: "2024-03-15", time: "04:00 PM", attendees: ["Priya Sharma", "Rajesh Mehta"], status: "completed", agenda: ["CPL spike investigation", "Immediate actions", "Recovery plan"], decisions: ["Pause underperforming ad sets", "Reallocate budget to top performers", "A/B test new creatives"], actionItems: [{ task: "Pause low performers", owner: "Priya", dueDate: "2024-03-15", status: "done" }, { task: "New creative brief", owner: "Design Team", dueDate: "2024-03-17", status: "done" }], notes: "Quick response to CPL spike. Issue identified as audience fatigue." },
  { id: 4, title: "Weekly Performance Review", type: "weekly", date: "2024-03-25", time: "11:00 AM", attendees: ["Priya Sharma", "Rajesh Mehta", "Anita Kumar"], status: "upcoming", agenda: ["Review weekly KPIs", "Campaign updates", "Content performance", "Next week priorities"] },
  { id: 5, title: "Quarterly Business Review", type: "quarterly", date: "2024-04-01", time: "10:00 AM", attendees: ["Priya Sharma", "Rajesh Mehta", "Anita Kumar", "CEO", "CFO"], status: "upcoming", agenda: ["Q1 results", "ROI analysis", "Q2 roadmap", "Resource planning"] },
];

// Change Log
export const changeLog: Array<{
  id: number;
  date: string;
  time: string;
  type: "budget" | "targeting" | "creative" | "landing_page" | "automation" | "tracking";
  channel: "meta" | "google" | "linkedin" | "website" | "crm" | "all";
  change: string;
  reason: string;
  expectedImpact: string;
  owner: string;
  linkedItem?: { type: string; id: number; name: string };
}> = [
  { id: 1, date: "2024-03-18", time: "10:30 AM", type: "budget", channel: "meta", change: "Increased weekly budget from ₹50K to ₹75K", reason: "Strong ROAS of 4.2x justifies scale", expectedImpact: "+50% lead volume at similar CPL", owner: "Priya Sharma", linkedItem: { type: "campaign", id: 1, name: "Signature Cake Collection" } },
  { id: 2, date: "2024-03-17", time: "03:45 PM", type: "creative", channel: "meta", change: "Swapped static image to carousel format", reason: "Carousels showing 35% higher CTR in tests", expectedImpact: "+20% CTR improvement", owner: "Design Team", linkedItem: { type: "campaign", id: 1, name: "Signature Cake Collection" } },
  { id: 3, date: "2024-03-17", time: "11:00 AM", type: "targeting", channel: "linkedin", change: "Narrowed audience to dessert buyers and event planners only", reason: "Too much irrelevant traffic from broad targeting", expectedImpact: "-30% CPL, +quality leads", owner: "Priya Sharma", linkedItem: { type: "campaign", id: 3, name: "Pastry Kitchen" } },
  { id: 4, date: "2024-03-16", time: "02:30 PM", type: "landing_page", channel: "website", change: "Simplified form from 8 to 5 fields", reason: "High form abandonment rate (68%)", expectedImpact: "+25% form completion rate", owner: "Dev Team", linkedItem: { type: "task", id: 3, name: "Celebration Cake LP" } },
  { id: 5, date: "2024-03-16", time: "09:15 AM", type: "tracking", channel: "all", change: "Updated GA4 tracking code across all pages", reason: "Missing conversion events", expectedImpact: "Accurate attribution data", owner: "Dev Team" },
  { id: 6, date: "2024-03-15", time: "04:00 PM", type: "budget", channel: "meta", change: "Paused 3 underperforming ad sets", reason: "CPL 2.5x above target", expectedImpact: "Reduce wasted spend by ₹15K/week", owner: "Priya Sharma", linkedItem: { type: "campaign", id: 1, name: "Signature Cake Collection" } },
  { id: 7, date: "2024-03-15", time: "11:30 AM", type: "automation", channel: "crm", change: "Enabled lead scoring in Zoho", reason: "Sales team needs prioritization", expectedImpact: "40% faster lead response", owner: "CRM Team" },
  { id: 8, date: "2024-03-14", time: "03:00 PM", type: "creative", channel: "linkedin", change: "Updated ad creative with new product shot", reason: "Previous creative running for 30 days", expectedImpact: "Combat creative fatigue, +15% engagement", owner: "Design Team" },
  { id: 9, date: "2024-03-14", time: "10:00 AM", type: "targeting", channel: "google", change: "Added negative keywords list", reason: "Irrelevant search terms wasting budget", expectedImpact: "-20% wasted clicks", owner: "Priya Sharma" },
  { id: 10, date: "2024-03-13", time: "05:30 PM", type: "landing_page", channel: "website", change: "Added trust badges and testimonials", reason: "Low trust indicators on page", expectedImpact: "+15% conversion rate", owner: "Dev Team" },
];

// SLA Metrics
export const slaMetrics = {
  avgResponseTime: { value: 2.4, unit: "hours", target: 4, status: "good" },
  avgDeliveryTime: { value: 4.2, unit: "days", target: 5, status: "good" },
  pendingStoreInput: { count: 3, items: ["Celebration Cake LP approval", "Budget increase approval", "Q2 Strategy review"] },
  pendingAubreeAction: { count: 5, items: ["10 Reels creation", "Google Ads optimization", "Email automation setup"] },
  onTimeDelivery: { percentage: 94, trend: "up" },
  storeSatisfaction: { score: 4.8, outOf: 5 },
};

export const riskRadar = [
  { id: 1, risk: "CPL trending up on LinkedIn", severity: "medium", mitigation: "Testing new creatives and audiences", owner: "Priya Sharma", dueDate: "2024-03-20" },
  { id: 2, risk: "Landing page conversion below target", severity: "high", mitigation: "A/B testing new layout", owner: "Dev Team", dueDate: "2024-03-22" },
  { id: 3, risk: "Q2 budget approval pending", severity: "low", mitigation: "Sent reminder to finance team", owner: "Account Team", dueDate: "2024-03-25" },
];

// Existing data exports remain the same
export const campaigns = [
  { id: 1, name: "Signature Chocolate Cake", platform: "meta", objective: "Lead Generation", spend: 125000, results: 304, cpl: 411, ctr: 3.8, status: "active", budget: 150000, audience: "Dessert lovers and celebration planners, Bengaluru", startDate: "2024-01-15" },
  { id: 2, name: "Celebration Cake Collection", platform: "google", objective: "Lead Generation", spend: 89000, results: 198, cpl: 449, ctr: 4.2, status: "active", budget: 100000, audience: "Safety officers, event teams and corporate buyers", startDate: "2024-01-20" },
  { id: 3, name: "Pastry Kitchen Efficiency", platform: "linkedin", objective: "Brand Awareness", spend: 67000, results: 89, cpl: 752, ctr: 1.8, status: "active", budget: 80000, audience: "Hospitality teams and wedding planners", startDate: "2024-02-01" },
  { id: 4, name: "Luxury Hamper Collection", platform: "meta", objective: "Conversions", spend: 156000, results: 245, cpl: 637, ctr: 2.9, status: "active", budget: 180000, audience: "Import/export businesses", startDate: "2024-01-10" },
  { id: 5, name: "Wedding Dessert Table", platform: "google", objective: "Lead Generation", spend: 78000, results: 134, cpl: 582, ctr: 3.1, status: "paused", budget: 90000, audience: "Corporate gifting and celebration buyers", startDate: "2024-02-15" },
];

export const experiments = [
  { id: 1, name: "Carousel vs Single Image", campaign: "Signature Cake Collection", status: "running", startDate: "2024-03-15", variants: [{ name: "Carousel (A)", cpl: 398, ctr: 4.1, confidence: 92 }, { name: "Single Image (B)", cpl: 467, ctr: 3.2, confidence: 92 }], winner: "Carousel (A)" },
  { id: 2, name: "Video Length Test", campaign: "Celebration Cake", status: "completed", startDate: "2024-03-01", variants: [{ name: "15s Video (A)", cpl: 512, ctr: 3.8, confidence: 95 }, { name: "30s Video (B)", cpl: 445, ctr: 2.9, confidence: 95 }], winner: "30s Video (B)" },
];

export const contentPosts = [
  { id: 1, title: "Behind the scenes at Aubree Kitchen", platform: "instagram", type: "Reel", thumbnail: chocolateCake, reach: 45000, engagement: 5.8, saves: 234, shares: 89, watchTime: 78, publishedAt: "2024-03-18", caption: "Step inside our Bengaluru pastry kitchen and see every cake finished by hand. #AubreeCakes #BehindTheBakes", hashtags: ["AubreeCakes", "BehindTheBakes", "BengaluruDesserts"] },
  { id: 2, title: "5 Ways to Choose the Perfect Celebration Cake", platform: "linkedin", type: "Carousel", thumbnail: macarons, reach: 28000, engagement: 4.2, saves: 567, shares: 123, watchTime: 0, publishedAt: "2024-03-16", caption: "A practical guide to flavours, portions, finishes, and delivery for every celebration.", hashtags: ["SignatureCakes", "Patisserie", "Desserts"] },
  { id: 3, title: "Our Eggless Baking Story", platform: "facebook", type: "Video", thumbnail: cheesecake, reach: 32000, engagement: 3.4, saves: 145, shares: 78, watchTime: 65, publishedAt: "2024-03-14", caption: "How Aubree creates joyful, entirely eggless desserts with premium ingredients.", hashtags: ["EgglessBaking", "MindfulBaking", "EgglessDesserts"] },
];

export const reports = [
  { id: 1, title: "Weekly Performance Report", period: "March 18-24, 2024", generatedAt: "2024-03-25", status: "ready", type: "weekly" },
  { id: 2, title: "Weekly Performance Report", period: "March 11-17, 2024", generatedAt: "2024-03-18", status: "ready", type: "weekly" },
  { id: 3, title: "Monthly Performance Report", period: "February 2024", generatedAt: "2024-03-01", status: "ready", type: "monthly" },
];

export const brandAssets = [
  { id: 1, name: "Brand Guidelines 2024", type: "pdf", category: "Guidelines", size: "4.2 MB", updatedAt: "2024-01-15" },
  { id: 2, name: "Primary Logo - Color", type: "svg", category: "Logos", size: "124 KB", updatedAt: "2024-01-10" },
  { id: 3, name: "Social Media Templates", type: "zip", category: "Templates", size: "28 MB", updatedAt: "2024-02-20" },
];

export const integrations = [
  { id: 1, name: "Meta Ads", icon: "meta", status: "connected", lastSync: "2 mins ago", hasError: false },
  { id: 2, name: "Google Ads", icon: "google", status: "connected", lastSync: "5 mins ago", hasError: false },
  { id: 3, name: "LinkedIn Ads", icon: "linkedin", status: "connected", lastSync: "10 mins ago", hasError: false },
  { id: 4, name: "Google Analytics 4", icon: "analytics", status: "connected", lastSync: "1 min ago", hasError: false },
  { id: 5, name: "Zoho CRM", icon: "zoho", status: "connected", lastSync: "3 mins ago", hasError: false },
  { id: 6, name: "HubSpot", icon: "hubspot", status: "not_connected", lastSync: null, hasError: false },
];

export const formatCurrency = (value: number): string => {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${value}`;
};

export const formatNumber = (value: number): string => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toString();
};

// Module-specific mock data for demo Business OS

// ============ SALES & MARKETING DATA ============
export const salesPipeline = [
  { id: 1, name: "Corporate Dessert Gifting", company: "The Leela Bengaluru", value: 2500000, stage: "proposal", probability: 60, owner: "Priya Sharma", lastActivity: "2 hours ago", nextAction: "Follow-up call" },
  { id: 2, name: "Wedding Dessert Table", company: "Taj West End", value: 1800000, stage: "negotiation", probability: 80, owner: "Rajesh Kumar", lastActivity: "1 day ago", nextAction: "Contract review" },
  { id: 3, name: "Event Dessert Catering", company: "Bangalore International Centre", value: 4500000, stage: "qualified", probability: 40, owner: "Anita Mehta", lastActivity: "3 hours ago", nextAction: "Aubree scheduled" },
  { id: 4, name: "Celebration Order Automation", company: "WeWork Bengaluru", value: 800000, stage: "discovery", probability: 20, owner: "Priya Sharma", lastActivity: "5 days ago", nextAction: "Requirements gathering" },
  { id: 5, name: "Festive Campaign Retainer", company: "Infosys Events", value: 3600000, stage: "closed_won", probability: 100, owner: "Priya Sharma", lastActivity: "Today", nextAction: "Onboarding" },
  { id: 6, name: "Cake Storefront Refresh", company: "Prestige Group", value: 1200000, stage: "proposal", probability: 50, owner: "Rajesh Kumar", lastActivity: "4 hours ago", nextAction: "Presentation" },
  { id: 7, name: "Local Cake Discovery Plan", company: "Embassy Group", value: 960000, stage: "negotiation", probability: 75, owner: "Anita Mehta", lastActivity: "Yesterday", nextAction: "Pricing discussion" },
  { id: 8, name: "Dessert Social Content", company: "Phoenix Marketcity", value: 720000, stage: "qualified", probability: 35, owner: "Priya Sharma", lastActivity: "2 days ago", nextAction: "Proposal preparation" },
  { id: 9, name: "Cake Film Production", company: "Cult.fit Events", value: 450000, stage: "discovery", probability: 15, owner: "Rajesh Kumar", lastActivity: "1 week ago", nextAction: "Initial meeting" },
  { id: 10, name: "Birthday Reminder Automation", company: "Swiggy Corporate", value: 280000, stage: "closed_lost", probability: 0, owner: "Anita Mehta", lastActivity: "2 weeks ago", nextAction: "N/A" },
];

export const leads = [
  { id: 1, name: "Vikram Patel", company: "Riya Celebrations", email: "vikram@riyacelebrations.in", phone: "+91 98765 43210", source: "meta", status: "new", score: 85, assignedTo: null, createdAt: "2024-03-18 10:30 AM" },
  { id: 2, name: "Sunita Rao", company: "Aster Events", email: "sunita@asterevents.in", phone: "+91 87654 32109", source: "google", status: "contacted", score: 72, assignedTo: "Priya Sharma", createdAt: "2024-03-18 09:15 AM" },
  { id: 3, name: "Amit Deshmukh", company: "Infosys Events", email: "amit@infosysevents.in", phone: "+91 76543 21098", source: "linkedin", status: "qualified", score: 90, assignedTo: "Rajesh Kumar", createdAt: "2024-03-17 04:45 PM" },
  { id: 4, name: "Priya Nair", company: "The Wedding Company", email: "priya@weddingcompany.in", phone: "+91 65432 10987", source: "website", status: "new", score: 65, assignedTo: null, createdAt: "2024-03-17 02:30 PM" },
  { id: 5, name: "Rahul Menon", company: "Party People Bengaluru", email: "rahul@partypeople.in", phone: "+91 54321 09876", source: "whatsapp", status: "new", score: 78, assignedTo: null, createdAt: "2024-03-17 11:00 AM" },
];

export const marketingPlaybooks = [
  { id: 1, name: "Brand Guidelines 2024", type: "brand", description: "Complete brand identity standards", lastUpdated: "2024-03-01", downloadUrl: "#" },
  { id: 2, name: "Tone of Voice", type: "messaging", description: "How we communicate with customers", lastUpdated: "2024-02-15", downloadUrl: "#" },
  { id: 3, name: "ICP (Ideal Customer Profile)", type: "icp", description: "Target customer personas and segments", lastUpdated: "2024-03-10", downloadUrl: "#" },
  { id: 4, name: "Offer Messaging Framework", type: "messaging", description: "Value propositions and key messages", lastUpdated: "2024-02-28", downloadUrl: "#" },
  { id: 5, name: "Competitor Analysis", type: "strategy", description: "Market positioning and competitive insights", lastUpdated: "2024-03-05", downloadUrl: "#" },
];

// ============ HR DATA ============
export const employees = [
  { id: 1, name: "Priya Sharma", email: "priya@aubree.in", department: "Marketing", role: "Marketing Head", status: "active", joiningDate: "2022-01-15", reportingTo: "CEO" },
  { id: 2, name: "Rajesh Kumar", email: "rajesh@aubree.in", department: "Sales", role: "Sales Manager", status: "active", joiningDate: "2022-03-20", reportingTo: "Priya Sharma" },
  { id: 3, name: "Anita Mehta", email: "anita@aubree.in", department: "Operations", role: "Operations Lead", status: "active", joiningDate: "2021-08-10", reportingTo: "CEO" },
  { id: 4, name: "Vikram Singh", email: "vikram@aubree.in", department: "Design", role: "Senior Designer", status: "active", joiningDate: "2022-06-01", reportingTo: "Priya Sharma" },
  { id: 5, name: "Sneha Patel", email: "sneha@aubree.in", department: "Content", role: "Content Writer", status: "active", joiningDate: "2023-01-10", reportingTo: "Priya Sharma" },
];

export const onboardingTasks = [
  { id: 1, employeeName: "Karan Joshi", role: "Ads Specialist", startDate: "2024-03-25", status: "in_progress", progress: 65, tasks: [
    { name: "IT Setup Complete", done: true },
    { name: "HR Documentation", done: true },
    { name: "Team Introduction", done: true },
    { name: "Tool Access Granted", done: false },
    { name: "Training Started", done: false },
  ]},
  { id: 2, employeeName: "Meera Reddy", role: "Content Writer", startDate: "2024-03-20", status: "completed", progress: 100, tasks: [
    { name: "IT Setup Complete", done: true },
    { name: "HR Documentation", done: true },
    { name: "Team Introduction", done: true },
    { name: "Tool Access Granted", done: true },
    { name: "Training Started", done: true },
  ]},
];

export const lmsCoursesData = [
  { id: 1, name: "Aubree Brand & Guest Experience", category: "Marketing", duration: "4 hours", enrolled: 45, completed: 38, rating: 4.8 },
  { id: 2, name: "Food Safety & Hygiene", category: "Ads", duration: "6 hours", enrolled: 32, completed: 28, rating: 4.9 },
  { id: 3, name: "Cake Decoration Standards", category: "Content", duration: "3 hours", enrolled: 28, completed: 25, rating: 4.7 },
  { id: 4, name: "Kitchen Allergen Protocols", category: "SEO", duration: "5 hours", enrolled: 40, completed: 35, rating: 4.6 },
  { id: 5, name: "Guest Service Excellence", category: "Soft Skills", duration: "2 hours", enrolled: 80, completed: 72, rating: 4.5 },
  { id: 6, name: "Order Fulfilment Basics", category: "Operations", duration: "4 hours", enrolled: 55, completed: 48, rating: 4.4 },
];

export const hrPolicies = [
  { id: 1, name: "Leave Policy 2024", category: "Leave", lastUpdated: "2024-01-01", downloadUrl: "#" },
  { id: 2, name: "Work from Home Guidelines", category: "Remote Work", lastUpdated: "2024-02-15", downloadUrl: "#" },
  { id: 3, name: "Code of Conduct", category: "Compliance", lastUpdated: "2023-12-01", downloadUrl: "#" },
  { id: 4, name: "Performance Review Process", category: "Performance", lastUpdated: "2024-01-15", downloadUrl: "#" },
  { id: 5, name: "Travel & Expense Policy", category: "Finance", lastUpdated: "2024-03-01", downloadUrl: "#" },
];

// ============ ACCOUNTS DATA ============
export const invoices = [
  { id: 1, invoiceNo: "INV-2024-001", store: "Aubree Bengaluru", amount: 850000, dueDate: "2024-03-25", status: "pending", issuedDate: "2024-03-10" },
  { id: 2, invoiceNo: "INV-2024-002", store: "Aubree Koramangala", amount: 320000, dueDate: "2024-03-15", status: "overdue", issuedDate: "2024-02-28" },
  { id: 3, invoiceNo: "INV-2024-003", store: "Aubree Indiranagar", amount: 540000, dueDate: "2024-04-01", status: "pending", issuedDate: "2024-03-18" },
  { id: 4, invoiceNo: "INV-2024-004", store: "Infosys Events", amount: 680000, dueDate: "2024-03-20", status: "paid", issuedDate: "2024-03-05" },
  { id: 5, invoiceNo: "INV-2024-005", store: "Taj West End", amount: 420000, dueDate: "2024-03-12", status: "overdue", issuedDate: "2024-02-25" },
];

export const expenses = [
  { id: 1, description: "Festive Campaign Spend - March", category: "Advertising", amount: 250000, submittedBy: "Priya Sharma", date: "2024-03-18", status: "approved" },
  { id: 2, description: "Cake Packaging Supplies", category: "Operations", amount: 15000, submittedBy: "Anita Mehta", date: "2024-03-17", status: "pending" },
  { id: 3, description: "POS & Ordering Subscriptions", category: "Technology", amount: 45000, submittedBy: "IT Team", date: "2024-03-15", status: "approved" },
  { id: 4, description: "Menu Tasting Session", category: "Business Development", amount: 8500, submittedBy: "Rajesh Kumar", date: "2024-03-14", status: "pending" },
  { id: 5, description: "Food Safety Workshop", category: "HR", amount: 35000, submittedBy: "HR Team", date: "2024-03-10", status: "approved" },
];

export const contracts = [
  { id: 1, name: "Aubree Bengaluru Retainer", store: "Aubree Bengaluru", value: 9600000, startDate: "2024-01-01", endDate: "2024-12-31", status: "active", renewalDue: "2024-11-01" },
  { id: 2, name: "Aubree Koramangala Marketing", store: "Aubree Koramangala", value: 4800000, startDate: "2024-02-01", endDate: "2024-07-31", status: "active", renewalDue: "2024-06-01" },
  { id: 3, name: "Aubree Indiranagar Social Media", store: "Aubree Indiranagar", value: 3600000, startDate: "2023-09-01", endDate: "2024-08-31", status: "active", renewalDue: "2024-07-01" },
];

// ============ OPERATIONS DATA ============
export const opsTasks = [
  { id: 1, title: "Launch Summer Mango Collection", store: "Aubree Bengaluru", type: "Campaign Launch", assignee: "Priya Sharma", dueDate: "2024-03-25", status: "in_progress", priority: "high", slaStatus: "on_track" },
  { id: 2, title: "Create 10 Dessert Reels - March", store: "Aubree Bengaluru", type: "Content Production", assignee: "Amit Joshi", dueDate: "2024-03-28", status: "in_progress", priority: "medium", slaStatus: "on_track" },
  { id: 3, title: "Celebration Cake Celebration Cake Landing Page", store: "Aubree Bengaluru", type: "Web Development", assignee: "Dev Team", dueDate: "2024-03-22", status: "store_review", priority: "high", slaStatus: "at_risk" },
  { id: 4, title: "Instagram Retargeting Setup", store: "Aubree Koramangala", type: "Ads Setup", assignee: "Priya Sharma", dueDate: "2024-03-20", status: "internal_qa", priority: "medium", slaStatus: "on_track" },
  { id: 5, title: "Birthday Reminder Automation", store: "Aubree Indiranagar", type: "CRM", assignee: "CRM Team", dueDate: "2024-03-30", status: "new", priority: "low", slaStatus: "on_track" },
];

export const qaItems = [
  { id: 1, title: "Signature Cake Collection Carousel v3", type: "Creative", submittedBy: "Design Team", submittedAt: "2024-03-18", status: "pending_qa", checklist: [
    { item: "Brand guidelines followed", checked: true },
    { item: "Copy proofread", checked: true },
    { item: "Image quality verified", checked: false },
    { item: "CTA clear and visible", checked: false },
  ]},
  { id: 2, title: "Celebration Cake Celebration Cake Landing Page", type: "Celebration Cake Landing Page", submittedBy: "Dev Team", submittedAt: "2024-03-17", status: "pending_qa", checklist: [
    { item: "Mobile responsive", checked: true },
    { item: "Form working", checked: true },
    { item: "Tracking pixels installed", checked: true },
    { item: "Page speed optimized", checked: false },
  ]},
];

export const sopTemplates = [
  { id: 1, name: "Campaign Launch Checklist", category: "Ads", steps: 12, lastUsed: "2024-03-15" },
  { id: 2, name: "Reel Production Process", category: "Content", steps: 8, lastUsed: "2024-03-18" },
  { id: 3, name: "Celebration Cake Landing Page Build", category: "Web", steps: 15, lastUsed: "2024-03-10" },
  { id: 4, name: "Local Dessert SEO Sprint Process", category: "SEO", steps: 10, lastUsed: "2024-03-12" },
  { id: 5, name: "Store Onboarding", category: "Operations", steps: 20, lastUsed: "2024-03-01" },
  { id: 6, name: "Monthly Report Generation", category: "Reporting", steps: 6, lastUsed: "2024-03-05" },
];

export const calendarEvents = [
  { id: 1, title: "Weekly Performance Review", date: "2024-03-25", time: "11:00 AM", type: "meeting", store: "Aubree Bengaluru" },
  { id: 2, title: "Campaign Launch Deadline", date: "2024-03-25", time: "EOD", type: "deadline", store: "Aubree Bengaluru" },
  { id: 3, title: "Content Shoot", date: "2024-03-26", time: "10:00 AM", type: "shoot", store: "Aubree Koramangala" },
  { id: 4, title: "Quarterly Review", date: "2024-04-01", time: "10:00 AM", type: "meeting", store: "All" },
];

// ============ MODULE-SPECIFIC SERVICES ============
export const moduleServices = {
  sales: [
    { id: 1, name: "Launch Seasonal Cake Campaign", icon: "rocket", description: "Full-funnel paid campaign setup", timeline: "5-7 days", category: "ads" },
    { id: 2, name: "Create 10 Dessert Reels", icon: "video", description: "Short-form video content", timeline: "7-10 days", category: "content" },
    { id: 3, name: "Celebration Cake Landing Page", icon: "globe", description: "Conversion-optimized page", timeline: "7-14 days", category: "web" },
    { id: 4, name: "Local Dessert SEO Sprint", icon: "search", description: "Technical SEO audit", timeline: "5-7 days", category: "seo" },
    { id: 5, name: "Birthday Reminder Automation", icon: "workflow", description: "Email sequences setup", timeline: "7-10 days", category: "crm" },
    { id: 6, name: "Packaging & Gifting Pack", icon: "palette", description: "Brand identity design", timeline: "14-21 days", category: "design" },
  ],
  hr: [
    { id: 1, name: "Create Onboarding Plan", icon: "userPlus", description: "New hire onboarding checklist", timeline: "1-2 days", category: "onboarding" },
    { id: 2, name: "Assign Training", icon: "book", description: "Assign courses to employees", timeline: "Same day", category: "learning" },
    { id: 3, name: "Create Policy", icon: "fileText", description: "Draft new HR policy", timeline: "3-5 days", category: "policy" },
    { id: 4, name: "Start Review Cycle", icon: "star", description: "Initiate performance reviews", timeline: "1-2 days", category: "performance" },
    { id: 5, name: "Request Hire", icon: "users", description: "Open new position", timeline: "2-3 days", category: "recruitment" },
  ],
  accounts: [
    { id: 1, name: "Raise Invoice", icon: "fileText", description: "Create and send invoice", timeline: "Same day", category: "invoicing" },
    { id: 2, name: "Payment Follow-up", icon: "phone", description: "Follow up on overdue payment", timeline: "Same day", category: "collections" },
    { id: 3, name: "Submit Expense", icon: "creditCard", description: "Submit expense for approval", timeline: "Same day", category: "expenses" },
    { id: 4, name: "Generate Report", icon: "barChart", description: "Financial report generation", timeline: "1-2 days", category: "reporting" },
    { id: 5, name: "Contract Renewal", icon: "fileCheck", description: "Initiate contract renewal", timeline: "3-5 days", category: "contracts" },
  ],
  operations: [
    { id: 1, name: "Create Project", icon: "folder", description: "Set up new project workspace", timeline: "Same day", category: "projects" },
    { id: 2, name: "Add Task", icon: "checkSquare", description: "Create task from template", timeline: "Same day", category: "tasks" },
    { id: 3, name: "Urgent Fix Request", icon: "alertTriangle", description: "Priority bug/issue fix", timeline: "4-8 hours", category: "support" },
    { id: 4, name: "Schedule Meeting", icon: "calendar", description: "Book store/team meeting", timeline: "Same day", category: "meetings" },
    { id: 5, name: "Request Resources", icon: "users", description: "Request additional team members", timeline: "1-2 days", category: "resources" },
  ],
};

// ============ MODULE-SPECIFIC APPROVALS ============
export const moduleApprovals = {
  sales: [
    { id: 1, title: "Signature Cake Collection Carousel v3", type: "creative", status: "pending", submittedAt: "2024-03-18", submittedBy: "Design Team" },
    { id: 2, title: "Celebration Cake Ad Copy", type: "copy", status: "pending", submittedAt: "2024-03-17", submittedBy: "Content Team" },
    { id: 3, title: "Q2 Marketing Budget", type: "budget", status: "pending", submittedAt: "2024-03-16", submittedBy: "Priya Sharma" },
  ],
  hr: [
    { id: 1, title: "Leave Request - Vikram Singh", type: "leave", status: "pending", submittedAt: "2024-03-18", submittedBy: "Vikram Singh" },
    { id: 2, title: "New Policy - Remote Work", type: "policy", status: "pending", submittedAt: "2024-03-15", submittedBy: "HR Team" },
  ],
  accounts: [
    { id: 1, title: "Expense - Meta Ads March", type: "expense", status: "pending", submittedAt: "2024-03-18", submittedBy: "Priya Sharma" },
    { id: 2, title: "Invoice - Aubree Bengaluru", type: "invoice", status: "pending", submittedAt: "2024-03-17", submittedBy: "Finance Team" },
  ],
  operations: [
    { id: 1, title: "Celebration Cake Landing Page Signoff", type: "deliverable", status: "pending", submittedAt: "2024-03-18", submittedBy: "Dev Team" },
    { id: 2, title: "Campaign Assets Final", type: "deliverable", status: "pending", submittedAt: "2024-03-17", submittedBy: "Design Team" },
  ],
};

// ============ MODULE-SPECIFIC REPORTS ============
export const moduleReports = {
  sales: [
    { id: 1, name: "Weekly Performance Report", period: "Mar 18-24, 2024", status: "ready" },
    { id: 2, name: "Monthly Marketing Report", period: "February 2024", status: "ready" },
    { id: 3, name: "Campaign ROI Analysis", period: "Q1 2024", status: "generating" },
  ],
  hr: [
    { id: 1, name: "Headcount Report", period: "March 2024", status: "ready" },
    { id: 2, name: "Training Completion Report", period: "Q1 2024", status: "ready" },
    { id: 3, name: "Onboarding Status Report", period: "March 2024", status: "ready" },
  ],
  accounts: [
    { id: 1, name: "Receivables Report", period: "March 2024", status: "ready" },
    { id: 2, name: "Monthly P&L", period: "February 2024", status: "ready" },
    { id: 3, name: "Cash Flow Statement", period: "Q1 2024", status: "generating" },
  ],
  operations: [
    { id: 1, name: "SLA Performance Report", period: "March 2024", status: "ready" },
    { id: 2, name: "Workload Distribution", period: "Week 12", status: "ready" },
    { id: 3, name: "Delivery Timeline Report", period: "Q1 2024", status: "ready" },
  ],
};

// ============ MODULE-SPECIFIC INTEGRATIONS ============
export const moduleIntegrations = {
  sales: [
    { id: 1, name: "Meta Ads", icon: "meta", status: "connected", lastSync: "2 mins ago" },
    { id: 2, name: "Google Ads", icon: "google", status: "connected", lastSync: "5 mins ago" },
    { id: 3, name: "LinkedIn Ads", icon: "linkedin", status: "connected", lastSync: "10 mins ago" },
    { id: 4, name: "Zoho CRM", icon: "zoho", status: "connected", lastSync: "3 mins ago" },
    { id: 5, name: "Google Analytics", icon: "analytics", status: "connected", lastSync: "1 min ago" },
  ],
  hr: [
    { id: 1, name: "Keka", icon: "keka", status: "connected", lastSync: "5 mins ago", description: "Attendance & Payroll" },
    { id: 2, name: "Lynk LMS", icon: "lynk", status: "connected", lastSync: "10 mins ago", description: "Learning Management" },
    { id: 3, name: "Slack", icon: "slack", status: "not_connected", lastSync: null, description: "Team Communication" },
  ],
  accounts: [
    { id: 1, name: "Tally", icon: "tally", status: "connected", lastSync: "15 mins ago", description: "Accounting" },
    { id: 2, name: "Zoho Books", icon: "zoho", status: "not_connected", lastSync: null, description: "Invoicing" },
    { id: 3, name: "Razorpay", icon: "razorpay", status: "connected", lastSync: "30 mins ago", description: "Payments" },
  ],
  operations: [
    { id: 1, name: "ClickUp", icon: "clickup", status: "not_connected", lastSync: null, description: "Project Management" },
    { id: 2, name: "Slack", icon: "slack", status: "connected", lastSync: "1 min ago", description: "Team Communication" },
    { id: 3, name: "Google Calendar", icon: "google", status: "connected", lastSync: "2 mins ago", description: "Scheduling" },
  ],
};

// ============ DASHBOARD METRICS ============
export const dashboardMetrics = {
  sales: {
    kpis: [
      { label: "Total Spend", value: 847500, change: 12.5, format: "currency" },
      { label: "Leads", value: 1247, change: 18.3, format: "number" },
      { label: "CPL", value: 679, change: -8.2, format: "currency" },
      { label: "ROAS", value: 4.2, change: 15.6, format: "roas" },
      { label: "Pipeline Value", value: 12500000, change: 31.2, format: "currency" },
    ],
    health: "green",
  },
  hr: {
    kpis: [
      { label: "Total Employees", value: 82, change: 5, format: "number" },
      { label: "Open Positions", value: 6, change: 2, format: "number" },
      { label: "Onboarding", value: 4, change: 1, format: "number" },
      { label: "Training Completion", value: 87, change: 12, format: "percent" },
      { label: "Attrition Rate", value: 4.2, change: -1.5, format: "percent" },
    ],
    health: "green",
  },
  accounts: {
    kpis: [
      { label: "Total Receivables", value: 3250000, change: 8.5, format: "currency" },
      { label: "Overdue", value: 740000, change: -15, format: "currency" },
      { label: "Monthly Revenue", value: 2850000, change: 22, format: "currency" },
      { label: "Expenses", value: 1450000, change: 5, format: "currency" },
      { label: "Net Profit", value: 1400000, change: 18, format: "currency" },
    ],
    health: "amber",
  },
  operations: {
    kpis: [
      { label: "Active Tasks", value: 48, change: 5, format: "number" },
      { label: "On Track", value: 38, change: 8, format: "number" },
      { label: "At Risk", value: 6, change: -2, format: "number" },
      { label: "SLA Compliance", value: 94, change: 3, format: "percent" },
      { label: "Avg Delivery", value: 4.2, change: -0.5, format: "days" },
    ],
    health: "green",
  },
};

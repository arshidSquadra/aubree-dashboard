import { useState } from "react";
import { User, Bell, Shield, Building2, Palette, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useModule } from "@/contexts/ModuleContext";
import { cn } from "@/lib/utils";

const roles = [
  { id: "owner", label: "Owner", description: "Full access to all modules and settings" },
  { id: "dept_head", label: "Department Head", description: "Access to department-specific data and approvals" },
  { id: "core_member", label: "Core Member", description: "Limited access to assigned tasks and reports" },
];

export default function Settings() {
  const { activeModule, userRole, setUserRole } = useModule();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="roles" className="gap-2">
            <Shield className="w-4 h-4" />
            Roles & Access
          </TabsTrigger>
          <TabsTrigger value="company" className="gap-2">
            <Building2 className="w-4 h-4" />
            Company
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="card-base p-6 space-y-6">
            <h3 className="font-semibold">Profile Information</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Full Name</label>
                <Input defaultValue="Rajesh Mehta" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Email</label>
                <Input defaultValue="rajesh@aubree.in" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Phone</label>
                <Input defaultValue="+91 98765 43210" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Department</label>
                <Select defaultValue="management">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="management">Management</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button className="gap-2" style={{ background: `hsl(var(--module-${activeModule}))` }}>
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <div className="card-base p-6 space-y-6">
            <h3 className="font-semibold">Notification Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive email updates for important events</p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">Get instant notifications in browser</p>
                </div>
                <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div>
                  <p className="font-medium">Weekly Digest</p>
                  <p className="text-sm text-muted-foreground">Receive weekly summary email</p>
                </div>
                <Switch checked={weeklyDigest} onCheckedChange={setWeeklyDigest} />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles">
          <div className="card-base p-6 space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Aubree Role Switcher</h3>
              <p className="text-sm text-muted-foreground mb-4">Switch roles to see how the interface changes for different user types</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {roles.map((role) => (
                <div
                  key={role.id}
                  onClick={() => setUserRole(role.id as any)}
                  className={cn(
                    "p-4 rounded-xl border-2 cursor-pointer transition-all",
                    userRole === role.id 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/30"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{role.label}</h4>
                    {userRole === role.id && (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-primary text-primary-foreground">Active</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{role.description}</p>
                </div>
              ))}
            </div>
            
            <div className="p-4 rounded-lg bg-muted/30">
              <h4 className="font-medium mb-2">Current Role Permissions</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {userRole === "owner" && (
                  <>
                    <li>✓ Full access to all modules</li>
                    <li>✓ Can manage users and roles</li>
                    <li>✓ Can view all reports and analytics</li>
                    <li>✓ Can approve all request types</li>
                  </>
                )}
                {userRole === "dept_head" && (
                  <>
                    <li>✓ Access to department-specific data</li>
                    <li>✓ Can approve department requests</li>
                    <li>✓ Can view department reports</li>
                    <li>✗ Cannot manage company settings</li>
                  </>
                )}
                {userRole === "core_member" && (
                  <>
                    <li>✓ Can view assigned tasks</li>
                    <li>✓ Can submit requests</li>
                    <li>✗ Cannot approve requests</li>
                    <li>✗ Limited report access</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </TabsContent>

        {/* Company Tab */}
        <TabsContent value="company">
          <div className="card-base p-6 space-y-6">
            <h3 className="font-semibold">Company Information</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Company Name</label>
                <Input defaultValue="Aubree Bengaluru" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Industry</label>
                <Input defaultValue="Premium Cakes & Desserts" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Website</label>
                <Input defaultValue="https://aubree.in" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Account Manager</label>
                <Input defaultValue="Priya Sharma" disabled />
              </div>
            </div>
            <Button className="gap-2" style={{ background: `hsl(var(--module-${activeModule}))` }}>
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

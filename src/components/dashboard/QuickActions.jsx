
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Plus, 
  MapPin, 
  ShoppingCart, 
  Users, 
  BarChart3,
  Calendar,
  Target,
  ClipboardList,
  Settings
} from "lucide-react";

export default function QuickActions({ userRole }) {
  const getQuickActionsForRole = () => {
    const baseActions = [
      {
        title: "New Visit",
        description: "Schedule field visit",
        icon: MapPin,
        url: createPageUrl("Visits") + "?action=new",
        color: "bg-blue-600 hover:bg-blue-700",
        roles: ["MDO", "TSM", "RBH", "RMM", "ZBH", "admin", "super_admin"]
      },
      {
        title: "New Order",
        description: "Create sales order",
        icon: ShoppingCart,
        url: createPageUrl("Orders") + "?action=new",
        color: "bg-green-600 hover:bg-green-700",
        roles: ["TSM", "RBH", "RMM", "ZBH", "admin", "super_admin"] // MDO removed from here
      },
      {
        title: "Add Contact",
        description: "Register new client",
        icon: Users,
        url: createPageUrl("Contacts") + "?action=new",
        color: "bg-purple-600 hover:bg-purple-700",
        roles: ["MDO", "TSM", "RBH", "RMM", "ZBH", "admin", "super_admin"]
      },
      {
        title: "Assign Task",
        description: "Create team task",
        icon: Target,
        url: createPageUrl("Tasks") + "?action=new",
        color: "bg-orange-600 hover:bg-orange-700",
        roles: ["TSM", "RBH", "RMM", "ZBH", "admin", "super_admin"]
      },
      {
        title: "Monthly Plan",
        description: "Create monthly planning",
        icon: Calendar,
        url: createPageUrl("MonthlyPlanning") + "?action=new",
        color: "bg-indigo-600 hover:bg-indigo-700",
        roles: ["TSM", "RBH", "RMM", "ZBH", "admin", "super_admin"]
      },
      {
        title: "View Reports",
        description: "Performance analytics",
        icon: BarChart3,
        url: createPageUrl("Reports"),
        color: "bg-red-600 hover:bg-red-700",
        roles: ["TSM", "RBH", "RMM", "ZBH", "admin", "super_admin"]
      },
      {
        title: "Liquidation",
        description: "Track stock movement",
        icon: ClipboardList,
        url: createPageUrl("LiquidationTracker"),
        color: "bg-teal-600 hover:bg-teal-700",
        roles: ["MDO", "TSM", "RBH", "RMM", "ZBH", "admin", "super_admin"]
      },
      {
        title: "User Management",
        description: "Manage system users",
        icon: Settings,
        url: createPageUrl("SuperAdminUsers"),
        color: "bg-gray-600 hover:bg-gray-700",
        roles: ["admin", "super_admin"]
      }
    ];

    return baseActions.filter(action => action.roles.includes(userRole));
  };

  const actions = getQuickActionsForRole();

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-slate-900">Quick Actions</CardTitle>
          <Badge variant="outline" className="text-blue-600 border-blue-200">
            {userRole} Access
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => (
          <Link key={index} to={action.url}>
            <Button 
              className={`w-full justify-start h-auto p-4 ${action.color} text-white shadow-md hover:shadow-lg transition-all duration-200`}
            >
              <div className="flex items-center gap-3 w-full">
                <action.icon className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold">{action.title}</div>
                  <div className="text-xs opacity-90">{action.description}</div>
                </div>
              </div>
            </Button>
          </Link>
        ))}
        
        {actions.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-4">
            No quick actions available for your role.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

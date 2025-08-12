

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { User } from "@/api/entities";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  MapPin,
  ShoppingCart,
  ClipboardList,
  Target,
  Calendar,
  Users,
  BarChart3,
  Menu,
  LogOut,
  ChevronDown,
  Bell,
  MoreVertical,
  Clock,
  Settings,
  UserCheck,
  Sparkles,
  AlertTriangle,
  Code,
  Banknote,
  FileText, // Added FileText icon
  Smartphone // Added Smartphone icon for Mobile Preview
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const getNavigationItems = (userRole) => {
  const baseItems = [
    {
      title: "Dashboard",
      url: createPageUrl("Dashboard"),
      icon: LayoutDashboard,
      roles: ["MDO", "TSM", "RBH", "RMM", "ZBH", "admin", "super_admin"]
    },
    {
      title: "Field Visits",
      url: createPageUrl("Visits"),
      icon: MapPin,
      roles: ["MDO", "TSM", "RBH", "RMM", "ZBH", "admin", "super_admin"]
    },
    {
      title: "Sales Orders",
      url: createPageUrl("Orders"),
      icon: ShoppingCart,
      roles: ["TSM", "RBH", "RMM", "ZBH", "admin", "super_admin"]
    },
    {
      title: "Liquidation",
      url: createPageUrl("LiquidationTracker"),
      icon: ClipboardList,
      roles: ["MDO", "TSM", "RBH", "RMM", "ZBH", "admin", "super_admin"]
    },
    {
      title: "Annual Targets",
      url: createPageUrl("AnnualTargets"),
      icon: Target,
      roles: ["MDO", "TSM", "RBH", "RMM", "ZBH"]
    },
    {
      title: "Tasks & Gamification",
      url: createPageUrl("Tasks"),
      icon: Target,
      roles: ["MDO", "TSM", "RBH", "RMM", "ZBH", "admin", "super_admin"]
    },
    {
      title: "Monthly Planning",
      url: createPageUrl("MonthlyPlanning"),
      icon: Calendar,
      roles: ["TSM", "RBH", "RMM", "ZBH", "admin", "super_admin"]
    },
    {
      title: "Contacts",
      url: createPageUrl("Contacts"),
      icon: Users,
      roles: ["MDO", "TSM", "RBH", "RMM", "ZBH", "admin", "super_admin"]
    },
    {
      title: "Reports",
      url: createPageUrl("Reports"),
      icon: BarChart3,
      roles: ["TSM", "RBH", "RMM", "ZBH", "admin", "super_admin"]
    },
    {
      title: "Team Management",
      url: createPageUrl("Team"),
      icon: Users,
      roles: ["TSM", "RBH", "RMM", "ZBH", "admin", "super_admin"]
    },
    {
      title: "Analytics",
      url: createPageUrl("Analytics"),
      icon: BarChart3,
      roles: ["RBH", "RMM", "ZBH", "admin", "super_admin"] // Regional level and above
    },
    {
      title: "Route Mapping",
      url: createPageUrl("RouteMapping"),
      icon: MapPin,
      roles: ["MDO", "TSM", "RBH", "RMM", "ZBH", "admin", "super_admin"]
    },
    {
      title: "Ageing Analysis",
      url: createPageUrl("AgeingAnalysis"),
      icon: Clock,
      roles: ["TSM", "RBH", "RMM", "ZBH", "admin", "super_admin"]
    },
    {
      title: "Alerts & Exceptions",
      url: createPageUrl("AlertsExceptions"),
      icon: AlertTriangle,
      roles: ["TSM", "RBH", "RMM", "ZBH", "admin", "super_admin"]
    },
    {
      title: "Ask Gency",
      url: createPageUrl("AskGency"),
      icon: Sparkles,
      roles: ["MDO", "TSM", "RBH", "RMM", "ZBH", "admin", "super_admin"]
    },
    {
      title: "Mobile App Design",
      url: createPageUrl("MobileAppDesign"),
      icon: Settings,
      roles: ["admin", "super_admin"]
    },
    {
      title: "Mobile Preview",
      url: createPageUrl("MobilePreview"),
      icon: Smartphone,
      roles: ["admin", "super_admin"]
    },
    {
      title: "Mobile Developer Docs",
      url: createPageUrl("MobileDeveloperDocs"),
      icon: Code,
      roles: ["admin", "super_admin"]
    },
    // New navigation item for Technical Documentation
    {
      title: "Technical Documentation",
      url: createPageUrl("TechnicalDocumentation"),
      icon: FileText, // Using the new FileText icon
      roles: ["admin", "super_admin"]
    },
    {
      title: "Finance Dashboard",
      url: createPageUrl("FinanceDashboard"),
      icon: Banknote,
      roles: ["admin", "super_admin"]
    },
    // Settings Section items
    {
      title: "User Management",
      url: createPageUrl("SuperAdminUsers"),
      icon: Users,
      roles: ["admin", "super_admin"]
    },
    {
      title: "Location Settings",
      url: createPageUrl("PredefinedLocations"),
      icon: Settings,
      roles: ["admin", "super_admin"]
    }
  ];

  return baseItems.filter(item => item.roles.includes(userRole));
};

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      
      // Apply demo role if set
      const demoRole = localStorage.getItem('demoRole');
      if (demoRole) {
        userData.designation = demoRole;
      } else if (!userData.designation) {
        userData.designation = 'MDO';
      }
      
      setUser(userData);
    } catch (error) {
      console.error("Error loading user:", error);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      await User.logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleRoleChange = (role) => {
    localStorage.setItem('demoRole', role);
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const userRole = user?.designation || 'MDO';
  const navigationItems = getNavigationItems(userRole);

  const Sidebar = ({ className }) => (
    <div className={`h-full bg-white border-r border-gray-200 ${className} flex flex-col`}>
      {/* Logo Section */}
      <div className="px-4 py-6 flex-shrink-0 border-b border-gray-100">
        <div className="flex items-center justify-center">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/582cbced4_gencrestlogo.png" 
            alt="Gencrest Logo" 
            className="h-10" 
          />
        </div>
      </div>

      {/* Navigation Section - Updated with Settings grouping */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {/* Business Operations */}
          {navigationItems
            .filter(item => !["User Management", "Location Settings", "Mobile App Design", "Mobile Preview", "Mobile Developer Docs", "Technical Documentation", "Finance Dashboard"].includes(item.title))
            .map((item) => {
              const isActive = location.pathname === item.url || 
                             (item.url.includes(currentPageName) && currentPageName);
              
              return (
                <Link
                  key={item.title}
                  to={item.url}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-100 ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                      : 'text-gray-700'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              );
            })}
          
          {/* Finance Section */}
          {navigationItems.some(item => ["Finance Dashboard"].includes(item.title)) && (
            <>
              <div className="pt-4 pb-2">
                <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <Banknote className="h-3 w-3" />
                  Finance
                </div>
              </div>
              {navigationItems
                .filter(item => ["Finance Dashboard"].includes(item.title))
                .map((item) => {
                  const isActive = location.pathname === item.url || 
                                 (item.url.includes(currentPageName) && currentPageName);
                  
                  return (
                    <Link
                      key={item.title}
                      to={item.url}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-100 ${
                        isActive 
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                          : 'text-gray-700'
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.title}
                    </Link>
                  );
                })}
            </>
          )}

          {/* Settings Section */}
          {navigationItems.some(item => ["User Management", "Location Settings", "Mobile App Design", "Mobile Preview", "Mobile Developer Docs", "Technical Documentation"].includes(item.title)) && (
            <>
              <div className="pt-4 pb-2">
                <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <Settings className="h-3 w-3" />
                  Settings
                </div>
              </div>
              {navigationItems
                .filter(item => ["User Management", "Location Settings", "Mobile App Design", "Mobile Preview", "Mobile Developer Docs", "Technical Documentation"].includes(item.title))
                .map((item) => {
                  const isActive = location.pathname === item.url || 
                                 (item.url.includes(currentPageName) && currentPageName);
                  
                  return (
                    <Link
                      key={item.title}
                      to={item.url}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-100 ${
                        isActive 
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                          : 'text-gray-700'
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.title}
                    </Link>
                  );
                })}
            </>
          )}
        </div>
      </div>

      {/* User Profile Section - Simplified */}
      <div className="px-4 py-4 border-t border-gray-100 bg-white flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-xs">
              {user?.full_name?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.full_name || 'User'}
            </p>
            <Badge variant="secondary" className="text-xs mt-1">
              {userRole}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="hidden md:flex">
        <div className="w-64 fixed inset-y-0">
          <Sidebar />
        </div>
        <div className="flex-1 ml-64">
          {/* Top Header Bar for Desktop */}
          <div className="bg-white border-b border-gray-200 px-6 py-3 flex justify-end items-center gap-3">
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              {user?.territory || 'Territory'}
            </Badge>
            
            {/* Role Switcher Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2 text-sm text-gray-500">
                  <div className="font-medium">Demo Role Switcher</div>
                  <div className="text-xs">Current: {userRole}</div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleRoleChange('RMM')}>
                  <UserCheck className="mr-2 h-4 w-4" />
                  <span>RMM (Regional Manager)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleRoleChange('RBH')}>
                  <UserCheck className="mr-2 h-4 w-4" />
                  <span>RBH (Regional Head)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleRoleChange('TSM')}>
                  <UserCheck className="mr-2 h-4 w-4" />
                  <span>TSM (Territory Manager)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleRoleChange('MDO')}>
                  <UserCheck className="mr-2 h-4 w-4" />
                  <span>MDO (Field Officer)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleRoleChange('admin')}>
                  <UserCheck className="mr-2 h-4 w-4" />
                  <span>Admin View</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleRoleChange('super_admin')}>
                  <UserCheck className="mr-2 h-4 w-4" />
                  <span>Super Admin View</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <main className="min-h-screen">
            {children}
          </main>
        </div>
      </div>

      <div className="md:hidden">
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <div>
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/582cbced4_gencrestlogo.png" 
              alt="Gencrest Logo" 
              className="h-8" 
            />
          </div>
          
          <div className="flex items-center gap-2">
            {/* Mobile Role Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2 text-sm text-gray-500">
                  <div className="font-medium">Demo Role Switcher</div>
                  <div className="text-xs">Current: {userRole}</div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleRoleChange('RMM')}>
                  <UserCheck className="mr-2 h-4 w-4" />
                  <span>RMM (Regional Manager)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleRoleChange('RBH')}>
                  <UserCheck className="mr-2 h-4 w-4" />
                  <span>RBH (Regional Head)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleRoleChange('TSM')}>
                  <UserCheck className="mr-2 h-4 w-4" />
                  <span>TSM (Territory Manager)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleRoleChange('MDO')}>
                  <UserCheck className="mr-2 h-4 w-4" />
                  <span>MDO (Field Officer)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleRoleChange('admin')}>
                  <UserCheck className="mr-2 h-4 w-4" />
                  <span>Admin View</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleRoleChange('super_admin')}>
                  <UserCheck className="mr-2 h-4 w-4" />
                  <span>Super Admin View</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <Sidebar />
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}


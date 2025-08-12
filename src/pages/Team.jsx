
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Visit } from "@/api/entities";
import { SalesOrder } from "@/api/entities";
import { GeofenceAlert } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Users, 
  Search, 
  MapPin, 
  ShoppingCart, 
  TrendingUp,
  Phone,
  Mail,
  Calendar,
  Target,
  Award,
  AlertTriangle
} from "lucide-react";

export default function Team() {
  const [user, setUser] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [performanceData, setPerformanceData] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Demo team data - always available
  const demoTeamMembers = [
    {
      id: "demo-1",
      full_name: "Rajesh Kumar",
      email: "rajesh.kumar@gencrest.com",
      designation: "MDO",
      territory: "North Delhi",
      phone: "+91 98765 43210",
      join_date: "2023-01-15",
      employee_id: "EMP001",
      targets: { monthly_visits: 50, monthly_sales: 500000 }
    },
    {
      id: "demo-2",
      full_name: "Priya Sharma", 
      email: "priya.sharma@gencrest.com",
      designation: "MDO",
      territory: "South Delhi",
      phone: "+91 98765 43211",
      join_date: "2023-02-20",
      employee_id: "EMP002",
      targets: { monthly_visits: 45, monthly_sales: 450000 }
    },
    {
      id: "demo-3",
      full_name: "Amit Singh",
      email: "amit.singh@gencrest.com",
      designation: "MDO", 
      territory: "West Delhi",
      phone: "+91 98765 43212",
      join_date: "2023-03-10",
      employee_id: "EMP003",
      targets: { monthly_visits: 55, monthly_sales: 600000 }
    },
    {
      id: "demo-4",
      full_name: "Sunita Patel",
      email: "sunita.patel@gencrest.com",
      designation: "MDO",
      territory: "East Delhi", 
      phone: "+91 98765 43213",
      join_date: "2023-04-05",
      employee_id: "EMP004",
      targets: { monthly_visits: 48, monthly_sales: 520000 }
    },
    {
      id: "demo-5",
      full_name: "Vikram Reddy",
      email: "vikram.reddy@gencrest.com",
      designation: "MDO",
      territory: "Gurgaon",
      phone: "+91 98765 43214", 
      join_date: "2023-05-12",
      employee_id: "EMP005",
      targets: { monthly_visits: 52, monthly_sales: 580000 }
    },
    {
      id: "demo-6",
      full_name: "Kavita Joshi",
      email: "kavita.joshi@gencrest.com",
      designation: "MDO",
      territory: "Faridabad",
      phone: "+91 98765 43215",
      join_date: "2023-06-18",
      employee_id: "EMP006", 
      targets: { monthly_visits: 46, monthly_sales: 480000 }
    }
  ];

  useEffect(() => {
    loadTeamData();
  }, []);

  const loadTeamData = async () => {
    try {
      const userData = await User.me();
      const demoRole = localStorage.getItem('demoRole');
      if (demoRole) {
        userData.designation = demoRole;
      }
      setUser(userData);

      // Always use demo data to ensure team members are visible
      setTeamMembers(demoTeamMembers);
      
      const alertsData = await GeofenceAlert.list();
      setAlerts(alertsData || []);

      // Generate realistic performance data for all demo members
      const performance = {};
      
      demoTeamMembers.forEach((member) => {
        // Generate realistic demo performance data
        const baseVisits = Math.floor(Math.random() * 15) + 20; // 20-35 visits
        const completedVisits = Math.floor(baseVisits * (0.7 + Math.random() * 0.25)); // 70-95% completion
        const baseSales = Math.floor(Math.random() * 200000) + 300000; // 3-5L sales
        const orderCount = Math.floor(Math.random() * 8) + 4; // 4-12 orders

        performance[member.email] = {
          visits: {
            total: baseVisits,
            completed: completedVisits,
            target: member.targets?.monthly_visits || 50,
            completion_rate: Math.round((completedVisits / (member.targets?.monthly_visits || 50)) * 100)
          },
          sales: {
            total_value: baseSales,
            orders_count: orderCount,
            target: member.targets?.monthly_sales || 500000,
            achievement_rate: Math.round((baseSales / (member.targets?.monthly_sales || 500000)) * 100)
          },
          activities: {
            last_visit: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            last_order: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          }
        };
      });

      setPerformanceData(performance);
    } catch (error) {
      console.error("Error loading team data:", error);
      // Even on error, ensure demo data is set
      setTeamMembers(demoTeamMembers);
    }
    setLoading(false);
  };

  const filteredMembers = teamMembers.filter(member => 
    (member.full_name || '').toLowerCase().includes((searchTerm || '').toLowerCase()) ||
    (member.territory || '').toLowerCase().includes((searchTerm || '').toLowerCase())
  );

  // Calculate team stats
  const teamStats = {
    totalVisits: Object.values(performanceData).reduce((sum, p) => sum + (p.visits?.total || 0), 0),
    totalSales: Object.values(performanceData).reduce((sum, p) => sum + (p.sales?.total_value || 0), 0),
    avgPerformance: Object.values(performanceData).reduce((sum, p) => sum + (p.visits?.completion_rate || 0), 0) / Math.max(Object.keys(performanceData).length, 1)
  };

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              Team Management
            </h1>
            <p className="text-slate-600 mt-2">Monitor your team's performance and activities</p>
          </div>
          <Badge variant="outline" className="text-blue-600 border-blue-200">
            {teamMembers.length} Team Members
          </Badge>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Visits</p>
                  <p className="text-3xl font-bold">{teamStats.totalVisits}</p>
                </div>
                <MapPin className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Total Sales</p>
                  <p className="text-3xl font-bold">₹{(teamStats.totalSales / 100000).toFixed(1)}L</p>
                </div>
                <ShoppingCart className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Avg Performance</p>
                  <p className="text-3xl font-bold">{Math.round(teamStats.avgPerformance)}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search team members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => {
            const performance = performanceData[member.email] || {};
            const memberAlerts = alerts.filter(a => a.mdo_id === member.email && a.status === 'pending_review');

            return (
              <Card key={member.id} className="bg-white/90 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500">
                        <AvatarFallback className="text-white font-semibold">
                          {member.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{member.full_name}</CardTitle>
                        <p className="text-sm text-slate-600">{member.designation}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge 
                        variant="outline" 
                        className={
                          performance.visits?.completion_rate >= 80 
                            ? "border-green-200 text-green-700" 
                            : performance.visits?.completion_rate >= 60
                            ? "border-yellow-200 text-yellow-700"
                            : "border-red-200 text-red-700"
                        }
                      >
                        {performance.visits?.completion_rate || 0}%
                      </Badge>
                      {memberAlerts.length > 0 && (
                        <Badge variant="destructive">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {memberAlerts.length} Alerts
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Contact Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="w-4 h-4" />
                      {member.territory}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone className="w-4 h-4" />
                      {member.phone}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Mail className="w-4 h-4" />
                      {member.email}
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="space-y-3 pt-3 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Visits</span>
                      <span className="text-sm font-medium">
                        {performance.visits?.completed || 0}/{performance.visits?.target || 0}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min(100, (performance.visits?.completion_rate || 0))}%` 
                        }}
                      ></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Sales Target</span>
                      <span className="text-sm font-medium">
                        {performance.sales?.achievement_rate || 0}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min(100, (performance.sales?.achievement_rate || 0))}%` 
                        }}
                      ></div>
                    </div>

                    <div className="flex justify-between text-xs text-slate-500 pt-2">
                      <span>Last Visit: {performance.activities?.last_visit || 'N/A'}</span>
                      <span>Last Order: {performance.activities?.last_order || 'N/A'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredMembers.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">No team members found</h3>
              <p className="text-slate-500">
                {searchTerm ? 'Try adjusting your search terms' : 'No team members assigned yet'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

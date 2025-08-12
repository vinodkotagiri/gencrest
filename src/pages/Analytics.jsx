import React, { useState, useEffect } from "react";
import { Visit } from "@/api/entities";
import { SalesOrder } from "@/api/entities";
import { Client } from "@/api/entities";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { BarChart3, TrendingUp, Route, Clock, MapPin, Download } from "lucide-react";

export default function Analytics() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      console.error("Error loading user:", error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="animate-pulse space-y-4">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              Advanced Analytics
            </h1>
            <p className="text-slate-600">Comprehensive business insights and analytics</p>
          </div>
        </div>

        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80">
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="routes" className="flex items-center gap-2">
              <Route className="w-4 h-4" />
              Route Analysis
            </TabsTrigger>
            <TabsTrigger value="ageing" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Ageing Analysis
            </TabsTrigger>
            <TabsTrigger value="mapping" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Territory Mapping
            </TabsTrigger>
          </TabsList>

          <TabsContent value="performance">
            <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-lg">
              <CardHeader>
                <CardTitle>Sales Performance Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link to={createPageUrl("Reports")}>
                  <Button className="w-full justify-start h-auto p-4 bg-blue-600 hover:bg-blue-700 text-white">
                    <div className="text-left">
                      <div className="font-semibold">Sales Performance Report</div>
                      <div className="text-xs opacity-90">Detailed sales metrics and trends</div>
                    </div>
                  </Button>
                </Link>
                <p className="text-sm text-slate-600">
                  Access comprehensive sales performance metrics, revenue trends, and team productivity analysis.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="routes">
            <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-lg">
              <CardHeader>
                <CardTitle>Route Mapping & Movement Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link to={createPageUrl("RouteMapping")}>
                  <Button className="w-full justify-start h-auto p-4 bg-green-600 hover:bg-green-700 text-white">
                    <div className="text-left">
                      <div className="font-semibold">Route Mapping Dashboard</div>
                      <div className="text-xs opacity-90">Track field staff movement and visit patterns</div>
                    </div>
                  </Button>
                </Link>
                <p className="text-sm text-slate-600">
                  Visualize daily routes, track movement patterns, measure field efficiency, and optimize territory coverage.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ageing">
            <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-lg">
              <CardHeader>
                <CardTitle>Payment Ageing & Outstanding Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link to={createPageUrl("AgeingAnalysis")}>
                  <Button className="w-full justify-start h-auto p-4 bg-red-600 hover:bg-red-700 text-white">
                    <div className="text-left">
                      <div className="font-semibold">Ageing Analysis Dashboard</div>
                      <div className="text-xs opacity-90">Monitor payment delays and manage collections</div>
                    </div>
                  </Button>
                </Link>
                <p className="text-sm text-slate-600">
                  Track outstanding payments, analyze ageing buckets, identify collection priorities, and manage credit risks.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mapping">
            <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-lg">
              <CardHeader>
                <CardTitle>Territory & Client Mapping</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start h-auto p-4 bg-purple-600 hover:bg-purple-700 text-white" disabled>
                  <div className="text-left">
                    <div className="font-semibold">Territory Mapping (Coming Soon)</div>
                    <div className="text-xs opacity-90">Interactive maps with client locations and territories</div>
                  </div>
                </Button>
                <p className="text-sm text-slate-600">
                  Interactive territory maps, client location visualization, coverage analysis, and route optimization recommendations.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
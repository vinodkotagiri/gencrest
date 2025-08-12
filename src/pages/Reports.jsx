import React, { useState, useEffect, useMemo } from "react";
import { User } from "@/api/entities";
import { Visit } from "@/api/entities";
import { Task } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Download, Filter, Users } from "lucide-react";
import { exportTeamReport } from "@/api/functions";

import ReportFilters from "../components/reports/ReportFilters";
import StatCards from "../components/reports/StatCards";
import PerformanceChart from "../components/reports/PerformanceChart";
import TeamPerformanceTable from "../components/reports/TeamPerformanceTable";

export default function ReportsPage() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [visits, setVisits] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    dateRange: "last_30_days",
    mdo_id: "all"
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersData, visitsData, tasksData] = await Promise.all([
        User.filter({ designation: "MDO" }),
        Visit.list(),
        Task.list()
      ]);
      setTeamMembers(usersData || []);
      setVisits(visitsData || []);
      setTasks(tasksData || []);
    } catch (error) {
      console.error("Error loading report data:", error);
    }
    setLoading(false);
  };

  const filteredData = useMemo(() => {
    const now = new Date();
    let startDate = new Date();

    switch (filters.dateRange) {
      case "last_7_days":
        startDate.setDate(now.getDate() - 7);
        break;
      case "last_30_days":
        startDate.setDate(now.getDate() - 30);
        break;
      case "last_90_days":
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate = new Date(0); // From the beginning of time
    }

    const filteredVisits = visits.filter(v => new Date(v.visit_date || v.created_date) >= startDate);
    const filteredTasks = tasks.filter(t => new Date(t.target_date || t.created_date) >= startDate);
    
    let members = teamMembers;
    if (filters.mdo_id !== "all") {
      members = teamMembers.filter(m => m.email === filters.mdo_id);
    }

    return { visits: filteredVisits, tasks: filteredTasks, members };
  }, [visits, tasks, teamMembers, filters]);
  
  const handleExport = async () => {
    alert("Generating PDF report... This may take a moment.");
    try {
      const { data } = await exportTeamReport({ 
        filters,
        teamMembers: filteredData.members.map(m => m.email) 
      });
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `team_performance_report_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error("Error exporting report:", error);
      alert("Failed to generate PDF report. Please try again.");
    }
  };


  if (loading) {
    return <div className="p-8">Loading reports...</div>;
  }

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              Team Performance Report
            </h1>
            <p className="text-slate-600">Analyze team activities, task completion, and visit metrics.</p>
          </div>
          <Button onClick={handleExport} variant="outline" className="bg-white/80 border-blue-200">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>

        <ReportFilters
          filters={filters}
          onFilterChange={setFilters}
          teamMembers={teamMembers}
        />

        <StatCards
          visits={filteredData.visits}
          tasks={filteredData.tasks}
          teamMembers={filteredData.members}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PerformanceChart 
            visits={filteredData.visits}
            teamMembers={filteredData.members}
          />
          <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-lg">
             <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                    <Users className="w-5 h-5 text-purple-600" />
                    Team Members Overview
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                    {filteredData.members.map(mdo => (
                        <div key={mdo.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                            <div>
                                <p className="font-semibold text-slate-800">{mdo.full_name}</p>
                                <p className="text-xs text-slate-500">{mdo.territory}</p>
                            </div>
                            <Badge variant="outline" className="text-blue-600 border-blue-200">{mdo.designation}</Badge>
                        </div>
                    ))}
                </div>
            </CardContent>
          </Card>
        </div>

        <TeamPerformanceTable
          visits={filteredData.visits}
          tasks={filteredData.tasks}
          teamMembers={filteredData.members}
        />
      </div>
    </div>
  );
}
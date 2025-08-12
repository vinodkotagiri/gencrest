import React, { useState, useEffect } from "react";
import { Visit } from "@/api/entities";
import { Client } from "@/api/entities";
import { User } from "@/api/entities";
import { Task } from "@/api/entities";
import { AuditTrail } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, 
  Plus, 
  Search, 
  List,
  Calendar
} from "lucide-react";

import VisitForm from "../components/visits/VisitForm";
import VisitCard from "../components/visits/VisitCard";
import VisitFilters from "../components/visits/VisitFilters";
import VisitExecutionModal from "../components/visits/VisitExecutionModal";

// Simple diff function to replace deep-object-diff
const calculateChanges = (oldObj, newObj) => {
  const changes = {};
  const allKeys = new Set([...Object.keys(oldObj || {}), ...Object.keys(newObj || {})]);
  
  allKeys.forEach(key => {
    const oldVal = oldObj?.[key];
    const newVal = newObj?.[key];
    
    if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
      changes[key] = {
        old_value: oldVal,
        new_value: newVal
      };
    }
  });
  
  return changes;
};

export default function Visits() {
  const [visits, setVisits] = useState([]);
  const [clients, setClients] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVisit, setEditingVisit] = useState(null);
  const [executingVisit, setExecutingVisit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    date_range: "all",
    client_type: "all",
    mdo_id: "all"
  });

  useEffect(() => {
    loadData();
    
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('action') === 'new') {
      setShowForm(true);
    }
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const userData = await User.me();
      const demoRole = localStorage.getItem('demoRole');
      if (demoRole) {
        userData.designation = demoRole;
      }
      setUser(userData);
      const isManager = userData.designation !== "MDO";

      let [clientsData, visitsData, teamMembersData, tasksData] = await Promise.all([
        Client.list("-created_date"),
        isManager 
          ? Visit.list("-created_date") 
          : Visit.filter({ mdo_id: userData.email }, "-created_date"),
        isManager ? User.filter({ designation: "MDO" }) : Promise.resolve([]),
        Task.list()
      ]);
      
      if ((!visitsData || visitsData.length === 0) && userData.designation === "MDO") {
        if (!clientsData || clientsData.length < 2) {
          clientsData = [
            { id: 'sample-client-1', client_name: 'My First Retailer', client_type: 'retailer', address: '123 Market St, Your City' },
            { id: 'sample-client-2', client_name: 'My First Distributor', client_type: 'distributor', address: '456 Industrial Rd, Your City' },
            ...(clientsData || [])
          ];
        }

        const generateDate = (daysOffset) => {
          const date = new Date();
          date.setDate(date.getDate() + daysOffset);
          return date.toISOString().split('T')[0];
        };
        
        visitsData = [
          {
            id: 'sample-visit-1',
            client_id: clientsData[0].id,
            visit_date: generateDate(0),
            visit_time: "11:00",
            location: clientsData[0].address,
            visit_purpose: 'sales_call',
            notes: 'This is a sample completed visit created for you. You can edit or delete it.',
            status: 'completed',
            visit_duration: 60,
            mdo_id: userData.email,
            created_date: new Date().toISOString()
          },
          {
            id: 'sample-visit-2',
            client_id: clientsData[1].id,
            visit_date: generateDate(1),
            visit_time: "14:00",
            location: clientsData[1].address,
            visit_purpose: 'follow_up',
            notes: 'This is a sample planned visit. Please review the details before your meeting.',
            status: 'planned',
            visit_duration: 0,
            mdo_id: userData.email,
            created_date: new Date().toISOString()
          }
        ];
      }

      setClients(clientsData || []);
      setVisits(visitsData || []);
      setTeamMembers(teamMembersData || []);
      setTasks(tasksData || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = (visit) => {
    const client = clients.find(c => c.id === visit.client_id);
    const mdo = teamMembers.find(m => m.email === visit.mdo_id) || { full_name: visit.mdo_id };
    
    const reportWindow = window.open('', '_blank');
    reportWindow.document.write(`
      <html>
        <head>
          <title>Visit Report - ${client?.client_name || 'Visit'}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; color: #333; }
            h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; margin-bottom: 30px; }
            .header { background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
            .section { margin-bottom: 20px; }
            .label { font-weight: bold; color: #475569; display: inline-block; width: 100px; }
            .value { margin-left: 10px; }
            .notes { background: #f1f5f9; padding: 15px; border-radius: 6px; margin-top: 10px; white-space: pre-wrap; word-wrap: break-word;}
            @media print { body { margin: 20px; } }
          </style>
        </head>
        <body>
          <h1>Visit Report</h1>
          <div class="header">
            <div class="section">
              <span class="label">Client:</span><span class="value">${client?.client_name || 'Unknown Client'}</span><br>
              <span class="label">Type:</span><span class="value">${client?.client_type || 'Unknown'}</span><br>
              <span class="label">Date:</span><span class="value">${new Date(visit.visit_date).toLocaleDateString()}</span><br>
              <span class="label">Time:</span><span class="value">${visit.visit_time || 'Not specified'}</span><br>
              <span class="label">Duration:</span><span class="value">${visit.visit_duration || 0} minutes</span><br>
              <span class="label">Purpose:</span><span class="value">${(visit.visit_purpose || '').replace('_', ' ')}</span><br>
              <span class="label">Location:</span><span class="value">${visit.location}</span>
            </div>
          </div>
          <div class="section">
            <span class="label">Visit Notes:</span>
            <div class="notes">${visit.notes || 'No notes provided'}</div>
          </div>
          <div class="section">
            <span class="label">Status:</span><span class="value">${visit.status}</span><br>
            <span class="label">MDO:</span><span class="value">${mdo.full_name}</span><br>
            <span class="label">Created:</span><span class="value">${new Date(visit.created_date).toLocaleString()}</span>
          </div>
        </body>
      </html>
    `);
    reportWindow.document.close();
  };

  const handleSubmit = async (visitData) => {
    try {
      const userFullName = user?.full_name || user?.email;
      if (editingVisit) {
        const changes = calculateChanges(editingVisit, visitData);
        await Visit.update(editingVisit.id, visitData);
        if (Object.keys(changes).length > 0) {
          await AuditTrail.create({
            entity_name: "Visit",
            record_id: editingVisit.id,
            action: "update",
            user_email: user.email,
            user_full_name: userFullName,
            changes: changes
          });
        }
      } else {
        const newVisit = await Visit.create({
          ...visitData,
          mdo_id: user?.email
        });
        await AuditTrail.create({
          entity_name: "Visit",
          record_id: newVisit.id,
          action: "create",
          user_email: user.email,
          user_full_name: userFullName,
          changes: { new_data: newVisit }
        });
      }
      setShowForm(false);
      setEditingVisit(null);
      loadData();
    } catch (error) {
      console.error("Error saving visit:", error);
    }
  };

  const handleEdit = (visit) => {
    setEditingVisit(visit);
    setShowForm(true);
  };

  const handleStatusUpdate = async (visitId, newStatus) => {
    try {
      await Visit.update(visitId, { status: newStatus });
      loadData();
    } catch (error) {
      console.error("Error updating visit status:", error);
    }
  };

  const handleExecuteVisit = async (visitId, executionData) => {
    setLoading(true);
    try {
      const userFullName = user?.full_name || user?.email;

      const taskUpdatePromises = Object.entries(executionData.completedTasks)
        .filter(([, data]) => data.completed)
        .map(([taskId, data]) => {
          return Task.update(taskId, {
            status: 'completed',
            completion_notes: data.remarks || 'Completed during visit.',
            completed_date: new Date().toISOString().split('T')[0]
          });
        });

      await Promise.all(taskUpdatePromises);

      const originalVisit = visits.find(v => v.id === visitId);
      const updatedVisitData = {
        status: 'completed',
        notes: executionData.visitNotes,
        visit_duration: executionData.visit_duration || 0,
        photos: executionData.photos,
        attendance_details: executionData.attendance_details,
      };

      await Visit.update(visitId, updatedVisitData);

      const changes = calculateChanges(originalVisit, { ...originalVisit, ...updatedVisitData });
       if (Object.keys(changes).length > 0) {
          await AuditTrail.create({
            entity_name: "Visit",
            record_id: visitId,
            action: "update",
            user_email: user.email,
            user_full_name: userFullName,
            changes: { ...changes, executed_visit: true }
          });
        }

      console.log("Visit and tasks completed successfully!");
    } catch (error) {
      console.error("Error executing visit:", error);
    } finally {
      setExecutingVisit(null);
      await loadData();
    }
  };

  const filteredVisits = visits.filter(visit => {
    const client = clients.find(c => c.id === visit.client_id);
    const clientName = client?.client_name || '';
    const location = visit.location || '';
    const searchLower = (searchTerm || '').toLowerCase();
    
    const matchesSearch = clientName.toLowerCase().includes(searchLower) ||
                         location.toLowerCase().includes(searchLower);
    
    const matchesStatus = filters.status === "all" || visit.status === filters.status;
    const matchesClientType = filters.client_type === "all" || client?.client_type === filters.client_type;
    const matchesMDO = filters.mdo_id === "all" || visit.mdo_id === filters.mdo_id;

    let matchesDate = true;
    if (filters.date_range !== "all") {
      const visitDate = new Date(visit.visit_date);
      const now = new Date();
      switch (filters.date_range) {
        case "today":
          matchesDate = visitDate.toDateString() === now.toDateString();
          break;
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = visitDate >= weekAgo && visitDate <= now;
          break;
        case "month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = visitDate >= monthAgo && visitDate <= now;
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesClientType && matchesDate && matchesMDO;
  });

  const plannedVisits = visits
    .filter(v => v.status === 'planned')
    .sort((a, b) => new Date(a.visit_date).getTime() - new Date(b.visit_date).getTime());

  if (loading) {
    return (
      <div className="p-8 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-1/3 mb-6"></div>
        <div className="h-10 bg-slate-200 rounded w-full mb-8"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Field Visits</h1>
            <p className="text-slate-600">Track and manage your field activities</p>
          </div>
          <Button 
            onClick={() => { setEditingVisit(null); setShowForm(true); }}
            className="bg-blue-600 hover:bg-blue-700 shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Visit
          </Button>
        </div>

        {showForm && (
          <VisitForm
            visit={editingVisit}
            clients={clients}
            onSubmit={handleSubmit}
            onCancel={() => { setShowForm(false); setEditingVisit(null); }}
          />
        )}

        <Tabs defaultValue="planned" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white/80">
            <TabsTrigger value="planned" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Planned Visits ({plannedVisits.length})
            </TabsTrigger>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <List className="w-4 h-4" />
              All Visits ({visits.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="planned" className="space-y-4">
            {plannedVisits.length > 0 ? (
              <div className="grid gap-6">
                {plannedVisits.map((visit) => {
                  const client = clients.find(c => c.id === visit.client_id);
                  const relatedTasks = tasks.filter(t => t.client_id === visit.client_id && t.status !== 'completed');
                  return (
                    <VisitCard
                      key={visit.id}
                      visit={visit}
                      client={client}
                      relatedTasks={relatedTasks}
                      onEdit={handleEdit}
                      onStatusUpdate={handleStatusUpdate}
                      onViewReport={handleViewReport}
                      onExecute={() => setExecutingVisit(visit)}
                      canEdit={user?.designation === "MDO" || visit.mdo_id === user?.email}
                    />
                  );
                })}
              </div>
            ) : (
              <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
                <CardContent className="text-center py-12">
                  <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-600 mb-2">No planned visits</h3>
                  <p className="text-slate-500 mb-4">Schedule your next field visit to get started</p>
                  <Button 
                    onClick={() => { setEditingVisit(null); setShowForm(true); }}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Schedule Visit
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search visits by client or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/80 border-blue-100"
                />
              </div>
              <VisitFilters 
                filters={filters} 
                onFilterChange={setFilters}
                teamMembers={teamMembers}
                userRole={user?.designation}
              />
            </div>

            <div className="grid gap-6">
              {filteredVisits.length > 0 ? (
                filteredVisits.map((visit) => {
                  const client = clients.find(c => c.id === visit.client_id);
                  const relatedTasks = tasks.filter(t => t.client_id === visit.client_id && t.status !== 'completed');
                  return (
                    <VisitCard
                      key={visit.id}
                      visit={visit}
                      client={client}
                      relatedTasks={relatedTasks}
                      onEdit={handleEdit}
                      onStatusUpdate={handleStatusUpdate}
                      onViewReport={handleViewReport}
                      onExecute={() => setExecutingVisit(visit)}
                      canEdit={user?.designation === "MDO" || visit.mdo_id === user?.email}
                    />
                  );
                })
              ) : (
                <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
                  <CardContent className="text-center py-12">
                    <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-600 mb-2">No visits found</h3>
                    <p className="text-slate-500">Try adjusting your search or filters.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        {executingVisit && (
          <VisitExecutionModal
            isOpen={!!executingVisit}
            onClose={() => setExecutingVisit(null)}
            visit={executingVisit}
            client={clients.find(c => c.id === executingVisit.client_id)}
            relatedTasks={tasks.filter(t => t.client_id === executingVisit.client_id && t.status !== 'completed')}
            onComplete={handleExecuteVisit}
          />
        )}
      </div>
    </div>
  );
}
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Calendar, Plus, MapPin, Clock } from "lucide-react";
import { format } from 'date-fns';

export default function PlannedVisits({ visits = [], clients = [] }) {
  const plannedVisits = visits
    .filter(v => v.status === 'planned')
    .sort((a, b) => new Date(a.visit_date) - new Date(b.visit_date))
    .slice(0, 4); // Show top 4 upcoming

  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client?.client_name || 'Unknown Client';
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <Calendar className="w-5 h-5 text-blue-600" />
          Upcoming Planned Visits
        </CardTitle>
        <Link to={createPageUrl("Visits") + "?action=new"}>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-1" />
            New
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {plannedVisits.length > 0 ? (
          plannedVisits.map((visit) => (
            <div key={visit.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 truncate">{getClientName(visit.client_id)}</p>
                <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> 
                    {format(new Date(visit.visit_date), "MMM d, yyyy")} {visit.visit_time ? `at ${visit.visit_time}`: ''}
                  </span>
                </div>
                 <div className="flex items-center gap-1 text-xs text-slate-500 mt-1 truncate">
                    <MapPin className="w-3 h-3" /> {visit.location}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-slate-500">
            <p className="font-medium">No upcoming visits planned.</p>
            <p className="text-xs mt-1">Click the 'New' button to schedule a visit.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
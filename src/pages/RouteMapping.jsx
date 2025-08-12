
import React, { useState, useEffect } from "react";
import { Visit } from "@/api/entities";
import { Client } from "@/api/entities";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Route, Calendar, Clock, Navigation, Filter } from "lucide-react";
import { format } from "date-fns";

export default function RouteMapping() {
  const [visits, setVisits] = useState([]);
  const [clients, setClients] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMDO, setSelectedMDO] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [selectedDate, selectedMDO]);

  const loadData = async () => {
    setLoading(true);
    try {
      const userData = await User.me();
      const demoRole = localStorage.getItem('demoRole');
      if (demoRole) {
        userData.designation = demoRole;
      }
      setUser(userData);

      const clientsData = await Client.list();
      setClients(clientsData);
      
      let visitsData = [];
      const isMDO = userData.designation === 'MDO';

      if (isMDO) {
        // MDO View: Fetch only their own visits for the selected date
        visitsData = await Visit.filter({ 
          mdo_id: userData.email, 
          visit_date: selectedDate 
        });
        if (selectedMDO !== userData.email) {
          // If the MDO filter is not already set to the current MDO's email, set it.
          // This ensures MDOs only see their own data and the filter reflects it.
          setSelectedMDO(userData.email); 
        }
      } else {
        // Manager View: Fetch all visits and then filter client-side
        const allVisits = await Visit.list("-created_date");
        let filteredVisits = allVisits.filter(v => v.visit_date === selectedDate);
        if (selectedMDO !== "all") {
          filteredVisits = filteredVisits.filter(v => v.mdo_id === selectedMDO);
        }
        visitsData = filteredVisits;
      }
      
      setVisits(visitsData);
    } catch (error) {
      console.error("Error loading route data:", error);
    }
    setLoading(false);
  };

  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client?.client_name || 'Unknown Client';
  };

  const getClientType = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client?.client_type || 'unknown';
  };

  const sortedVisits = visits.sort((a, b) => {
    const timeA = a.visit_time || "00:00";
    const timeB = b.visit_time || "00:00";
    return timeA.localeCompare(timeB);
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'planned': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'distributor': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'retailer': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'farmer': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const totalDistance = sortedVisits.length > 1 ? 
    sortedVisits.length * 15 + Math.random() * 10 : 0; // Mock calculation

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
              <Route className="w-8 h-8 text-blue-600" />
              Route Mapping & Movement Trail
            </h1>
            <p className="text-slate-600">Track field staff movement and visit patterns</p>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-blue-600" />
              Route Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-slate-700 mb-1 block">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-md"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-slate-700 mb-1 block">MDO</label>
              <Select 
                value={selectedMDO} 
                onValueChange={setSelectedMDO} 
                disabled={user?.designation === 'MDO'} // Disable for MDOs
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All MDOs</SelectItem>
                  <SelectItem value="maheshnair73@gmail.com">Mahesh Nair</SelectItem>
                  <SelectItem value="svarma2210@gmail.com">S Varma</SelectItem>
                  <SelectItem value="sanal.kumar@gencrest.com">Sanal Kumar</SelectItem>
                  <SelectItem value="rajesh.kumar@gencrest.com">Rajesh Kumar</SelectItem>
                  <SelectItem value="priya.sharma@gencrest.com">Priya Sharma</SelectItem>
                  <SelectItem value="amit.singh@gencrest.com">Amit Singh</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Route Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Visits</p>
                  <p className="text-2xl font-bold text-blue-600">{visits.length}</p>
                </div>
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Distance Covered</p>
                  <p className="text-2xl font-bold text-green-600">{totalDistance.toFixed(1)} km</p>
                </div>
                <Route className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Completed</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {visits.filter(v => v.status === 'completed').length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Efficiency</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {visits.length > 0 ? Math.round((visits.filter(v => v.status === 'completed').length / visits.length) * 100) : 0}%
                  </p>
                </div>
                <Navigation className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Route Timeline */}
        <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Daily Route Timeline - {format(new Date(selectedDate), "MMMM d, yyyy")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading route data...</p>
            ) : sortedVisits.length > 0 ? (
              <div className="space-y-4">
                {sortedVisits.map((visit, index) => (
                  <div key={visit.id} className="flex items-start gap-4">
                    {/* Timeline indicator */}
                    <div className="flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full ${
                        visit.status === 'completed' ? 'bg-green-500' : 
                        visit.status === 'planned' ? 'bg-blue-500' : 'bg-red-500'
                      }`}></div>
                      {index < sortedVisits.length - 1 && (
                        <div className="w-0.5 h-16 bg-slate-300"></div>
                      )}
                    </div>

                    {/* Visit details */}
                    <div className="flex-1 pb-4">
                      <div className="bg-slate-50 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-slate-900">
                              {getClientName(visit.client_id)}
                            </h3>
                            <p className="text-sm text-slate-600">{visit.location}</p>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="outline" className={getStatusColor(visit.status)}>
                              {visit.status}
                            </Badge>
                            <Badge variant="outline" className={getTypeColor(getClientType(visit.client_id))}>
                              {getClientType(visit.client_id)}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-slate-700">Time:</span>
                            <span className="ml-2 text-slate-600">{visit.visit_time || 'Not set'}</span>
                          </div>
                          <div>
                            <span className="font-medium text-slate-700">Purpose:</span>
                            <span className="ml-2 text-slate-600">{visit.visit_purpose?.replace('_', ' ') || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="font-medium text-slate-700">Duration:</span>
                            <span className="ml-2 text-slate-600">{visit.visit_duration || 0} min</span>
                          </div>
                          <div>
                            <span className="font-medium text-slate-700">GPS:</span>
                            <span className="ml-2 text-slate-600">
                              {visit.latitude && visit.longitude ? '✓ Tagged' : '✗ Missing'}
                            </span>
                          </div>
                        </div>

                        {visit.notes && (
                          <div className="mt-3 p-3 bg-white rounded border">
                            <p className="text-sm text-slate-700">{visit.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <Route className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <p className="text-lg font-medium">No visits found for selected date</p>
                <p className="text-sm">Try selecting a different date or MDO</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


import React, { useState, useEffect } from "react";
import { GeofenceAlert } from "@/api/entities";
import { User } from "@/api/entities";
import { LocationAlert } from "@/api/entities"; // Added import for LocationAlert
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertTriangle, 
  Shield, 
  Clock,
  CheckCircle, 
  XCircle,
  Eye,
  Star,
  MapPin
} from "lucide-react";
import { format } from "date-fns";

export default function AlertsExceptions() {
  const [user, setUser] = useState(null);
  const [geofenceAlerts, setGeofenceAlerts] = useState([]);
  const [locationAlerts, setLocationAlerts] = useState([]); // Added state for location alerts
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      
      // Load all types of alerts
      const geofenceData = await GeofenceAlert.list("-created_date");
      setGeofenceAlerts(geofenceData || []);
      
      // Load location alerts
      const locationData = await LocationAlert.list("-created_date");
      setLocationAlerts(locationData || []);
      
      // Future: Add other alert types here
      // const performanceAlerts = await PerformanceAlert.list();
      // const complianceAlerts = await ComplianceAlert.list();
      
    } catch (error) {
      console.error("Error loading alerts:", error);
    }
    setLoading(false);
  };

  const handleGeofenceAction = async (alertId, status, remarks) => {
    try {
      await GeofenceAlert.update(alertId, {
        status,
        manager_remarks: remarks,
        reviewed_date: new Date().toISOString()
      });
      loadAlerts();
    } catch (error) {
      console.error("Error updating geofence alert:", error);
    }
  };

  const handleLocationAlertAction = async (alertId, status, remarks) => {
    try {
      await LocationAlert.update(alertId, {
        status,
        manager_remarks: remarks,
        resolved_date: status === 'resolved' ? new Date().toISOString() : null
      });
      loadAlerts();
    } catch (error) {
      console.error("Error updating location alert:", error);
    }
  };

  const getAlertPriority = (alert) => {
    // Determine priority based on alert type and content
    if (alert.distance_from_territory_km > 50) return "high";
    if (alert.distance_from_territory_km > 20) return "medium";
    return "low";
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending_review':
      case 'active': // New status for location alerts
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved_exception':
      case 'resolved': // New status for location alerts
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'acknowledged': // New status for location alerts
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Filter alerts by user's management scope
  const myGeofenceAlerts = geofenceAlerts.filter(alert => 
    alert.manager_id === user?.email || user?.designation === 'admin'
  );

  const myLocationAlerts = locationAlerts.filter(alert => 
    alert.manager_id === user?.email || user?.designation === 'admin'
  );

  const pendingGeofenceAlerts = myGeofenceAlerts.filter(alert => alert.status === 'pending_review');
  const pendingLocationAlerts = myLocationAlerts.filter(alert => alert.status === 'active');
  const totalUnreadAlerts = pendingGeofenceAlerts.length + pendingLocationAlerts.length;

  if (loading) {
    return <div className="p-8">Loading alerts...</div>;
  }

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header with notification indicator */}
        <div className="flex items-center gap-3 mb-8">
          <div className="relative">
            <AlertTriangle className="w-8 h-8 text-orange-600" />
            {totalUnreadAlerts > 0 && (
              <Star className="w-4 h-4 text-red-500 absolute -top-1 -right-1 fill-current" />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Alerts & Exceptions</h1>
            <p className="text-slate-600">
              Manage team escalations and compliance issues
              {totalUnreadAlerts > 0 && (
                <span className="ml-2 text-red-600 font-semibold">
                  ({totalUnreadAlerts} pending review)
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Alerts</p>
                  <p className="text-2xl font-bold text-blue-600">{myGeofenceAlerts.length + myLocationAlerts.length}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-orange-100 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Pending Review</p>
                  <p className="text-2xl font-bold text-orange-600">{totalUnreadAlerts}</p>
                </div>
                <Eye className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-green-100 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Approved / Resolved</p>
                  <p className="text-2xl font-bold text-green-600">
                    {myGeofenceAlerts.filter(a => a.status === 'approved_exception').length + myLocationAlerts.filter(a => a.status === 'resolved').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-red-100 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">
                    {myGeofenceAlerts.filter(a => a.status === 'rejected').length}
                  </p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="geofence" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80">
            <TabsTrigger value="geofence" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Territory Violations ({myGeofenceAlerts.length})
            </TabsTrigger>
            <TabsTrigger value="location" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Location Issues ({myLocationAlerts.length})
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Performance Issues (0)
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Other Compliance (0)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="geofence" className="space-y-4">
            <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  Territory Violation Alerts
                  {pendingGeofenceAlerts.length > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {pendingGeofenceAlerts.length} Need Action
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {myGeofenceAlerts.length > 0 ? (
                  <div className="space-y-4">
                    {myGeofenceAlerts.map(alert => {
                      const priority = getAlertPriority(alert);
                      return (
                        <div key={alert.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-slate-900">{alert.mdo_id}</h3>
                                <Badge variant="outline" className={getPriorityColor(priority)}>
                                  {priority} priority
                                </Badge>
                                <Badge variant="outline" className={getStatusColor(alert.status)}>
                                  {alert.status.replace('_', ' ')}
                                </Badge>
                              </div>
                              <div className="space-y-1 text-sm text-slate-600">
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4" />
                                  <span><strong>Territory:</strong> {alert.territory_name}</span>
                                </div>
                                <div><strong>Location:</strong> {alert.captured_location}</div>
                                <div><strong>Distance from territory:</strong> {alert.distance_from_territory_km?.toFixed(1)} km outside boundary</div>
                                <div><strong>Time:</strong> {format(new Date(alert.created_date), "MMM d, yyyy 'at' h:mm a")}</div>
                              </div>
                            </div>
                          </div>
                          
                          {alert.manager_remarks && (
                            <div className="mb-3 p-3 bg-slate-50 rounded border-l-4 border-blue-500">
                              <p className="text-sm font-medium text-slate-700">Manager Review:</p>
                              <p className="text-sm text-slate-600">{alert.manager_remarks}</p>
                            </div>
                          )}

                          {alert.status === 'pending_review' && (
                            <div className="flex gap-2 pt-3 border-t">
                              <Button
                                size="sm"
                                onClick={() => handleGeofenceAction(
                                  alert.id, 
                                  'approved_exception', 
                                  'Approved as valid business exception - legitimate business need outside territory'
                                )}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve Exception
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleGeofenceAction(
                                  alert.id, 
                                  'rejected', 
                                  'Territory violation - employee must follow assigned territory boundaries'
                                )}
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject & Flag
                              </Button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Shield className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-600 mb-2">No Territory Violations</h3>
                    <p className="text-slate-500">All team members are operating within their assigned territories</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="location" className="space-y-4">
            <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Location Services Alerts
                  {pendingLocationAlerts.length > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {pendingLocationAlerts.length} Need Action
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {myLocationAlerts.length > 0 ? (
                  <div className="space-y-4">
                    {myLocationAlerts.map(alert => (
                      <div key={alert.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-slate-900">{alert.mdo_id}</h3>
                              <Badge variant="outline" className={getStatusColor(alert.status)}>
                                {alert.alert_type.replace('_', ' ')}
                              </Badge>
                            </div>
                            <div className="space-y-1 text-sm text-slate-600">
                              <div><strong>Issue:</strong> {alert.alert_type === 'location_denied' ? 'Location permission denied by user' : 
                                                          alert.alert_type === 'gps_disabled' ? 'GPS disabled or unavailable' :
                                                          alert.alert_type === 'location_unavailable' ? 'Location services unavailable' :
                                                          'Extended offline period'}</div>
                              <div><strong>Device:</strong> {alert.device_info?.split('|')[1] || 'Unknown'}</div>
                              <div><strong>Time:</strong> {format(new Date(alert.created_date), "MMM d, yyyy 'at' h:mm a")}</div>
                              {alert.duration_offline > 0 && <div><strong>Offline Duration:</strong> {alert.duration_offline} hours</div>}
                            </div>
                          </div>
                        </div>
                        
                        {alert.manager_remarks && (
                          <div className="mb-3 p-3 bg-slate-50 rounded border-l-4 border-blue-500">
                            <p className="text-sm font-medium text-slate-700">Manager Review:</p>
                            <p className="text-sm text-slate-600">{alert.manager_remarks}</p>
                          </div>
                        )}

                        {alert.status === 'active' && (
                          <div className="flex gap-2 pt-3 border-t">
                            <Button
                              size="sm"
                              onClick={() => handleLocationAlertAction(
                                alert.id, 
                                'acknowledged', 
                                'Acknowledged - MDO instructed to enable location services'
                              )}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Acknowledge
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleLocationAlertAction(
                                alert.id, 
                                'resolved', 
                                'Issue resolved - location services restored'
                              )}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Mark Resolved
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-600 mb-2">No Location Issues</h3>
                    <p className="text-slate-500">All team members have location services enabled</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-lg">
              <CardContent className="text-center py-12">
                <Clock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-600 mb-2">Performance Alerts</h3>
                <p className="text-slate-500">Performance monitoring alerts will appear here</p>
                <p className="text-sm text-slate-400 mt-2">(Coming soon)</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-4">
            <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-lg">
              <CardContent className="text-center py-12">
                <AlertTriangle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-600 mb-2">Other Compliance Issues</h3>
                <p className="text-slate-500">Additional compliance alerts will appear here</p>
                <p className="text-sm text-slate-400 mt-2">(Coming soon)</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

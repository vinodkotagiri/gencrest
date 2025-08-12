
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, ShoppingCart, Clock, Target } from "lucide-react";
import { format } from "date-fns";

export default function RecentActivities({ visits = [], orders = [], clients = [] }) {
  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client?.client_name || 'Unknown Client';
  };

  // Safely combine real and sample data with null checks
  const realActivities = [
    ...(visits || []).slice(0, 4).map(visit => ({
      id: visit.id,
      type: 'visit',
      title: `Visit to ${getClientName(visit.client_id)}`,
      subtitle: visit.location || 'Location not specified',
      time: (visit.visit_date || '') + ' ' + (visit.visit_time || ''),
      status: visit.status || 'planned',
      icon: MapPin,
      color: 'blue',
      taskType: getTaskTypeFromPurpose(visit.visit_purpose)
    })),
    ...(orders || []).slice(0, 3).map(order => ({
      id: order.id,
      type: 'order',
      title: `Order from ${getClientName(order.client_id)}`,
      subtitle: `₹${(order.total_amount || 0).toLocaleString()}`,
      time: order.order_date || new Date().toISOString(),
      status: order.status || 'draft',
      icon: ShoppingCart,
      color: 'green',
      taskType: 'Sales Order'
    }))
  ];

  // Use the combined data, sorted by time
  const activities = realActivities.sort((a, b) => {
    const timeA = a.time ? new Date(a.time) : new Date(0);
    const timeB = b.time ? new Date(b.time) : new Date(0);
    return timeB - timeA;
  }).slice(0, 6);

  function getTaskTypeFromPurpose(purpose) {
    if (!purpose) return 'Field Visit';
    
    switch (purpose) {
      case 'sales_call':
      case 'product_demo':
        return 'Retailer Visit';
      case 'farmer_meeting':
        return 'Farmer Meeting';
      case 'follow_up':
        return 'Distributor Visit';
      case 'market_survey':
        return 'Market Survey';
      case 'collection':
        return 'Collection Visit';
      default:
        return 'Field Visit';
    }
  }

  const getStatusColor = (status, type) => {
    if (!status) return 'bg-gray-100 text-gray-800 border-gray-200';
    
    if (type === 'visit') {
      switch (status) {
        case 'completed': return 'bg-green-100 text-green-800 border-green-200';
        case 'planned': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    } else {
      switch (status) {
        case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
        case 'shipped': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'approved': return 'bg-purple-100 text-purple-800 border-purple-200';
        case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    }
  };

  const getTaskTypeColor = (taskType) => {
    if (!taskType) return 'bg-slate-100 text-slate-800 border-slate-200';
    
    switch (taskType) {
      case 'Farmer Meeting': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Distributor Visit': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Retailer Visit': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Sales Order': return 'bg-green-100 text-green-800 border-green-200';
      case 'Market Survey': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <Clock className="w-5 h-5 text-blue-600" />
          Recent Activities
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.length > 0 ? activities.map((activity) => (
          <div key={`${activity.type}-${activity.id}`} className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
            <div className={`p-2 rounded-lg bg-${activity.color}-100`}>
              <activity.icon className={`w-4 h-4 text-${activity.color}-600`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <p className="font-medium text-slate-900">{activity.title}</p>
                  <p className="text-sm text-slate-600">{activity.subtitle}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getStatusColor(activity.status, activity.type)}`}
                  >
                    {(activity.status || '').replace('_', ' ')}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getTaskTypeColor(activity.taskType)}`}
                >
                  {activity.taskType}
                </Badge>
                <p className="text-xs text-slate-500">
                  {activity.time ? format(new Date(activity.time), "MMM d, h:mm a") : 'No date'}
                </p>
              </div>
            </div>
          </div>
        )) : (
          <p className="text-slate-500 text-center py-8">No recent activities</p>
        )}
      </CardContent>
    </Card>
  );
}

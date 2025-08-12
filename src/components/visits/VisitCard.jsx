
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Clock,
  Users, // Changed from User
  Edit,
  CheckCircle,
  XCircle,
  Calendar,
  Briefcase, // Changed from Target
  FileText,
  Eye,
  AlertTriangle,
  ChevronRight,
  PlayCircle
} from "lucide-react";
import { format } from "date-fns"; // Fixed parsing error here, removed " = "
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function VisitCard({ visit, client, onEdit, onStatusUpdate, canEdit, onViewReport, relatedTasks = [], onExecute }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'planned':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getClientTypeColor = (type) => {
    switch (type) {
      case 'distributor':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'retailer':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'farmer':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPurposeIcon = (category) => {
    switch (category) {
      case 'Farmer BTL Engagement': return <Users className="w-4 h-4 text-green-500" />;
      case 'Channel BTL Engagement': return <Briefcase className="w-4 h-4 text-purple-500" />;
      case 'Internal Meetings': return <Users className="w-4 h-4 text-blue-500" />;
      default: return <Briefcase className="w-4 h-4 text-gray-500" />;
    }
  };
  
  // The clientName variable is no longer used directly in the h3 tag as per the outline.
  // The clientType variable is still used.
  const clientType = client?.client_type;

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">{client?.client_name || visit.visit_purpose}</h3>
                <div className="flex items-center gap-2 mb-2">
                  {getPurposeIcon(visit.activity_category)}
                  <span className="text-sm font-medium text-slate-600 capitalize">
                    {visit.visit_purpose || 'Activity'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {clientType && (
                  <Badge variant="outline" className={getClientTypeColor(clientType)}>
                    {clientType}
                  </Badge>
                )}
                <Badge variant="outline" className={getStatusColor(visit.status)}>
                  {visit.status}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span className="text-sm">{visit.location}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className="text-sm">
                  {format(new Date(visit.visit_date), "MMM d, yyyy")}
                  {visit.visit_time && ` at ${visit.visit_time}`}
                </span>
              </div>

              {visit.visit_duration > 0 && (
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">{visit.visit_duration} minutes</span>
                </div>
              )}

              {visit.status === 'completed' && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Visit Completed</span>
                </div>
              )}
            </div>

            {visit.notes && (
              <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{visit.notes}</p>
              </div>
            )}

            {/* RELATED TASKS SECTION */}
            {relatedTasks.length > 0 && (
              <Card className="mt-4 bg-yellow-50 border-yellow-200">
                <CardHeader className="p-4">
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold text-yellow-800">
                    <AlertTriangle className="w-5 h-5" />
                    Pending Tasks for this Client ({relatedTasks.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-2">
                  <ul className="list-disc list-inside space-y-1">
                    {relatedTasks.map(task => (
                      <li key={task.id} className="text-sm text-yellow-900">
                        {task.title}
                      </li>
                    ))}
                  </ul>
                  <Link to={createPageUrl("Tasks")}>
                    <Button variant="link" className="h-auto p-0 text-yellow-800">
                      Go to Tasks <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-slate-200">
          <div className="text-sm text-slate-500">
            Created {format(new Date(visit.created_date), "MMM d, yyyy")}
          </div>

          <div className="flex gap-2 flex-wrap justify-end">
            {visit.status === 'completed' && onViewReport && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onViewReport(visit)}
                className="text-purple-600 border-purple-200 hover:bg-purple-50"
              >
                <FileText className="w-4 h-4 mr-1" />
                Report
              </Button>
            )}

            {canEdit && visit.status === 'planned' && (
              <Button
                size="sm"
                onClick={() => onExecute(visit)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <PlayCircle className="w-4 h-4 mr-1" />
                Execute Visit
              </Button>
            )}
            
            {/* The following buttons are replaced by "Execute Visit" button for 'planned' status */}
            {/* 
            {canEdit && visit.status === 'planned' && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onStatusUpdate(visit.id, 'completed')}
                  className="text-green-600 border-green-200 hover:bg-green-50"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Complete
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onStatusUpdate(visit.id, 'cancelled')}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
              </>
            )}
            */}

            {canEdit && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(visit)}
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

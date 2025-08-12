import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Users } from "lucide-react";

export default function TaskFilters({ filters, onFilterChange, teamMembers, userRole }) {
  const handleFilterUpdate = (key, value) => {
    onFilterChange(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-slate-500" />
        <Select
          value={filters.status}
          onValueChange={(value) => handleFilterUpdate("status", value)}
        >
          <SelectTrigger className="w-32 bg-white/80 border-blue-100">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Select
        value={filters.task_type}
        onValueChange={(value) => handleFilterUpdate("task_type", value)}
      >
        <SelectTrigger className="w-40 bg-white/80 border-blue-100">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="farmer_meeting">Farmer Meeting</SelectItem>
          <SelectItem value="distributor_visit">Distributor Visit</SelectItem>
          <SelectItem value="retailer_visit">Retailer Visit</SelectItem>
          <SelectItem value="local_activity">Local Activity</SelectItem>
          <SelectItem value="sales_target">Sales Target</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.priority}
        onValueChange={(value) => handleFilterUpdate("priority", value)}
      >
        <SelectTrigger className="w-32 bg-white/80 border-blue-100">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priority</SelectItem>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
        </SelectContent>
      </Select>

      {userRole !== 'MDO' && teamMembers && teamMembers.length > 0 && (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-slate-500" />
          <Select
            value={filters.mdo_id}
            onValueChange={(value) => handleFilterUpdate("mdo_id", value)}
          >
            <SelectTrigger className="w-48 bg-white/80 border-blue-100">
              <SelectValue placeholder="Filter by MDO" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Team Members</SelectItem>
              {teamMembers.map(mdo => (
                <SelectItem key={mdo.id} value={mdo.email}>
                  {mdo.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
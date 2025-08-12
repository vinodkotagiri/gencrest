import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Users } from "lucide-react";

export default function VisitFilters({ filters, onFilterChange, teamMembers, userRole }) {
  const handleFilterUpdate = (key, value) => {
    onFilterChange(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="flex items-center gap-4 flex-wrap">
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
            <SelectItem value="planned">Planned</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Select
        value={filters.date_range}
        onValueChange={(value) => handleFilterUpdate("date_range", value)}
      >
        <SelectTrigger className="w-32 bg-white/80 border-blue-100">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Time</SelectItem>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="week">This Week</SelectItem>
          <SelectItem value="month">This Month</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.client_type}
        onValueChange={(value) => handleFilterUpdate("client_type", value)}
      >
        <SelectTrigger className="w-32 bg-white/80 border-blue-100">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="distributor">Distributor</SelectItem>
          <SelectItem value="retailer">Retailer</SelectItem>
          <SelectItem value="prospect">Prospect</SelectItem>
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
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';

export default function ReportFilters({ filters, onFilterChange, teamMembers }) {
  const handleFilterUpdate = (key, value) => {
    onFilterChange(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <Filter className="w-5 h-5 text-blue-600" />
          Report Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="text-sm font-medium text-slate-700 mb-1 block">Date Range</label>
          <Select
            value={filters.dateRange}
            onValueChange={(v) => handleFilterUpdate('dateRange', v)}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="last_7_days">Last 7 Days</SelectItem>
              <SelectItem value="last_30_days">Last 30 Days</SelectItem>
              <SelectItem value="last_90_days">Last 90 Days</SelectItem>
              <SelectItem value="all_time">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <label className="text-sm font-medium text-slate-700 mb-1 block">Team Member (MDO)</label>
          <Select
            value={filters.mdo_id}
            onValueChange={(v) => handleFilterUpdate('mdo_id', v)}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
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
      </CardContent>
    </Card>
  );
}
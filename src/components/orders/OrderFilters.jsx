import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from 'lucide-react';

export default function OrderFilters({ filters, onFilterChange }) {
  return (
    <div className="flex gap-4">
      <Select value={filters.status} onValueChange={v => onFilterChange({ ...filters, status: v })}>
        <SelectTrigger className="w-[180px] bg-white/80 border-blue-100">
          <Filter className="w-4 h-4 mr-2 text-slate-500" />
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="submitted">Submitted</SelectItem>
          <SelectItem value="approved">Approved</SelectItem>
          <SelectItem value="shipped">Shipped</SelectItem>
          <SelectItem value="delivered">Delivered</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filters.date_range} onValueChange={v => onFilterChange({ ...filters, date_range: v })}>
        <SelectTrigger className="w-[180px] bg-white/80 border-blue-100">
           <Filter className="w-4 h-4 mr-2 text-slate-500" />
          <SelectValue placeholder="Filter by date" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Time</SelectItem>
          <SelectItem value="week">Last 7 days</SelectItem>
          <SelectItem value="month">Last 30 days</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
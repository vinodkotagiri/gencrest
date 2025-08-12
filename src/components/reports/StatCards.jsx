import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, MapPin, Target, Users, FileCheck } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-opacity-20 ${color}`}>
          <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function StatCards({ visits, tasks, teamMembers }) {
  const totalVisits = visits.length;
  const completedVisits = visits.filter(v => v.status === 'completed').length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const proofedVisits = visits.filter(v => v.photos && v.photos.length > 0).length;

  const stats = [
    { title: 'Total Visits', value: totalVisits, icon: MapPin, color: 'bg-blue-500' },
    { title: 'Completed Tasks', value: `${completedTasks} / ${totalTasks}`, icon: CheckCircle, color: 'bg-green-500' },
    { title: 'Team Members', value: teamMembers.length, icon: Users, color: 'bg-purple-500' },
    { title: 'Visits with Proof', value: proofedVisits, icon: FileCheck, color: 'bg-orange-500' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map(stat => <StatCard key={stat.title} {...stat} />)}
    </div>
  );
}
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Users } from 'lucide-react';

export default function TeamPerformanceTable({ visits, tasks, teamMembers }) {
  const performanceData = teamMembers.map(mdo => {
    const mdoVisits = visits.filter(v => v.mdo_id === mdo.email);
    const plannedVisits = mdoVisits.length;
    const completedVisits = mdoVisits.filter(v => v.status === 'completed').length;
    const visitCompletionRate = plannedVisits > 0 ? (completedVisits / plannedVisits) * 100 : 0;

    const mdoTasks = tasks.filter(t => t.assigned_to_mdo_id === mdo.email);
    const assignedTasks = mdoTasks.length;
    const completedTasks = mdoTasks.filter(t => t.status === 'completed').length;
    const taskCompletionRate = assignedTasks > 0 ? (completedTasks / assignedTasks) * 100 : 0;

    return {
      id: mdo.id,
      name: mdo.full_name,
      territory: mdo.territory,
      plannedVisits,
      completedVisits,
      visitCompletionRate,
      assignedTasks,
      completedTasks,
      taskCompletionRate,
    };
  });

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <Users className="w-5 h-5 text-blue-600" />
          Team Performance Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Team Member</TableHead>
              <TableHead>Territory</TableHead>
              <TableHead>Visits (Completed/Planned)</TableHead>
              <TableHead>Visit Completion</TableHead>
              <TableHead>Tasks (Completed/Assigned)</TableHead>
              <TableHead>Task Completion</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {performanceData.map(mdo => (
              <TableRow key={mdo.id}>
                <TableCell className="font-medium">{mdo.name}</TableCell>
                <TableCell>{mdo.territory}</TableCell>
                <TableCell>{`${mdo.completedVisits} / ${mdo.plannedVisits}`}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={mdo.visitCompletionRate} className="w-24 h-2" />
                    <span>{mdo.visitCompletionRate.toFixed(0)}%</span>
                  </div>
                </TableCell>
                <TableCell>{`${mdo.completedTasks} / ${mdo.assignedTasks}`}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={mdo.taskCompletionRate} className="w-24 h-2" />
                    <span>{mdo.taskCompletionRate.toFixed(0)}%</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
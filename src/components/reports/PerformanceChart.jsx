import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

export default function PerformanceChart({ visits, teamMembers }) {
  const data = teamMembers.map(mdo => {
    const mdoVisits = visits.filter(v => v.mdo_id === mdo.email);
    const planned = mdoVisits.filter(v => ['planned', 'completed'].includes(v.status)).length;
    const actual = mdoVisits.filter(v => v.status === 'completed').length;
    return {
      name: mdo.full_name.split(' ')[0], // Short name
      'Planned Visits': planned,
      'Actual Visits': actual,
    };
  });

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Planned vs. Actual Visits
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Planned Visits" fill="#8884d8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Actual Visits" fill="#82ca9d" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
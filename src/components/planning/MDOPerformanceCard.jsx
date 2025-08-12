import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Target, CheckCircle } from "lucide-react";

export default function MDOPerformanceCard({ tasks, plans }) {
  // Group tasks by MDO
  const mdoPerformance = tasks.reduce((acc, task) => {
    const mdoId = task.assigned_to_mdo_id;
    if (!acc[mdoId]) {
      acc[mdoId] = {
        total: 0,
        completed: 0,
        pending: 0,
        inProgress: 0
      };
    }
    
    acc[mdoId].total++;
    if (task.status === 'completed') acc[mdoId].completed++;
    else if (task.status === 'pending') acc[mdoId].pending++;
    else if (task.status === 'in_progress') acc[mdoId].inProgress++;
    
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Team Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(mdoPerformance).map(([mdoId, performance]) => (
              <Card key={mdoId} className="border border-slate-200">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-slate-900">
                        {mdoId?.split('@')[0] || 'Unknown MDO'}
                      </h4>
                      <p className="text-sm text-slate-600">{mdoId}</p>
                    </div>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800">
                      {performance.total} tasks
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        Completed
                      </span>
                      <span className="font-medium">{performance.completed}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-blue-500" />
                        In Progress
                      </span>
                      <span className="font-medium">{performance.inProgress}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Target className="w-3 h-3 text-yellow-500" />
                        Pending
                      </span>
                      <span className="font-medium">{performance.pending}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <div className="flex items-center justify-between text-sm">
                      <span>Completion Rate</span>
                      <span className="font-semibold text-green-600">
                        {performance.total > 0 ? Math.round((performance.completed / performance.total) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
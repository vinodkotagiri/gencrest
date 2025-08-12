import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { TrendingUp } from "lucide-react";

export default function PerformanceChart({ visits, orders }) {
  // Generate last 7 days data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const chartData = last7Days.map(date => {
    const dayVisits = visits.filter(v => v.visit_date === date).length;
    const dayOrders = orders.filter(o => o.order_date === date).length;
    const dayRevenue = orders
      .filter(o => o.order_date === date)
      .reduce((sum, o) => sum + (o.total_amount || 0), 0);

    return {
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      visits: dayVisits,
      orders: dayOrders,
      revenue: dayRevenue / 1000 // Convert to thousands
    };
  });

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Weekly Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="date" 
                stroke="#64748b"
                fontSize={12}
              />
              <YAxis 
                stroke="#64748b"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Bar 
                dataKey="visits" 
                fill="#3b82f6" 
                name="Visits"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="orders" 
                fill="#10b981" 
                name="Orders"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
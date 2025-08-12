import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MapPin, 
  ShoppingCart, 
  TrendingUp, 
  Target,
  Calendar,
  IndianRupee
} from "lucide-react";

const StatCard = ({ title, value, icon: Icon, color, trend, subtitle }) => (
  <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
    <div className={`absolute top-0 right-0 w-24 h-24 transform translate-x-6 -translate-y-6 ${color} rounded-full opacity-10`} />
    <CardContent className="p-6 relative">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        {trend && (
          <div className="flex items-center text-sm text-green-600">
            <TrendingUp className="w-3 h-3 mr-1" />
            {trend}
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900 mb-1">{value}</p>
        <p className="text-sm font-semibold text-slate-600">{title}</p>
        {subtitle && (
          <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
        )}
      </div>
    </CardContent>
  </Card>
);

export default function StatsGrid({ stats, userRole }) {
  const getStatsForRole = () => {
    const baseStats = [
      {
        title: "Today's Visits",
        value: stats.todayVisits,
        icon: MapPin,
        color: "bg-blue-600",
        subtitle: "Field visits completed"
      },
      {
        title: "Weekly Visits",
        value: stats.weeklyVisits,
        icon: Calendar,
        color: "bg-purple-600",
        trend: "+12%",
        subtitle: "This week"
      },
      {
        title: "Monthly Orders",
        value: stats.monthlyOrders,
        icon: ShoppingCart,
        color: "bg-green-600",
        trend: "+8%",
        subtitle: "Orders processed"
      },
      {
        title: "Revenue",
        value: `₹${(stats.totalRevenue / 100000).toFixed(1)}L`,
        icon: IndianRupee,
        color: "bg-orange-600",
        subtitle: "Total delivered"
      }
    ];

    if (userRole === "MDO") {
      return baseStats.slice(0, 3);
    }
    
    return baseStats;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {getStatsForRole().map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
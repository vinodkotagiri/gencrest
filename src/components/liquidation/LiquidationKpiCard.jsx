import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

export default function LiquidationKpiCard({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  highlight = false, 
  onClick, 
  isActive = false 
}) {
  const colors = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
    green: { bg: 'bg-green-100', text: 'text-green-600' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-600' },
    gray: { bg: 'bg-slate-100', text: 'text-slate-600' },
  };

  const selectedColor = colors[color] || colors.gray;

  return (
    <Card 
      className={`
        ${highlight ? 'bg-green-600 text-white shadow-xl' : 'bg-white/90 backdrop-blur-sm border-blue-100 shadow-lg'} 
        ${onClick ? 'cursor-pointer hover:scale-105' : ''} 
        ${isActive ? 'ring-2 ring-blue-500' : ''}
        transition-all duration-300
      `}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {!highlight && (
            <div className={`p-3 rounded-lg ${selectedColor.bg}`}>
              <Icon className={`w-6 h-6 ${selectedColor.text}`} />
            </div>
          )}
           {highlight && (
            <div className="p-3 rounded-lg bg-white/20">
              <Icon className="w-6 h-6 text-white" />
            </div>
          )}
          <div>
            <p className={`text-sm font-medium ${highlight ? 'text-green-100' : 'text-slate-500'}`}>{title}</p>
            <p className={`text-2xl font-bold ${highlight ? 'text-white' : 'text-slate-900'}`}>{value}</p>
            {onClick && (
              <p className={`text-xs ${highlight ? 'text-green-100' : 'text-slate-400'}`}>Click for details</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
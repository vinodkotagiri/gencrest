import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Banknote } from 'lucide-react';

export default function ProfitabilityReport() {
  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen flex items-center justify-center">
      <Card className="bg-white/90 backdrop-blur-sm shadow-lg w-full max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Banknote className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl text-slate-800">Profitability Report Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600">
            This report will provide a detailed breakdown of TSM-wise profitability, analyzing sales, cost of goods sold, and apportioned overheads.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
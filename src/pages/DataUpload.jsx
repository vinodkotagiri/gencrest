import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud } from 'lucide-react';

export default function DataUpload() {
  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen flex items-center justify-center">
      <Card className="bg-white/90 backdrop-blur-sm shadow-lg w-full max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <UploadCloud className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl text-slate-800">Dealer-Wise Data Upload Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600">
            This feature will allow finance teams to upload dealer sales data via Excel for automatic processing and mapping to team dashboards.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
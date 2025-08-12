
import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge'; // Added Badge import
import { ArrowRight, BarChart2, Star, UploadCloud, Banknote } from 'lucide-react';

const ReportCard = ({ title, description, url, icon: Icon, tag }) => (
  <Card className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col">
    <CardHeader className="flex flex-row items-start justify-between">
      <div>
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <CardTitle className="text-xl text-slate-800">{title}</CardTitle>
      </div>
      {tag && <Badge variant="secondary">{tag}</Badge>}
    </CardHeader>
    <CardContent className="flex-grow">
      <p className="text-slate-600">{description}</p>
    </CardContent>
    <div className="p-6 pt-0 mt-auto">
      <Link to={url}>
        <Button className="w-full bg-blue-600 hover:bg-blue-700">
          View Report <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </Link>
    </div>
  </Card>
);

export default function FinanceDashboard() {
  const reports = [
    {
      title: "Credibility Index Score",
      description: "A data-driven scoring model for TSMs & MDOs based on performance, collections, and target alignment.",
      url: createPageUrl("CredibilityIndex"),
      icon: Star,
      tag: "Active",
    },
    {
      title: "TSM-wise Profitability",
      description: "Analyze SKU and region-wise sales against COGS and overheads to track true profitability per TSM.",
      url: createPageUrl("ProfitabilityReport"),
      icon: Banknote,
      tag: "Coming Soon",
    },
    {
      title: "Dealer-Wise Data Upload",
      description: "Upload monthly dealer-wise sales data via Excel for auto-mapping to TSMs/MDOs and dashboards.",
      url: createPageUrl("DataUpload"),
      icon: UploadCloud,
      tag: "Coming Soon",
    },
  ];

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
            <BarChart2 className="w-10 h-10 text-blue-600" />
            Finance Analytics Dashboard
          </h1>
          <p className="text-lg text-slate-600">Advanced reports for profitability, performance scoring, and data management.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reports.map((report) => (
            <ReportCard key={report.title} {...report} />
          ))}
        </div>
      </div>
    </div>
  );
}

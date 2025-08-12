
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Calendar, Target, CheckCircle, Clock, XCircle, Send } from "lucide-react";

const getStatusStyles = (status) => {
    switch (status) {
        case 'approved':
            return { icon: CheckCircle, color: 'bg-green-100 text-green-800', textColor: 'text-green-600' };
        case 'submitted_for_approval':
            return { icon: Clock, color: 'bg-yellow-100 text-yellow-800', textColor: 'text-yellow-600' };
        case 'rejected':
            return { icon: XCircle, color: 'bg-red-100 text-red-800', textColor: 'text-red-600' };
        case 'draft':
        default:
            return { icon: Edit, color: 'bg-slate-100 text-slate-800', textColor: 'text-slate-600' };
    }
};

export default function PlansList({ plans, teamMembers = [], onEdit, onDelete, onSubmitForApproval }) {
  if (!plans || plans.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
        <CardContent className="text-center py-12">
          <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 mb-2">No monthly plans found</h3>
          <p className="text-slate-500">Create your first monthly plan to get started.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {plans.map(plan => {
        const mdo = teamMembers.find(m => m.email === plan.mdo_id);
        const statusInfo = getStatusStyles(plan.status);
        const StatusIcon = statusInfo.icon;

        return (
          <Card key={plan.id} className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-lg overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between bg-slate-50 border-b p-4">
              <CardTitle className="text-lg text-slate-800">
                Plan for <span className="text-blue-600">{mdo?.full_name || 'N/A'}</span> - {plan.month_year}
              </CardTitle>
              <div className="flex items-center gap-3">
                <Badge className={statusInfo.color}>
                    <StatusIcon className="w-4 h-4 mr-1.5" />
                    {plan.status.replace(/_/g, ' ')}
                </Badge>
                {plan.status === 'draft' && (
                  <>
                    <Button variant="ghost" size="icon" onClick={() => onEdit(plan)}><Edit className="w-4 h-4 text-slate-500" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(plan.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3 p-4 bg-blue-50/50 rounded-lg">
                <h4 className="font-semibold text-blue-800 flex items-center gap-2"><Calendar className="w-5 h-5"/>Visit Targets</h4>
                <div className="text-sm space-y-1 text-slate-700">
                    <p><strong>Total:</strong> {plan.visit_targets?.total_visits || 0}</p>
                    <p><strong>Distributors:</strong> {plan.visit_targets?.distributor_visits || 0}</p>
                    <p><strong>Retailers:</strong> {plan.visit_targets?.retailer_visits || 0}</p>
                    <p><strong>Farmer Mtgs:</strong> {plan.visit_targets?.farmer_meetings || 0}</p>
                </div>
              </div>
              <div className="space-y-3 p-4 bg-green-50/50 rounded-lg">
                <h4 className="font-semibold text-green-800 flex items-center gap-2"><Target className="w-5 h-5"/>Sales Targets</h4>
                 <div className="text-sm space-y-1 text-slate-700">
                    <p><strong>Total Sales:</strong> ₹{plan.sales_targets?.total_sales?.toLocaleString() || 0}</p>
                    <p><strong>New Clients:</strong> {plan.sales_targets?.new_client_acquisition || 0}</p>
                    <p><strong>Product Focus:</strong> {plan.sales_targets?.product_focus?.join(', ') || 'N/A'}</p>
                </div>
              </div>
              <div className="space-y-3 p-4 bg-purple-50/50 rounded-lg">
                <h4 className="font-semibold text-purple-800 flex items-center gap-2"><CheckCircle className="w-5 h-5"/>Special Activities</h4>
                <p className="text-sm text-slate-700">{plan.special_activities || 'No special activities planned.'}</p>
              </div>
            </CardContent>
            {plan.status === 'draft' && (
                <div className="px-6 py-3 bg-slate-50 border-t text-right">
                    <Button onClick={() => onSubmitForApproval(plan.id)} className="bg-blue-600 hover:bg-blue-700">
                        <Send className="w-4 h-4 mr-2" />
                        Submit for Approval
                    </Button>
                </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}


import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, X, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuditTrailTab from "@/components/shared/AuditTrailTab";
import { History } from "lucide-react";


export default function MonthlyPlanForm({ plan, onSubmit, onCancel, userRole }) {
  const [formData, setFormData] = useState(plan || {
    month_year: new Date().toISOString().slice(0, 7),
    mdo_id: "",
    visit_targets: {
      total_visits: 50,
      distributor_visits: 15,
      retailer_visits: 25,
      farmer_meetings: 10
    },
    sales_targets: {
      total_sales: 500000,
      new_client_acquisition: 5,
      product_focus: ["Cotton Seeds", "Fertilizers"]
    },
    liquidation_targets: {
      target_liquidation_rate: 80,
      focus_distributors: []
    },
    special_activities: "",
    status: "draft"
  });

  const [mdoUsers, setMdoUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMDOUsers();
  }, []);

  const loadMDOUsers = async () => {
    try {
      const users = await User.filter({ designation: "MDO" });
      setMdoUsers(users);
    } catch (error) {
      console.error("Error loading MDO users:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const canEditStatus = userRole && ["RBH", "RMM", "ZBH", "admin"].includes(userRole);

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-xl mb-8">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <Calendar className="w-5 h-5 text-blue-600" />
          {plan ? "Edit Monthly Plan" : "Create Monthly Plan"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="details">
            <TabsList className="w-full justify-start rounded-none bg-slate-100 p-0">
                <TabsTrigger value="details" className="px-4 py-3">Plan Details</TabsTrigger>
                {plan?.id && <TabsTrigger value="audit" className="px-4 py-3 flex items-center gap-2"><History className="w-4 h-4"/> Audit Trail</TabsTrigger>}
            </TabsList>

            <TabsContent value="details" className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="month_year">Month & Year *</Label>
                            <Input
                                id="month_year"
                                type="month"
                                value={formData.month_year}
                                onChange={(e) => handleInputChange("month_year", e.target.value)}
                                required
                                className="bg-white border-slate-200"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="mdo_id">Assign to MDO *</Label>
                            <Select
                                value={formData.mdo_id}
                                onValueChange={(value) => handleInputChange("mdo_id", value)}
                            >
                                <SelectTrigger className="bg-white border-slate-200">
                                <SelectValue placeholder="Select MDO" />
                                </SelectTrigger>
                                <SelectContent>
                                {mdoUsers.map(mdo => (
                                    <SelectItem key={mdo.id} value={mdo.email}>
                                    {mdo.full_name} ({mdo.territory})
                                    </SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Visit Targets */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-900">Visit Targets</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <Label>Total Visits</Label>
                                <Input
                                type="number"
                                value={formData.visit_targets.total_visits}
                                onChange={(e) => handleNestedChange("visit_targets", "total_visits", parseInt(e.target.value))}
                                className="bg-white border-slate-200"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Distributor Visits</Label>
                                <Input
                                type="number"
                                value={formData.visit_targets.distributor_visits}
                                onChange={(e) => handleNestedChange("visit_targets", "distributor_visits", parseInt(e.target.value))}
                                className="bg-white border-slate-200"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Retailer Visits</Label>
                                <Input
                                type="number"
                                value={formData.visit_targets.retailer_visits}
                                onChange={(e) => handleNestedChange("visit_targets", "retailer_visits", parseInt(e.target.value))}
                                className="bg-white border-slate-200"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Farmer Meetings</Label>
                                <Input
                                type="number"
                                value={formData.visit_targets.farmer_meetings}
                                onChange={(e) => handleNestedChange("visit_targets", "farmer_meetings", parseInt(e.target.value))}
                                className="bg-white border-slate-200"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sales Targets */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-900">Sales Targets</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Total Sales (₹)</Label>
                                <Input
                                type="number"
                                value={formData.sales_targets.total_sales}
                                onChange={(e) => handleNestedChange("sales_targets", "total_sales", parseInt(e.target.value))}
                                className="bg-white border-slate-200"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>New Client Acquisition</Label>
                                <Input
                                type="number"
                                value={formData.sales_targets.new_client_acquisition}
                                onChange={(e) => handleNestedChange("sales_targets", "new_client_acquisition", parseInt(e.target.value))}
                                className="bg-white border-slate-200"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Special Activities */}
                    <div className="space-y-2">
                        <Label htmlFor="special_activities">Special Activities & Focus Areas</Label>
                        <Textarea
                            id="special_activities"
                            value={formData.special_activities}
                            onChange={(e) => handleInputChange("special_activities", e.target.value)}
                            placeholder="Describe special activities, campaigns, or focus areas for this month..."
                            className="h-24 bg-white border-slate-200"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            disabled={loading}
                        >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            ) : (
                                <Save className="w-4 h-4 mr-2" />
                            )}
                            {plan ? "Update" : "Create"} Plan
                        </Button>
                    </div>
                </form>
            </TabsContent>

            {plan?.id && (
                <TabsContent value="audit" className="p-0">
                    <AuditTrailTab entityName="MonthlyPlan" recordId={plan.id} />
                </TabsContent>
            )}
        </Tabs>
      </CardContent>
    </Card>
  );
}

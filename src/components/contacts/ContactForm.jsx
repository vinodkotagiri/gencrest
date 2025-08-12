import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuditTrailTab from "../shared/AuditTrailTab";
import { Save, X, UserPlus, History } from "lucide-react";

export default function ContactForm({ client, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(client || {
    client_name: "",
    client_type: "retailer",
    contact_person: "",
    phone: "",
    address: "",
    territory: "",
    credit_limit: 0,
    outstanding_balance: 0,
    status: "active",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (client) {
      setFormData(client);
    } else {
      setFormData({
        client_name: "",
        client_type: "retailer",
        contact_person: "",
        phone: "",
        address: "",
        territory: "",
        credit_limit: 0,
        outstanding_balance: 0,
        status: "active",
      });
    }
  }, [client]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <UserPlus className="w-5 h-5 text-blue-600" />
          {client ? "Edit Contact" : "Add New Contact"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-100 rounded-none">
            <TabsTrigger value="details">Contact Details</TabsTrigger>
            <TabsTrigger value="audit" disabled={!client}>
              <History className="w-4 h-4 mr-2" />
              Audit Trail
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="client_name">Client Name *</Label>
                  <Input id="client_name" value={formData.client_name} onChange={(e) => handleInputChange("client_name", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client_type">Client Type *</Label>
                  <Select value={formData.client_type} onValueChange={(value) => handleInputChange("client_type", value)} required>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="distributor">Distributor</SelectItem>
                      <SelectItem value="retailer">Retailer</SelectItem>
                      <SelectItem value="farmer">Farmer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_person">Contact Person</Label>
                  <Input id="contact_person" value={formData.contact_person || ""} onChange={(e) => handleInputChange("contact_person", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" value={formData.phone || ""} onChange={(e) => handleInputChange("phone", e.target.value)} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea id="address" value={formData.address || ""} onChange={(e) => handleInputChange("address", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="territory">Territory *</Label>
                  <Input id="territory" value={formData.territory || ""} onChange={(e) => handleInputChange("territory", e.target.value)} required />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="blocked">Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="credit_limit">Credit Limit (₹)</Label>
                  <Input id="credit_limit" type="number" value={formData.credit_limit || 0} onChange={(e) => handleInputChange("credit_limit", Number(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="outstanding_balance">Outstanding Balance (₹)</Label>
                  <Input id="outstanding_balance" type="number" value={formData.outstanding_balance || 0} onChange={(e) => handleInputChange("outstanding_balance", Number(e.target.value))} />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <Button type="button" variant="outline" onClick={onCancel} disabled={loading}><X className="w-4 h-4 mr-2" />Cancel</Button>
                <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="w-4 h-4 mr-2" />{client ? "Update" : "Save"} Contact
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="audit" className="p-0">
            {client && <AuditTrailTab entityName="Client" recordId={client.id} />}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
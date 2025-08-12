
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, ShoppingCart, Save, X, AlertTriangle, History } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuditTrailTab from "@/components/shared/AuditTrailTab";

export default function OrderForm({ order, clients, skus, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(order || {
    order_number: `ORD-${Date.now().toString().slice(-6)}`,
    client_id: "",
    order_date: new Date().toISOString().split('T')[0],
    items: [],
    payment_terms: "credit_30",
    status: "draft",
    delivery_address: "",
    expected_delivery: ""
  });
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    if (formData.client_id) {
      const client = clients.find(c => c.id === formData.client_id);
      setSelectedClient(client);
      if (client) {
        setFormData(prev => ({ ...prev, delivery_address: client.address }));
      }
    } else {
      setSelectedClient(null);
    }
  }, [formData.client_id, clients]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    if (field === 'sku') {
      const selectedSku = skus.find(s => s.sku === value);
      if (selectedSku) {
        newItems[index].product_name = selectedSku.product_name;
        newItems[index].unit_price = selectedSku.unit_price;
      }
    }
    if (field === 'quantity' || field === 'unit_price') {
      newItems[index].total = (newItems[index].quantity || 0) * (newItems[index].unit_price || 0);
    }
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { sku: '', product_name: '', quantity: 1, unit_price: 0, total: 0 }]
    }));
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const totalAmount = formData.items.reduce((sum, item) => sum + item.total, 0);

  const isOrderBlocked = selectedClient && (
    selectedClient.status === 'blocked' ||
    (selectedClient.credit_limit > 0 && selectedClient.outstanding_balance >= selectedClient.credit_limit)
  );

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-xl mb-8">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <ShoppingCart className="w-5 h-5 text-blue-600" />
          {order ? "Edit Sales Order" : "New Sales Order"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="details">
          <TabsList className="w-full justify-start rounded-none bg-slate-100 p-0">
            <TabsTrigger value="details" className="px-4 py-3">Order Details</TabsTrigger>
            {order?.id && <TabsTrigger value="audit" className="px-4 py-3 flex items-center gap-2"><History className="w-4 h-4"/> Audit Trail</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="details" className="p-6">
            <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="client_id">Client *</Label>
                  <Select
                    value={formData.client_id}
                    onValueChange={(value) => handleInputChange("client_id", value)}
                    required
                  >
                    <SelectTrigger className="bg-white border-slate-200">
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map(client => (
                        <SelectItem key={client.id} value={client.id} disabled={client.status === 'inactive'}>
                          {client.client_name} ({client.client_type})
                          {client.status !== 'active' && <span className="ml-2 text-xs text-red-500">({client.status})</span>}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order_date">Order Date *</Label>
                  <Input
                    id="order_date"
                    type="date"
                    value={formData.order_date}
                    onChange={(e) => handleInputChange("order_date", e.target.value)}
                    required
                    className="bg-white border-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order_number">Order Number</Label>
                  <Input id="order_number" value={formData.order_number} readOnly disabled className="bg-slate-100" />
                </div>
              </div>
              
              {isOrderBlocked && (
                <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
                  <AlertTriangle className="h-4 w-4" color="#dc2626"/>
                  <AlertTitle>Order Blocked</AlertTitle>
                  <AlertDescription>
                    {selectedClient.status === 'blocked'
                      ? `This client is currently blocked. No new orders can be placed.`
                      : `This client has exceeded their credit limit. (Outstanding: ₹${selectedClient.outstanding_balance} / Limit: ₹${selectedClient.credit_limit})`}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-semibold text-lg">Order Items</h3>
                {formData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end p-3 bg-slate-50 rounded-lg">
                    <div className="md:col-span-2">
                      <Label>SKU</Label>
                      <Select value={item.sku} onValueChange={(val) => handleItemChange(index, 'sku', val)}>
                        <SelectTrigger className="bg-white"><SelectValue placeholder="Select SKU"/></SelectTrigger>
                        <SelectContent>
                          {skus.map(sku => <SelectItem key={sku.id} value={sku.sku}>{sku.product_name} ({sku.sku})</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div><Label>Quantity</Label><Input type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.valueAsNumber)} className="bg-white" /></div>
                    <div><Label>Unit Price</Label><Input type="number" value={item.unit_price} onChange={(e) => handleItemChange(index, 'unit_price', e.target.valueAsNumber)} className="bg-white" /></div>
                    <div className="flex items-center gap-2">
                      <p className="flex-1 text-sm font-medium">Total: ₹{item.total.toFixed(2)}</p>
                      <Button type="button" variant="destructive" size="icon" onClick={() => removeItem(index)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addItem}><Plus className="w-4 h-4 mr-2" />Add Item</Button>
              </div>
              <div className="border-t pt-4 space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="delivery_address">Delivery Address</Label>
                      <Textarea id="delivery_address" value={formData.delivery_address} onChange={(e) => handleInputChange("delivery_address", e.target.value)} className="bg-white" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expected_delivery">Expected Delivery</Label>
                      <Input id="expected_delivery" type="date" value={formData.expected_delivery} onChange={(e) => handleInputChange("expected_delivery", e.target.value)} className="bg-white" />
                    </div>
                  </div>
              </div>
              <div className="flex justify-between items-center border-t pt-4">
                <h3 className="text-xl font-bold">Total: ₹{totalAmount.toFixed(2)}</h3>
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={onCancel}><X className="w-4 h-4 mr-2" />Cancel</Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isOrderBlocked}>
                    <Save className="w-4 h-4 mr-2" />
                    {order ? "Update Order" : "Submit Order"}
                  </Button>
                </div>
              </div>
            </form>
          </TabsContent>
          
          {order?.id && (
            <TabsContent value="audit" className="p-0">
              <AuditTrailTab entityName="SalesOrder" recordId={order.id} />
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}

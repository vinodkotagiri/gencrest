import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Save, X, ShoppingCart, History, CreditCard, AlertTriangle } from "lucide-react";

export default function QuickOrderForm({ client, skus, onSubmit, onCancel }) {
  const [orderData, setOrderData] = useState({
    client_id: client?.id || "",
    order_date: new Date().toISOString().split('T')[0],
    items: [{ sku_id: "", quantity: 1, unit_price: 0, total: 0 }],
    payment_terms: "credit_30",
    status: "draft"
  });

  // Mock client history data
  const [clientHistory, setClientHistory] = useState({
    total_orders: 12,
    last_order_date: "2024-06-15",
    last_order_amount: 45000,
    outstanding_balance: client?.outstanding_balance || 0,
    credit_limit: client?.credit_limit || 0,
    payment_history: "Good",
    frequent_products: ["NutriGro Fertilizer", "Gen-X Pesticide"]
  });

  const creditUtilization = client ? (client.outstanding_balance / client.credit_limit) * 100 : 0;
  const availableCredit = client ? client.credit_limit - client.outstanding_balance : 0;

  const handleItemChange = (index, field, value) => {
    const newItems = [...orderData.items];
    const item = newItems[index];
    item[field] = value;
    
    if (field === "sku_id") {
      const selectedSku = skus.find(s => s.id === value);
      if (selectedSku) {
        item.product_name = selectedSku.product_name;
        item.sku = selectedSku.sku;
        item.unit_price = selectedSku.unit_price || 0;
      }
    }
    
    item.total = (item.quantity || 0) * (item.unit_price || 0);
    setOrderData(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setOrderData(prev => ({
      ...prev,
      items: [...prev.items, { sku_id: "", quantity: 1, unit_price: 0, total: 0 }]
    }));
  };

  const removeItem = (index) => {
    setOrderData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const totalAmount = orderData.items.reduce((sum, item) => sum + item.total, 0);
  const willExceedCredit = client && (client.outstanding_balance + totalAmount) > client.credit_limit;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (willExceedCredit && orderData.payment_terms !== 'cash') {
      if (!confirm(`This order will exceed credit limit by ₹${((client.outstanding_balance + totalAmount) - client.credit_limit).toLocaleString()}. Continue?`)) {
        return;
      }
    }
    
    onSubmit({
      ...orderData,
      total_amount: totalAmount,
      client_name: client?.client_name
    });
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-xl max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-blue-600" />
          Quick Order for {client?.client_name}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Client Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-slate-50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{clientHistory.total_orders}</div>
            <div className="text-sm text-slate-600">Total Orders</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">₹{availableCredit.toLocaleString()}</div>
            <div className="text-sm text-slate-600">Available Credit</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">₹{client?.outstanding_balance?.toLocaleString() || 0}</div>
            <div className="text-sm text-slate-600">Outstanding</div>
          </div>
        </div>

        {/* Credit Warning */}
        {creditUtilization > 80 && (
          <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <span className="text-sm text-yellow-800">
              Credit utilization is {creditUtilization.toFixed(0)}%. Consider cash payment or collection.
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Items */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Order Items</Label>
            {orderData.items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-center p-3 bg-white border rounded-lg">
                <div className="col-span-5">
                  <Select value={item.sku_id} onValueChange={v => handleItemChange(index, 'sku_id', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Product" />
                    </SelectTrigger>
                    <SelectContent>
                      {skus.map(s => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.product_name} - ₹{s.unit_price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Input 
                    type="number" 
                    min="1" 
                    value={item.quantity} 
                    onChange={e => handleItemChange(index, 'quantity', parseInt(e.target.value, 10))}
                    placeholder="Qty"
                  />
                </div>
                <div className="col-span-2">
                  <Input 
                    type="number" 
                    value={item.unit_price} 
                    onChange={e => handleItemChange(index, 'unit_price', parseFloat(e.target.value))}
                    placeholder="Price"
                  />
                </div>
                <div className="col-span-2 text-right font-semibold">
                  ₹{item.total.toLocaleString()}
                </div>
                <div className="col-span-1">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeItem(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addItem} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>

          {/* Order Total */}
          <div className="text-right p-4 bg-slate-50 rounded-lg">
            <div className="text-3xl font-bold text-slate-900">
              Total: ₹{totalAmount.toLocaleString()}
            </div>
            {willExceedCredit && (
              <div className="text-sm text-red-600 mt-1">
                ⚠️ Exceeds credit limit by ₹{((client.outstanding_balance + totalAmount) - client.credit_limit).toLocaleString()}
              </div>
            )}
          </div>

          {/* Payment Terms */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Payment Terms</Label>
              <Select 
                value={orderData.payment_terms} 
                onValueChange={v => setOrderData(prev => ({ ...prev, payment_terms: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash Payment</SelectItem>
                  <SelectItem value="credit_30">Credit 30 Days</SelectItem>
                  <SelectItem value="credit_60">Credit 60 Days</SelectItem>
                  <SelectItem value="credit_90">Credit 90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Order Status</Label>
              <Select 
                value={orderData.status} 
                onValueChange={v => setOrderData(prev => ({ ...prev, status: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="submitted">Submit for Approval</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Frequently Ordered Products */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <Label className="text-sm font-medium text-blue-800">Frequently Ordered:</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {clientHistory.frequent_products.map((product, index) => (
                <Badge key={index} variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                  {product}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              {orderData.status === 'submitted' ? 'Submit Order' : 'Save Draft'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
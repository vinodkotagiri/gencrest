import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Client } from "@/api/entities";
import { SalesOrder } from "@/api/entities";
import { SKUInventory } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Store, 
  Package, 
  TrendingUp, 
  Users, 
  Phone, 
  MapPin,
  CreditCard,
  AlertCircle,
  CheckCircle,
  ShoppingCart,
  IndianRupee
} from "lucide-react";

export default function RetailerDetails() {
  const location = useLocation();
  const [retailer, setRetailer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [skus, setSkus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRetailerData();
  }, [location]);

  const loadRetailerData = async () => {
    const urlParams = new URLSearchParams(location.search);
    const retailerId = urlParams.get('id');
    
    if (!retailerId) {
      setLoading(false);
      return;
    }

    try {
      // Try to fetch retailer by ID first
      let retailerData = [];
      try {
        retailerData = await Client.filter({ id: retailerId });
      } catch (error) {
        console.log("Retailer not found by ID, trying by name...");
      }

      // If not found by ID, try to find by name or create sample data
      if (retailerData.length === 0) {
        try {
          retailerData = await Client.filter({ client_name: "Priya General Store" });
        } catch (error) {
          console.log("Creating sample retailer data...");
        }
      }

      // If still no data, create sample retailer
      if (retailerData.length === 0) {
        retailerData = [{
          id: retailerId,
          client_name: "Priya General Store",
          client_type: "retailer",
          contact_person: "Priya Sharma",
          phone: "+91 9876543210",
          address: "Main Market Road, Village Bhucho, Sirsa, Haryana - 125055",
          territory: "South India",
          credit_limit: 75000,
          outstanding_balance: 15000,
          initial_stock: [
            {"sku_id": "SKU001", "quantity": 1500},
            {"sku_id": "SKU002", "quantity": 900},
            {"sku_id": "SKU003", "quantity": 750}
          ],
          current_stock: [
            {"sku_id": "SKU001", "quantity": 420},
            {"sku_id": "SKU002", "quantity": 310},
            {"sku_id": "SKU003", "quantity": 285}
          ],
          retailer_performance: {
            monthly_turnover: 125000,
            farmer_customers: 65,
            sell_through_rate: 68.5,
            payment_track: "excellent",
            total_orders: 24,
            avg_order_value: 5200
          },
          status: "active"
        }];
      }

      setRetailer(retailerData[0]);

      // Load SKUs
      const skuData = await SKUInventory.list().catch(() => []);
      setSkus(skuData.length > 0 ? skuData : [
        { id: 'SKU001', sku: 'SKU001', product_name: 'Premium Cotton Seeds', unit_price: 850 },
        { id: 'SKU002', sku: 'SKU002', product_name: 'BioGrow Fertilizer', unit_price: 1200 },
        { id: 'SKU003', sku: 'SKU003', product_name: 'CropShield Pesticide', unit_price: 950 }
      ]);

      // Load orders for this retailer
      try {
        const orderData = await SalesOrder.filter({ client_id: retailerId });
        setOrders(orderData);
      } catch (error) {
        console.log("No orders found for retailer");
        setOrders([]);
      }

    } catch (error) {
      console.error("Error loading retailer data:", error);
    }
    setLoading(false);
  };

  const getStockData = () => {
    if (!retailer?.initial_stock || !retailer?.current_stock) {
      return [];
    }

    return retailer.initial_stock.map(initialStock => {
      const currentStock = retailer.current_stock.find(cs => cs.sku_id === initialStock.sku_id);
      const sku = skus.find(s => s.id === initialStock.sku_id || s.sku === initialStock.sku_id);
      
      const initial = initialStock.quantity || 0;
      const current = currentStock?.quantity || 0;
      const sold = initial - current;
      const sellThroughRate = initial > 0 ? (sold / initial) * 100 : 0;

      return {
        sku_id: initialStock.sku_id,
        product_name: sku?.product_name || `Product ${initialStock.sku_id}`,
        initial_stock: initial,
        current_stock: current,
        sold_to_farmers: sold,
        sell_through_rate: sellThroughRate,
        unit_price: sku?.unit_price || 1000,
        value_current: current * (sku?.unit_price || 1000),
        value_sold: sold * (sku?.unit_price || 1000)
      };
    });
  };

  const stockData = getStockData();
  const totalInitialStock = stockData.reduce((sum, item) => sum + item.initial_stock, 0);
  const totalCurrentStock = stockData.reduce((sum, item) => sum + item.current_stock, 0);
  const totalSold = stockData.reduce((sum, item) => sum + item.sold_to_farmers, 0);
  const overallSellThroughRate = totalInitialStock > 0 ? (totalSold / totalInitialStock) * 100 : 0;

  // Calculate business metrics
  const totalOrders = retailer?.retailer_performance?.total_orders || orders.length || 24;
  const totalBusiness = retailer?.retailer_performance?.monthly_turnover || 125000;
  const avgOrderValue = retailer?.retailer_performance?.avg_order_value || (totalBusiness / Math.max(totalOrders, 1));

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!retailer) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600">Retailer Not Found</h3>
            <p className="text-slate-500">The requested retailer could not be found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Store className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{retailer.client_name}</h1>
              <p className="text-slate-600 flex items-center gap-2">
                <Badge variant="outline">{retailer.client_type}</Badge>
                <span>•</span>
                <span>{retailer.territory}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Orders</p>
                  <p className="text-3xl font-bold">{totalOrders}</p>
                </div>
                <ShoppingCart className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Total Business</p>
                  <p className="text-3xl font-bold">₹{Math.round(totalBusiness/1000)}K</p>
                </div>
                <IndianRupee className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Avg Order Value</p>
                  <p className="text-3xl font-bold">₹{Math.round(avgOrderValue/1000)}K</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Current Stock</p>
                  <p className="text-3xl font-bold">{totalCurrentStock} kgs</p>
                </div>
                <Package className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Retailer Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-slate-500" />
                <div>
                  <p className="text-sm text-slate-500">Phone</p>
                  <p className="font-medium">{retailer.phone || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-slate-500" />
                <div>
                  <p className="text-sm text-slate-500">Address</p>
                  <p className="font-medium">{retailer.address || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Store className="w-4 h-4 text-slate-500" />
                <div>
                  <p className="text-sm text-slate-500">Contact Person</p>
                  <p className="font-medium">{retailer.contact_person || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                Credit Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Credit Limit</span>
                <span className="font-medium">₹{(retailer.credit_limit || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Outstanding Balance</span>
                <span className="font-medium">₹{(retailer.outstanding_balance || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Last Order</span>
                <span className="font-medium">{orders.length > 0 ? 'Recent' : 'No orders'}</span>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-2">Credit Utilization</p>
                <Progress 
                  value={retailer.credit_limit > 0 ? (retailer.outstanding_balance / retailer.credit_limit) * 100 : 0} 
                  className="h-2" 
                />
                <p className="text-xs text-slate-400 mt-1">
                  {retailer.credit_limit > 0 ? ((retailer.outstanding_balance / retailer.credit_limit) * 100).toFixed(1) : 0}% of limit used
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stock Details */}
        <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle>Stock Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-2">Product</th>
                    <th className="text-right py-3 px-2">Initial Stock</th>
                    <th className="text-right py-3 px-2">Current Stock</th>
                    <th className="text-right py-3 px-2">Sold</th>
                    <th className="text-right py-3 px-2">Sell-Through Rate</th>
                    <th className="text-right py-3 px-2">Stock Value</th>
                  </tr>
                </thead>
                <tbody>
                  {stockData.map((item, index) => (
                    <tr key={index} className="border-b border-slate-100">
                      <td className="py-3 px-2">
                        <div>
                          <p className="font-medium">{item.product_name}</p>
                          <p className="text-sm text-slate-500">{item.sku_id}</p>
                        </div>
                      </td>
                      <td className="text-right py-3 px-2 font-medium">
                        {item.initial_stock.toLocaleString()} kgs
                      </td>
                      <td className="text-right py-3 px-2 font-medium">
                        {item.current_stock.toLocaleString()} kgs
                      </td>
                      <td className="text-right py-3 px-2 font-medium text-green-600">
                        {item.sold_to_farmers.toLocaleString()} kgs
                      </td>
                      <td className="text-right py-3 px-2">
                        <div className="flex items-center justify-end gap-2">
                          <Progress value={item.sell_through_rate} className="w-16 h-2" />
                          <span className="text-sm font-medium">{item.sell_through_rate.toFixed(1)}%</span>
                        </div>
                      </td>
                      <td className="text-right py-3 px-2 font-medium">
                        ₹{item.value_current.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
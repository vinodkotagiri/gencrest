
import React, { useState, useEffect } from "react";
import { SalesOrder } from "@/api/entities";
import { User } from "@/api/entities";
import { Client } from "@/api/entities";
import { SKUInventory } from "@/api/entities";
import { AuditTrail } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, ShoppingCart, Lock } from "lucide-react";
import OrderForm from "../components/orders/OrderForm";
import OrderCard from "../components/orders/OrderCard";
import OrderFilters from "../components/orders/OrderFilters";

// Simple diff function to replace deep-object-diff
const calculateChanges = (oldObj, newObj) => {
  const changes = {};
  const allKeys = new Set([...Object.keys(oldObj || {}), ...Object.keys(newObj || {})]);
  
  allKeys.forEach(key => {
    const oldVal = oldObj?.[key];
    const newVal = newObj?.[key];
    
    if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
      changes[key] = {
        old_value: oldVal,
        new_value: newVal
      };
    }
  });
  
  return changes;
};

export default function OrdersPage() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState([]);
  const [skus, setSkus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ status: "all", date_range: "all" });

  useEffect(() => {
    loadData();
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('action') === 'new') {
      setShowForm(true);
    }
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const userData = await User.me();
      const demoRole = localStorage.getItem('demoRole');
      if (demoRole) userData.designation = demoRole;
      setUser(userData);

      const isTSM = userData.designation === 'TSM';
      const isMDO = userData.designation === 'MDO';

      let [ordersData, clientsData, skusData] = [ [], [], [] ];

      if (!isMDO) { // Only load data if not an MDO, MDOs will be restricted
        [ordersData, clientsData, skusData] = await Promise.all([
          isTSM ? SalesOrder.list("-created_date") : SalesOrder.filter({ mdo_id: userData.email }, "-created_date").catch(() => []),
          Client.list().catch(() => []),
          SKUInventory.list().catch(() => [])
        ]);

        if (clientsData.length === 0) {
          const sampleClients = [
              { client_name: "Active Distributor", client_type: "distributor", territory: "Mumbai", status: "active", credit_limit: 500000, outstanding_balance: 120000 },
              { client_name: "Blocked Wholesaler", client_type: "distributor", territory: "Delhi", status: "blocked", credit_limit: 200000, outstanding_balance: 250000 },
              { client_name: "Inactive Retailer", client_type: "retailer", territory: "Mumbai", status: "inactive", credit_limit: 50000, outstanding_balance: 0 },
              { client_name: "Standard Retailer", client_type: "retailer", territory: "Pune", status: "active", credit_limit: 100000, outstanding_balance: 30000 }
          ];
          for (const client of sampleClients) {
            try {
              await Client.create(client);
            } catch (error) {
              console.error("Error creating sample client:", error);
            }
          }
          clientsData = await Client.list().catch(() => []);
        }

        if (ordersData.length === 0 && clientsData.length > 0) {
          const activeClient = clientsData.find(c => c.status === 'active');
          if (activeClient) {
              const sampleOrder = {
                  order_number: "ORD-2024-001",
                  client_id: activeClient.id,
                  order_date: "2024-06-25",
                  items: [
                    {"sku": "SKU001", "product_name": "NutriGro Fertilizer", "quantity": 10, "unit_price": 850, "total": 8500}
                  ],
                  total_amount: 8500,
                  payment_terms: "credit_30",
                  status: "delivered",
                  mdo_id: userData?.email || "rajesh.kumar@gencrest.com",
                  delivery_address: activeClient?.address || "Delivery Address",
                  expected_delivery: "2024-06-28"
              };
              await SalesOrder.create(sampleOrder);
              ordersData = isTSM ? await SalesOrder.list("-created_date").catch(() => []) : await SalesOrder.filter({ mdo_id: userData.email }, "-created_date").catch(() => []);
          }
        }
      }
      
      setOrders(ordersData);
      setClients(clientsData);
      setSkus(skusData);

    } catch (error) {
      console.error("Error loading orders data:", error);
    }
    setLoading(false);
  };

  const handleSubmit = async (orderData) => {
    try {
      const total_amount = orderData.items.reduce((sum, item) => sum + item.total, 0);
      const dataToSave = { 
        ...orderData, 
        total_amount, 
        mdo_id: user?.email,
        created_by: user?.email
      };
      
      const userFullName = user?.full_name || user?.email;

      if (editingOrder) {
        const changes = calculateChanges(editingOrder, dataToSave);
        await SalesOrder.update(editingOrder.id, dataToSave);
        if (Object.keys(changes).length > 0) {
          await AuditTrail.create({
            entity_name: "SalesOrder",
            record_id: editingOrder.id,
            action: "update",
            user_email: user.email,
            user_full_name: userFullName,
            changes: changes
          });
        }
      } else {
        const newOrder = await SalesOrder.create(dataToSave);
         await AuditTrail.create({
          entity_name: "SalesOrder",
          record_id: newOrder.id,
          action: "create",
          user_email: user.email,
          user_full_name: userFullName,
          changes: { new_data: newOrder }
        });
      }
      setShowForm(false);
      setEditingOrder(null);
      loadData();
    } catch (error) {
      console.error("Error saving order:", error);
    }
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setShowForm(true);
  };

  const handleStatusUpdate = async (order, newStatus) => {
    try {
      const userFullName = user?.full_name || user?.email;
      await SalesOrder.update(order.id, { status: newStatus });
      await AuditTrail.create({
        entity_name: "SalesOrder",
        record_id: order.id,
        action: "update",
        user_email: user.email,
        user_full_name: userFullName,
        changes: { status: { old_value: order.status, new_value: newStatus } }
      });
      loadData();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const filteredOrders = orders.filter(order => {
    const client = clients.find(c => c.id === order.client_id);
    const clientName = client?.client_name || "";
    const searchLower = searchTerm.toLowerCase();

    const matchesSearch = clientName.toLowerCase().includes(searchLower) ||
                         (order.order_number || "").toLowerCase().includes(searchLower);
    
    const matchesStatus = filters.status === "all" || order.status === filters.status;
    
    let matchesDate = true;
    if (filters.date_range !== "all") {
      const orderDate = new Date(order.order_date);
      const now = new Date();
      if (filters.date_range === "week") {
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        matchesDate = orderDate >= weekAgo;
      } else if (filters.date_range === "month") {
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
        matchesDate = orderDate >= monthAgo;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  if (loading) {
    return (
      <div className="p-8 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-1/3 mb-6"></div>
        <div className="h-10 bg-slate-200 rounded w-full mb-8"></div>
        <div className="space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  // Access control for MDO role
  if (user && user.designation === 'MDO') {
    return (
      <div className="p-4 md:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md text-center bg-white/90 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-slate-800">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600">
              You do not have the required permissions to access the Sales Orders page. This module is available for TSMs and above.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Sales Orders</h1>
            <p className="text-slate-600">Create, track, and manage sales orders</p>
          </div>
          <Button 
            onClick={() => { setEditingOrder(null); setShowForm(true); }}
            className="bg-blue-600 hover:bg-blue-700 shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Order
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search by client or order number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/80 border-blue-100"
            />
          </div>
          <OrderFilters filters={filters} onFilterChange={setFilters} />
        </div>

        {showForm && (
          <OrderForm
            order={editingOrder}
            clients={clients}
            skus={skus}
            onSubmit={handleSubmit}
            onCancel={() => { setShowForm(false); setEditingOrder(null); }}
          />
        )}

        <div className="grid gap-6">
          {filteredOrders.length > 0 ? (
            filteredOrders.map(order => (
              <OrderCard 
                key={order.id} 
                order={order} 
                client={clients.find(c => c.id === order.client_id)} 
                onEdit={handleEdit} 
              />
            ))
          ) : (
            <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
              <CardContent className="text-center py-12">
                <ShoppingCart className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-600 mb-2">
                  {clients.length === 0 ? "No clients available" : "No orders found"}
                </h3>
                <p className="text-slate-500">
                  {clients.length === 0 
                    ? "Add some clients first to create orders" 
                    : "Get started by creating your first sales order"
                  }
                </p>
                {clients.length > 0 && (
                  <Button 
                    onClick={() => { setEditingOrder(null); setShowForm(true); }}
                    className="mt-4 bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Order
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

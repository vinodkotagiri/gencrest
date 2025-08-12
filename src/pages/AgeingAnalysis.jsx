import React, { useState, useEffect } from "react";
import { SalesOrder } from "@/api/entities";
import { Client } from "@/api/entities";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Clock, AlertTriangle, CreditCard, TrendingDown, Download, Filter } from "lucide-react";
import { format } from "date-fns";

export default function AgeingAnalysis() {
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [ageingData, setAgeingData] = useState({
    current: 0,
    days_30: 0,
    days_60: 0,
    days_90: 0,
    days_120_plus: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [ordersData, clientsData] = await Promise.all([
        SalesOrder.list("-created_date"),
        Client.list()
      ]);

      setOrders(ordersData);
      setClients(clientsData);
      calculateAgeingData(ordersData, clientsData);
    } catch (error) {
      console.error("Error loading ageing data:", error);
    }
    setLoading(false);
  };

  const calculateAgeingData = (ordersData, clientsData) => {
    const today = new Date();
    const ageing = {
      current: 0,
      days_30: 0,
      days_60: 0,
      days_90: 0,
      days_120_plus: 0
    };

    // Calculate outstanding amounts by age
    ordersData.forEach(order => {
      if (order.status === 'delivered' && order.payment_terms !== 'cash') {
        const orderDate = new Date(order.order_date);
        const daysDiff = Math.floor((today - orderDate) / (1000 * 60 * 60 * 24));
        const amount = order.total_amount || 0;

        if (daysDiff <= 30) {
          ageing.current += amount;
        } else if (daysDiff <= 60) {
          ageing.days_30 += amount;
        } else if (daysDiff <= 90) {
          ageing.days_60 += amount;
        } else if (daysDiff <= 120) {
          ageing.days_90 += amount;
        } else {
          ageing.days_120_plus += amount;
        }
      }
    });

    setAgeingData(ageing);
  };

  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client?.client_name || 'Unknown Client';
  };

  const getOutstandingOrders = () => {
    const today = new Date();
    return orders
      .filter(order => order.status === 'delivered' && order.payment_terms !== 'cash')
      .map(order => {
        const orderDate = new Date(order.order_date);
        const daysDiff = Math.floor((today - orderDate) / (1000 * 60 * 60 * 24));
        return {
          ...order,
          daysPending: daysDiff,
          client_name: getClientName(order.client_id)
        };
      })
      .sort((a, b) => b.daysPending - a.daysPending);
  };

  const getAgeingChartData = () => [
    { range: "0-30 Days", amount: ageingData.current, color: "#10B981" },
    { range: "31-60 Days", amount: ageingData.days_30, color: "#F59E0B" },
    { range: "61-90 Days", amount: ageingData.days_60, color: "#EF4444" },
    { range: "91-120 Days", amount: ageingData.days_90, color: "#8B5CF6" },
    { range: "120+ Days", amount: ageingData.days_120_plus, color: "#6B7280" }
  ];

  const getClientAgeingData = () => {
    const clientMap = new Map();
    
    getOutstandingOrders().forEach(order => {
      const clientId = order.client_id;
      if (!clientMap.has(clientId)) {
        clientMap.set(clientId, {
          client_name: order.client_name,
          total_outstanding: 0,
          orders_count: 0,
          oldest_days: 0
        });
      }
      
      const client = clientMap.get(clientId);
      client.total_outstanding += order.total_amount || 0;
      client.orders_count += 1;
      client.oldest_days = Math.max(client.oldest_days, order.daysPending);
    });

    return Array.from(clientMap.values())
      .sort((a, b) => b.total_outstanding - a.total_outstanding)
      .slice(0, 10);
  };

  const getDangerLevel = (days) => {
    if (days <= 30) return { color: "green", level: "Good" };
    if (days <= 60) return { color: "yellow", level: "Caution" };
    if (days <= 90) return { color: "orange", level: "Warning" };
    return { color: "red", level: "Critical" };
  };

  const outstandingOrders = getOutstandingOrders();
  const chartData = getAgeingChartData();
  const clientAgeingData = getClientAgeingData();
  const totalOutstanding = Object.values(ageingData).reduce((sum, val) => sum + val, 0);

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
              <Clock className="w-8 h-8 text-blue-600" />
              Ageing Analysis & Outstanding Management
            </h1>
            <p className="text-slate-600">Monitor payment delays and manage collections</p>
          </div>
          <Button variant="outline" className="bg-white/80 border-blue-200">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Outstanding</p>
                  <p className="text-2xl font-bold text-red-600">₹{totalOutstanding.toLocaleString()}</p>
                </div>
                <CreditCard className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Overdue (30+ Days)</p>
                  <p className="text-2xl font-bold text-orange-600">
                    ₹{(ageingData.days_30 + ageingData.days_60 + ageingData.days_90 + ageingData.days_120_plus).toLocaleString()}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Critical (90+ Days)</p>
                  <p className="text-2xl font-bold text-red-600">
                    ₹{(ageingData.days_90 + ageingData.days_120_plus).toLocaleString()}
                  </p>
                </div>
                <TrendingDown className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Outstanding Orders</p>
                  <p className="text-2xl font-bold text-blue-600">{outstandingOrders.length}</p>
                </div>
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-lg">
            <CardHeader>
              <CardTitle>Outstanding by Age Groups</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`} />
                  <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, "Amount"]} />
                  <Bar dataKey="amount" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-lg">
            <CardHeader>
              <CardTitle>Top 10 Clients by Outstanding</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {clientAgeingData.map((client, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{client.client_name}</p>
                      <p className="text-sm text-slate-600">
                        {client.orders_count} orders • Oldest: {client.oldest_days} days
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-600">₹{client.total_outstanding.toLocaleString()}</p>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          getDangerLevel(client.oldest_days).color === 'green' ? 'bg-green-100 text-green-800 border-green-200' :
                          getDangerLevel(client.oldest_days).color === 'yellow' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                          getDangerLevel(client.oldest_days).color === 'orange' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                          'bg-red-100 text-red-800 border-red-200'
                        }`}
                      >
                        {getDangerLevel(client.oldest_days).level}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Outstanding Orders Table */}
        <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Outstanding Orders Details</CardTitle>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Outstanding</SelectItem>
                <SelectItem value="overdue">Overdue (30+ Days)</SelectItem>
                <SelectItem value="critical">Critical (90+ Days)</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left p-3 font-medium text-slate-700">Order #</th>
                    <th className="text-left p-3 font-medium text-slate-700">Client</th>
                    <th className="text-left p-3 font-medium text-slate-700">Order Date</th>
                    <th className="text-left p-3 font-medium text-slate-700">Amount</th>
                    <th className="text-left p-3 font-medium text-slate-700">Days Pending</th>
                    <th className="text-left p-3 font-medium text-slate-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {outstandingOrders
                    .filter(order => {
                      if (filterType === "overdue") return order.daysPending > 30;
                      if (filterType === "critical") return order.daysPending > 90;
                      return true;
                    })
                    .slice(0, 20)
                    .map(order => (
                      <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="p-3 font-medium text-blue-600">{order.order_number}</td>
                        <td className="p-3">{order.client_name}</td>
                        <td className="p-3">{format(new Date(order.order_date), "MMM d, yyyy")}</td>
                        <td className="p-3 font-semibold">₹{order.total_amount?.toLocaleString()}</td>
                        <td className="p-3 font-bold text-red-600">{order.daysPending} days</td>
                        <td className="p-3">
                          <Badge 
                            variant="outline" 
                            className={`${
                              getDangerLevel(order.daysPending).color === 'green' ? 'bg-green-100 text-green-800 border-green-200' :
                              getDangerLevel(order.daysPending).color === 'yellow' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                              getDangerLevel(order.daysPending).color === 'orange' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                              'bg-red-100 text-red-800 border-red-200'
                            }`}
                          >
                            {getDangerLevel(order.daysPending).level}
                          </Badge>
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
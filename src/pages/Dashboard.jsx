
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Visit } from "@/api/entities";
import { SalesOrder } from "@/api/entities";
import { Client } from "@/api/entities"; // Added Client import
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  ShoppingCart,
  TrendingUp,
  Calendar,
  Users,
  Target,
  Clock,
  CheckCircle
} from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import StatsGrid from "../components/dashboard/StatsGrid";
import RecentActivities from "../components/dashboard/RecentActivities";
import PerformanceChart from "../components/dashboard/PerformanceChart";
import QuickActions from "../components/dashboard/QuickActions";
import PlannedVisits from "../components/dashboard/PlannedVisits"; // Added PlannedVisits import
import LocationMonitor from "../components/shared/LocationMonitor";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [visits, setVisits] = useState([]);
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState([]); // Added clients state
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todayVisits: 0,
    weeklyVisits: 0,
    monthlyOrders: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const userData = await User.me();
        const demoRole = localStorage.getItem('demoRole');
        if (demoRole) {
          userData.designation = demoRole;
        }
        setUser(userData);

        let visitsData = [];
        let ordersData = [];
        let clientsData = [];

        try {
          if (userData.designation === "MDO") {
            visitsData = await Visit.filter({ mdo_id: userData.email }, "-created_date", 20); // Increased limit
            ordersData = await SalesOrder.filter({ mdo_id: userData.email }, "-created_date", 20); // Increased limit
          } else {
            visitsData = await Visit.list("-created_date", 40); // Increased limit
            ordersData = await SalesOrder.list("-created_date", 40); // Increased limit
          }
          clientsData = await Client.list();
        } catch (error) {
          console.log("Could not load real data, will rely on sample data. Error:", error); // Updated error message
        }

        // --- DYNAMIC SAMPLE DATA INJECTION ---
        const generateDate = (daysAgo) => {
            const date = new Date();
            date.setDate(date.getDate() - daysAgo);
            return date.toISOString().split('T')[0];
        };

        let effectiveVisits = visitsData || [];
        let effectiveOrders = ordersData || [];
        let effectiveClients = clientsData || [];

        const today = generateDate(0);
        const weekStart = new Date(generateDate(7));

        const initialTodayVisits = effectiveVisits.filter(v => v?.visit_date === today && v.status === 'completed').length;
        const initialWeeklyVisits = effectiveVisits.filter(v => v?.visit_date && new Date(v.visit_date) >= weekStart && v.status === 'completed').length;

        // If stats are zero, inject fresh, user-specific sample data for the last 7 days.
        if (initialTodayVisits === 0 && initialWeeklyVisits === 0) {
            if (effectiveClients.length === 0) {
                effectiveClients = [
                    { id: 'client-1', client_name: 'Dynamic Agro', client_type: 'retailer', address: 'Meerut, UP' },
                    { id: 'client-2', client_name: 'Fresh Farm Inputs', client_type: 'distributor', address: 'Rohtak, Haryana' },
                    { id: 'client-3', client_name: 'Sunrise Krishi', client_type: 'retailer', address: 'Anand, Gujarat' }
                ];
            }

            const sampleVisits = [
                { id: 'sv-today-1', client_id: effectiveClients[0].id, visit_date: generateDate(0), status: 'completed', visit_purpose: 'sales_call', location: effectiveClients[0].address, mdo_id: userData.email },
                { id: 'sv-today-2', client_id: effectiveClients[1].id, visit_date: generateDate(0), status: 'completed', visit_purpose: 'collection', location: effectiveClients[1].address, mdo_id: userData.email },
                { id: 'sv-1', client_id: effectiveClients[0].id, visit_date: generateDate(1), status: 'completed', visit_purpose: 'product_demo', location: effectiveClients[0].address, mdo_id: userData.email },
                { id: 'sv-2', client_id: effectiveClients[2].id, visit_date: generateDate(2), status: 'completed', visit_purpose: 'sales_call', location: effectiveClients[2].address, mdo_id: userData.email },
                { id: 'sv-3', client_id: effectiveClients[1].id, visit_date: generateDate(3), status: 'completed', visit_purpose: 'follow_up', location: effectiveClients[1].address, mdo_id: userData.email },
                { id: 'sv-4', client_id: effectiveClients[0].id, visit_date: generateDate(4), status: 'completed', visit_purpose: 'sales_call', location: effectiveClients[0].address, mdo_id: userData.email },
                { id: 'sv-5', client_id: effectiveClients[2].id, visit_date: generateDate(5), status: 'completed', visit_purpose: 'follow_up', location: effectiveClients[2].address, mdo_id: userData.email },
                { id: 'sv-6', client_id: effectiveClients[1].id, visit_date: generateDate(6), status: 'completed', visit_purpose: 'sales_call', location: effectiveClients[1].address, mdo_id: userData.email },
                { id: 'sv-planned', client_id: effectiveClients[0].id, visit_date: generateDate(-1), status: 'planned', visit_purpose: 'sales_call', location: effectiveClients[0].address, visit_time: '16:00', mdo_id: userData.email },
            ];

            const sampleOrders = [
                { id: 'so-1', client_id: effectiveClients[0].id, order_date: generateDate(1), status: 'delivered', total_amount: 25000, mdo_id: userData.email },
                { id: 'so-2', client_id: effectiveClients[1].id, order_date: generateDate(2), status: 'delivered', total_amount: 62000, mdo_id: userData.email },
                { id: 'so-3', client_id: effectiveClients[2].id, order_date: generateDate(3), status: 'shipped', total_amount: 18000, mdo_id: userData.email },
                { id: 'so-4', client_id: effectiveClients[0].id, order_date: generateDate(4), status: 'delivered', total_amount: 33000, mdo_id: userData.email },
                { id: 'so-5', client_id: effectiveClients[1].id, order_date: generateDate(5), status: 'approved', total_amount: 41000, mdo_id: userData.email },
                { id: 'so-6', client_id: effectiveClients[2].id, order_date: generateDate(6), status: 'delivered', total_amount: 12000, mdo_id: userData.email },
            ];

            effectiveVisits = [...sampleVisits, ...effectiveVisits]; // Prepend sample data
            effectiveOrders = [...sampleOrders, ...effectiveOrders]; // Prepend sample data
        }
        // --- END DYNAMIC SAMPLE DATA INJECTION ---

        setVisits(effectiveVisits);
        setOrders(effectiveOrders);
        setClients(effectiveClients);

        // --- STATS CALCULATION ---
        const monthStart = new Date();
        monthStart.setDate(1);

        // Filter for completed visits for stats
        const todayVisits = effectiveVisits.filter(v => v?.visit_date === today && v.status === 'completed').length;
        const weeklyVisits = effectiveVisits.filter(v => v?.visit_date && new Date(v.visit_date) >= weekStart && v.status === 'completed').length;
        const monthlyOrders = effectiveOrders.filter(o => o?.order_date && new Date(o.order_date) >= monthStart).length;
        const totalRevenue = effectiveOrders
          .filter(o => o?.status === 'delivered')
          .reduce((sum, o) => sum + (o?.total_amount || 0), 0);

        setStats({
          todayVisits,
          weeklyVisits,
          monthlyOrders,
          totalRevenue
        });
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
      setLoading(false);
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Location Monitor - only for MDOs */}
        <LocationMonitor user={user} />

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/582cbced4_gencrestlogo.png"
                alt="Gencrest Logo"
                className="h-8 md:hidden"
              />
              <h1 className="text-3xl font-bold text-slate-900">
                Welcome back, {user?.full_name?.split(' ')[0] || 'User'}!
              </h1>
            </div>
            <p className="text-slate-600 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {format(new Date(), "EEEE, MMMM d, yyyy")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="bg-white/80 text-blue-700 border-blue-200 px-3 py-1"
            >
              {user?.territory || 'Territory'}
            </Badge>
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1"
            >
              {user?.designation || 'Role'}
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <StatsGrid stats={stats} userRole={user?.designation} />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-8">
            <PerformanceChart visits={visits} orders={orders} />
            <RecentActivities visits={visits} orders={orders} clients={clients} />
          </div>

          <div className="space-y-8">
            <QuickActions userRole={user?.designation} />

            {/* Replaced Today's Schedule with PlannedVisits */}
            <PlannedVisits visits={visits} clients={clients} />
          </div>
        </div>
      </div>
    </div>
  );
}

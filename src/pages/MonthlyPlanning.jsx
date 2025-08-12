import React, { useState, useEffect } from "react";
import { MonthlyPlan } from "@/api/entities";
import { User } from "@/api/entities";
import { Task } from "@/api/entities";
import { AuditTrail } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Calendar, Target, Users, BarChart3 } from "lucide-react";

import MonthlyPlanForm from "../components/planning/MonthlyPlanForm";
import PlansList from "../components/planning/PlansList";
import MDOPerformanceCard from "../components/planning/MDOPerformanceCard";

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

export default function MonthlyPlanning() {
  const [user, setUser] = useState(null);
  const [plans, setPlans] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await User.me();
      const demoRole = localStorage.getItem('demoRole');
      if (demoRole) {
        userData.designation = demoRole;
      }
      setUser(userData);

      const [plansData, tasksData, teamMembersData] = await Promise.all([
        MonthlyPlan.list("-created_date"),
        Task.list("-created_date"),
        User.filter({ designation: "MDO" })
      ]);

      setPlans(plansData);
      setTasks(tasksData);
      setTeamMembers(teamMembersData || []);
    } catch (error) {
      console.error("Error loading planning data:", error);
    }
    setLoading(false);
  };

  const handleSubmit = async (planData) => {
    try {
      const userFullName = user?.full_name || user?.email;
      if (editingPlan) {
        const changes = calculateChanges(editingPlan, planData);
        await MonthlyPlan.update(editingPlan.id, planData);
         if (Object.keys(changes).length > 0) {
          await AuditTrail.create({
            entity_name: "MonthlyPlan",
            record_id: editingPlan.id,
            action: "update",
            user_email: user.email,
            user_full_name: userFullName,
            changes: changes
          });
        }
      } else {
        const newPlan = await MonthlyPlan.create({
          ...planData,
          created_by_tsm_id: user?.email
        });
        await AuditTrail.create({
            entity_name: "MonthlyPlan",
            record_id: newPlan.id,
            action: "create",
            user_email: user.email,
            user_full_name: userFullName,
            changes: { new_data: newPlan }
        });
      }
      setShowForm(false);
      setEditingPlan(null);
      loadData();
    } catch (error) {
      console.error("Error saving plan:", error);
    }
  };

  const handleDelete = async (planId) => {
    if (window.confirm("Are you sure you want to delete this plan? This action cannot be undone.")) {
      try {
        await MonthlyPlan.delete(planId);
        await loadData();
      } catch (error) {
        console.error("Error deleting plan:", error);
      }
    }
  };

  const handleSubmitForApproval = async (planId) => {
    try {
      const plan = plans.find(p => p.id === planId);
      await MonthlyPlan.update(planId, { status: 'submitted_for_approval' });
       await AuditTrail.create({
        entity_name: "MonthlyPlan",
        record_id: planId,
        action: "update",
        user_email: user.email,
        user_full_name: user?.full_name || user?.email,
        changes: { status: { old_value: plan.status, new_value: 'submitted_for_approval' } }
      });
      await loadData();
    } catch (error) {
      console.error("Error submitting plan:", error);
    }
  };

  const canCreatePlans = ["TSM", "RBH", "RMM", "ZBH", "admin"].includes(user?.designation);

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="animate-pulse space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Monthly Planning</h1>
            <p className="text-slate-600">
              {user?.designation === "MDO" 
                ? "View your assigned monthly plans and targets" 
                : "Create and manage monthly plans for your team"
              }
            </p>
          </div>
          {canCreatePlans && (
            <Button 
              onClick={() => {
                setEditingPlan(null);
                setShowForm(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Plan
            </Button>
          )}
        </div>

        <Tabs defaultValue="plans" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/80">
            <TabsTrigger value="plans" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Monthly Plans
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="targets" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Targets Overview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="plans" className="space-y-6">
            {showForm && (
              <MonthlyPlanForm
                plan={editingPlan}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingPlan(null);
                }}
                userRole={user?.designation}
              />
            )}

            <PlansList
              plans={plans}
              teamMembers={teamMembers}
              userRole={user?.designation}
              userEmail={user?.email}
              onEdit={(plan) => {
                setEditingPlan(plan);
                setShowForm(true);
              }}
              onDelete={handleDelete}
              onSubmitForApproval={handleSubmitForApproval}
            />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <MDOPerformanceCard tasks={tasks} plans={plans} />
          </TabsContent>

          <TabsContent value="targets" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Card key={plan.id} className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {plan.month_year} - {plan.mdo_id?.split('@')[0]}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-slate-700">Visit Targets</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>Total: {plan.visit_targets?.total_visits || 0}</div>
                        <div>Distributors: {plan.visit_targets?.distributor_visits || 0}</div>
                        <div>Retailers: {plan.visit_targets?.retailer_visits || 0}</div>
                        <div>Farmers: {plan.visit_targets?.farmer_meetings || 0}</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-slate-700">Sales Targets</h4>
                      <div className="text-sm">
                        <div>Total: ₹{(plan.sales_targets?.total_sales || 0).toLocaleString()}</div>
                        <div>New Clients: {plan.sales_targets?.new_client_acquisition || 0}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
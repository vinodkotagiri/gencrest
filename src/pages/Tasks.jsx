
import React, { useState, useEffect } from "react";
import { Task } from "@/api/entities";
import { User } from "@/api/entities";
import { GameStats } from "@/api/entities";
import { Client } from "@/api/entities"; // Added import for Client
import { SKUInventory } from "@/api/entities"; // Added import for SKUInventory
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Target, Trophy, Award, Star } from "lucide-react";

import TaskForm from "../components/tasks/TaskForm";
import TaskList from "../components/tasks/TaskList";
import TaskFilters from "../components/tasks/TaskFilters";
import GameStatsCard from "../components/tasks/GameStatsCard";
import LeaderboardCard from "../components/tasks/LeaderboardCard";
import BadgesCard from "../components/tasks/BadgesCard";

export default function TasksPage() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [clients, setClients] = useState([]); // New state for clients
  const [skus, setSkus] = useState([]);     // New state for SKUs
  const [teamMembers, setTeamMembers] = useState([]); // New state for team members (MDOs)
  const [gameStats, setGameStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    status: "all",
    task_type: "all",
    priority: "all",
    mdo_id: "all" // New filter for MDO
  });

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
      const isManager = userData.designation !== "MDO"; // Determine if the user is a manager

      // Load tasks, clients, SKUs, and team members (MDOs) in parallel
      let [tasksData, clientsData, skusData, teamMembersData] = await Promise.all([
        Task.list("-created_date"), // Fetch all tasks, filtering will be done client-side or in TaskList
        Client.list().catch(() => []), // Catch errors to prevent Promise.all failure
        SKUInventory.list().catch(() => []), // Catch errors to prevent Promise.all failure
        isManager ? User.filter({ designation: "MDO" }) : Promise.resolve([]) // Fetch MDOs if user is a manager
      ]);

      setTasks(tasksData);
      setClients(clientsData); // Set clients state
      setSkus(skusData);     // Set SKUs state
      setTeamMembers(teamMembersData); // Set team members state

      // Load game stats for the logged-in user
      try {
        const stats = await GameStats.filter({ user_id: userData.email });
        setGameStats(stats[0] || null);
      } catch (error) {
        console.log("No game stats found, will create on first task completion");
      }

    } catch (error) {
      console.error("Error loading tasks:", error);
    }
    setLoading(false);
  };

  const handleSubmit = async (taskData) => {
    try {
      if (editingTask) {
        await Task.update(editingTask.id, taskData);
      } else {
        await Task.create({
          ...taskData,
          assigned_by_tsm_id: user?.email
        });
      }
      setShowForm(false);
      setEditingTask(null);
      loadData();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleTaskComplete = async (taskId, completionNotes) => {
    try {
      await Task.update(taskId, {
        status: "completed",
        completion_notes: completionNotes,
        completed_date: new Date().toISOString().split('T')[0]
      });

      // Award points for task completion
      await awardPoints(50, "Task Completed");

      loadData();
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const awardPoints = async (points, reason) => {
    try {
      if (gameStats) {
        await GameStats.update(gameStats.id, {
          total_points: gameStats.total_points + points,
          tasks_completed: gameStats.tasks_completed + 1
        });
      } else {
        await GameStats.create({
          user_id: user.email,
          total_points: points,
          tasks_completed: 1,
          badges_earned: [],
          level: 1
        });
      }
    } catch (error) {
      console.error("Error awarding points:", error);
    }
  };

  const canCreateTasks = ["TSM", "RBH", "RMM", "ZBH", "admin"].includes(user?.designation);

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="animate-pulse space-y-4">
          {Array(5).fill(0).map((_, i) => (
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
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Tasks & Gamification</h1>
            <p className="text-slate-600">
              {user?.designation === "MDO" ? "Complete tasks to earn points and badges" : "Assign and track team tasks"}
            </p>
          </div>
          {canCreateTasks && (
            <Button
              onClick={() => {
                setEditingTask(null);
                setShowForm(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Assign Task
            </Button>
          )}
        </div>

        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/80">
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="gamification" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Gamification
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Leaderboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-6">
            {showForm && (
              <TaskForm
                task={editingTask}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingTask(null);
                }}
                userRole={user?.designation}
                clients={clients}
              />
            )}

            <TaskFilters
              filters={filters}
              onFilterChange={setFilters}
              teamMembers={teamMembers} // Pass team members to filters
              userRole={user?.designation} // Pass user role to filters
            />

            <TaskList
              tasks={tasks}
              filters={filters}
              userRole={user?.designation}
              userEmail={user?.email} // Pass user email to TaskList for MDO-specific filtering
              onEdit={setEditingTask}
              onComplete={handleTaskComplete}
              onShowForm={setShowForm}
              clients={clients}
              skus={skus}
            />
          </TabsContent>

          <TabsContent value="gamification" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GameStatsCard gameStats={gameStats} user={user} />
              <BadgesCard gameStats={gameStats} />
            </div>
          </TabsContent>

          <TabsContent value="leaderboard">
            <LeaderboardCard currentUser={user} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

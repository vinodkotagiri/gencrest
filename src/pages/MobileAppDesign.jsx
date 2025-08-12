
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Home, Calendar, MapPin, Users, Target, Plus, Bell, User, BarChart3,
  AlertTriangle, Wifi, Battery, Signal, Smartphone, PlayCircle, FileText,
  TrendingUp, FileSignature, XCircle, Edit, BatteryLow, MapPinOff, Settings,
  Search, Filter, Send, ArrowLeft, MoreVertical, Star, Award, Eye, ChevronRight,
  Mic, Video, Camera as CameraIcon, CheckCircle, Clock, CheckSquare, MessageCircle, RefreshCw, Download, Trophy, ExternalLink
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function MobileAppDesign() {
  const [selectedRole, setSelectedRole] = useState("mdo");
  const [currentScreen, setCurrentScreen] = useState("dashboard");
  const [activeVisit, setActiveVisit] = useState(null);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [visitInProgress, setVisitInProgress] = useState(false);
  const [visitTimer, setVisitTimer] = useState(0);
  const [completedTasks, setCompletedTasks] = useState({});
  const [selectedTeamMember, setSelectedTeamMember] = useState(null);
  const [showLiveMeetings, setShowLiveMeetings] = useState(false); // New state for collapsible meetings
  
  // State for visit execution validation
  const [visitNotes, setVisitNotes] = useState("");
  const [capturedMedia, setCapturedMedia] = useState([]);
  const [signatureCaptured, setSignatureCaptured] = useState(false);
  
  const [criticalAlerts, setCriticalAlerts] = useState([
    { id: 1, type: 'location_disabled', user: 'Priya Sharma', severity: 'high', message: 'Location services disabled for 15 mins' },
    { id: 2, type: 'low_battery', user: 'Amit Singh', severity: 'medium', message: 'Battery at 18% during active visit' },
    { id: 3, type: 'geofence_violation', user: 'Rajesh Kumar', severity: 'high', message: '2.5km outside territory boundary' }
  ]);
  const [mobileOnlyView, setMobileOnlyView] = useState(false); // New state for mobile only view

  // Sample live meetings data for managers
  const [liveMeetings] = useState([
    { id: 1, mdo: "Rajesh Kumar", client: "Ram Kumar Farm", location: "Green Valley, Sector 12", startTime: "10:45 AM", duration: "25 min", status: "active" },
    { id: 2, mdo: "Priya Sharma", client: "Sunrise Agro Store", location: "Market Road, Anand", startTime: "11:20 AM", duration: "15 min", status: "active" },
    { id: 3, mdo: "Amit Singh", client: "Happy Farms", location: "Village Road", startTime: "09:30 AM", duration: "45 min", status: "completed" }
  ]);

  const sampleTasks = [
    { id: 1, title: "Visit Green Valley Farm", client: "Ram Kumar", type: "Farmer Meeting", status: "pending", priority: "high", dueDate: "Today", location: "Green Valley, Sector 12" },
    { id: 2, title: "Product Demo at Sunrise Agro", client: "Sunrise Agro Store", type: "Product Demo", status: "in_progress", priority: "medium", dueDate: "Tomorrow", location: "Market Road, Anand" },
    { id: 3, title: "Collection from Happy Farms", client: "Suresh Patel", type: "Collection", status: "pending", priority: "low", dueDate: "Tomorrow", location: "Happy Farms, Village Road" }
  ];
  
  const teamMembers = [
    { id: 1, name: "Rajesh Kumar", location: "Active - Green Valley", battery: 85, lastSeen: "2 mins ago", status: "on_visit", visitsToday: 4, tasksCompleted: 12, isLocationOn: true, currentClient: "Ram Kumar Farm" },
    { id: 2, name: "Priya Sharma", location: "Location Disabled", battery: 23, lastSeen: "15 mins ago", status: "location_issue", visitsToday: 2, tasksCompleted: 8, isLocationOn: false, currentClient: "Traveling" },
    { id: 3, name: "Amit Singh", location: "Active - Market Road", battery: 67, lastSeen: "1 min ago", status: "active", visitsToday: 6, tasksCompleted: 15, isLocationOn: true, currentClient: "Sunrise Agro" }
  ];

  useEffect(() => {
    let interval;
    if (visitInProgress) {
      interval = setInterval(() => setVisitTimer(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [visitInProgress]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartVisit = (task) => {
    setActiveVisit(task);
    setVisitInProgress(true);
    setVisitTimer(0);
    setCompletedTasks({}); // Reset tasks for new visit
    // Reset validation state for new visit
    setVisitNotes("");
    setCapturedMedia([]);
    setSignatureCaptured(false);
    setCurrentScreen("visit_execution");
  };

  const handleCompleteVisit = () => {
    setVisitInProgress(false);
    setActiveVisit(null);
    setVisitTimer(0);
    setCompletedTasks({}); // Clear completed tasks
    setCurrentScreen("dashboard");
  };

  const handleCapturePhoto = () => {
    setCapturedMedia(prev => [...prev, {type: 'photo', id: Date.now()}]);
    alert("Photo captured!");
  };
  
  const handleCaptureSignature = () => {
    setSignatureCaptured(true);
    alert("Signature captured!");
  };

  const phoneFrame = (content) => (
    <div className="mx-auto max-w-sm">
      <div className="bg-slate-800 rounded-[2.5rem] p-3 shadow-2xl">
        <div className="bg-white rounded-[2rem] overflow-hidden flex flex-col h-[600px]">
          {/* Status Bar */}
          <div className="bg-slate-900 text-white px-6 py-2 flex justify-between items-center text-sm flex-shrink-0">
            <span className="font-medium">9:41</span>
            <div className="flex items-center gap-2">
              <Signal className="w-4 h-4" />
              <Wifi className="w-4 h-4" />
              <Battery className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Location Nudge */}
          {selectedRole === 'mdo' && !locationEnabled && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 mx-4 mt-2 rounded-r-lg flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPinOff className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-sm font-semibold text-red-800">Location Services Off</p>
                    <p className="text-xs text-red-600">Please enable for field tracking</p>
                  </div>
                </div>
                <button onClick={() => setLocationEnabled(true)} className="bg-red-600 text-white text-xs px-3 py-1 rounded-md hover:bg-red-700">Enable</button>
              </div>
            </div>
          )}

          {/* App Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 shadow-sm flex-shrink-0">
            <div className="flex items-center justify-between">
              {currentScreen !== "dashboard" && currentScreen !== "schedule" && currentScreen !== "team" && currentScreen !== "reports" && currentScreen !== "tasks" && currentScreen !== "alerts" && currentScreen !== "settings" ? (
                <button onClick={() => setCurrentScreen(selectedTeamMember ? "team" : "dashboard")} className="p-2 hover:bg-white/10 rounded-lg">
                  <ArrowLeft className="w-5 h-5" />
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{selectedRole === 'mdo' ? 'Rajesh Kumar' : 'TSM Dashboard'}</p>
                    <p className="text-xs text-pink-100">{selectedRole === 'mdo' ? 'MDO - North Delhi' : 'Team Leader'}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-white/10 rounded-lg relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">3</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area - Takes remaining space */}
          <div className="flex-1 bg-slate-50 overflow-y-auto">
            {content}
          </div>

          {/* Bottom Navigation - Fixed at bottom */}
          {["dashboard", "schedule", "team", "reports", "tasks", "settings", "alerts"].includes(currentScreen) && (
            <div className="bg-white border-t border-slate-200 px-4 py-3 shadow-lg flex-shrink-0">
              <div className="flex justify-around">
                {getBottomNavItems().map((item, index) => (
                  <button 
                    key={index} 
                    onClick={() => setCurrentScreen(item.screen)} 
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg relative ${
                      currentScreen === item.screen ? 'text-purple-600 bg-purple-50' : 'text-slate-500'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-xs font-medium">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                        {item.badge}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const getBottomNavItems = () => selectedRole === 'mdo' ? [
    { icon: Home, label: 'Home', screen: 'dashboard' },
    { icon: Calendar, label: 'Schedule', screen: 'schedule' },
    { icon: Target, label: 'Tasks', screen: 'tasks' },
    { icon: BarChart3, label: 'Reports', screen: 'reports' }
  ] : [
    { icon: Home, label: 'Dashboard', screen: 'dashboard' },
    { icon: Users, label: 'Team', screen: 'team' },
    { icon: AlertTriangle, label: 'Alerts', screen: 'alerts', badge: criticalAlerts.length },
    { icon: BarChart3, label: 'Reports', screen: 'reports' },
    { icon: Settings, label: 'Settings', screen: 'settings' }
  ];

  const renderMDODashboard = () => (
    <div className="p-4 space-y-4">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Good Morning!</p>
            <p className="text-lg font-bold">Ready for today?</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">5</p>
            <p className="text-xs opacity-75">visits planned</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-medium text-slate-700">Completed</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">3</p>
          <p className="text-xs text-slate-500">visits today</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-pink-500" />
            <span className="text-sm font-medium text-slate-700">Pending</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">2</p>
          <p className="text-xs text-slate-500">tasks left</p>
        </div>
      </div>

      {/* Today's Schedule Preview OR Ongoing Visit */}
      {visitInProgress && activeVisit ? (
        <div className="bg-white rounded-xl p-4 shadow-lg border-l-4 border-pink-500">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-pink-500 animate-pulse" />
                Ongoing Visit
            </h3>
            <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg">
                <div className="w-2 h-8 bg-pink-500 rounded-full"></div>
                <div className="flex-1">
                    <p className="font-medium text-slate-900">{activeVisit.title}</p>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <User className="w-3 h-3" />
                        <span>{activeVisit.client}</span>
                    </div>
                </div>
                <button 
                    onClick={() => setCurrentScreen("visit_execution")}
                    className="bg-pink-600 text-white px-3 py-1 rounded-lg text-sm font-medium"
                >
                    Resume
                </button>
            </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-500" />
              Next Visit
            </h3>
            <button 
              onClick={() => setCurrentScreen("schedule")}
              className="text-purple-600 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
            <div className="w-2 h-8 bg-purple-500 rounded-full"></div>
            <div className="flex-1">
              <p className="font-medium text-slate-900">Ram Kumar Farm</p>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Clock className="w-3 h-3" />
                <span>11:00 AM</span>
                <MapPin className="w-3 h-3 ml-2" />
                <span>Green Valley, Sector 12</span>
              </div>
            </div>
            <button 
              onClick={() => handleStartVisit(sampleTasks[0])}
              className="bg-purple-600 text-white px-3 py-1 rounded-lg text-sm font-medium"
            >
              Start
            </button>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => setCurrentScreen("schedule")}
            className="flex items-center gap-2 p-3 bg-pink-50 rounded-lg border border-pink-200 hover:bg-pink-100"
          >
            <Plus className="w-5 h-5 text-pink-600" />
            <span className="text-sm font-medium text-pink-700">New Visit</span>
          </button>
          <button className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100">
            <CameraIcon className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">Quick Photo</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderMDOSchedule = () => (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Today's Schedule</h2>
        <button className="bg-purple-600 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Visit
        </button>
      </div>

      {/* Date Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['Today', 'Tomorrow', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <button 
            key={day} 
            className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium ${
              index === 0 ? 'bg-purple-600 text-white' : 'bg-white text-slate-600 border'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Schedule List */}
      <div className="space-y-3">
        {sampleTasks.map((task, index) => (
          <div key={task.id} className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 rounded-full bg-purple-500 mt-2"></div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{task.title}</h3>
                  <p className="text-sm text-slate-600">{task.client}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>11:00 AM</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{task.location}</span>
                    </div>
                  </div>
                </div>
              </div>
              <Badge className={`${
                task.priority === 'high' ? 'bg-red-100 text-red-800' :
                task.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                'bg-pink-100 text-pink-800'
              }`}>
                {task.priority}
              </Badge>
            </div>
            
            {task.status === 'pending' && (
              <div className="flex gap-2 pt-3 border-t">
                <button 
                  onClick={() => handleStartVisit(task)}
                  className="flex-1 bg-purple-600 text-white py-2 rounded-lg text-sm font-medium"
                >
                  Start Visit
                </button>
                <button className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-lg text-sm font-medium">
                  Reschedule
                </button>
              </div>
            )}
            
            {task.status === 'completed' && (
              <div className="flex items-center gap-2 pt-3 border-t">
                <CheckCircle className="w-4 h-4 text-purple-500" />
                <span className="text-sm text-purple-600 font-medium">Completed</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderMDOTasks = () => (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">My Tasks</h2>
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <span className="text-sm font-semibold text-slate-700">1,250 pts</span>
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm opacity-90">Weekly Progress</span>
          <span className="text-sm font-bold">75%</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2 mb-2">
          <div className="bg-white rounded-full h-2" style={{width: '75%'}}></div>
        </div>
        <p className="text-xs opacity-75">6 of 8 tasks completed this week</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['All', 'Pending', 'In Progress', 'Completed'].map((filter, index) => (
          <button 
            key={filter} 
            className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium ${
              index === 0 ? 'bg-purple-600 text-white' : 'bg-white text-slate-600 border'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {sampleTasks.map((task) => (
          <div key={task.id} className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">{task.title}</h3>
                <p className="text-sm text-slate-600 mb-2">{task.type}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {task.dueDate}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Star className="w-3 h-3 text-yellow-500" />
                    <span>50 pts</span>
                  </div>
                </div>
              </div>
              <button className="bg-purple-600 text-white px-3 py-1 rounded-lg text-sm font-medium">
                Start
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMDOReports = () => (
    <div className="p-4 space-y-4">
      {/* Header */}
      <h2 className="text-xl font-bold text-slate-800">My Performance</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-medium text-slate-700">This Month</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">28</p>
          <p className="text-xs text-slate-500">visits completed</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-pink-500" />
            <span className="text-sm font-medium text-slate-700">Success Rate</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">94%</p>
          <p className="text-xs text-slate-500">task completion</p>
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-3">Weekly Activity</h3>
        <div className="h-40 bg-slate-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-500">Activity chart will appear here</p>
          </div>
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-3">Recent Achievements</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <Trophy className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800">Task Master</p>
              <p className="text-xs text-slate-500">Completed 10 tasks in a row</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <MapPin className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800">Location Champion</p>
              <p className="text-xs text-slate-500">Perfect location tracking for 7 days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderVisitExecution = () => {
    const hasNotes = visitNotes.trim().length > 5;
    const hasPhoto = capturedMedia.some(item => item.type === 'photo');
    const hasSignature = signatureCaptured;
    const isCompletable = hasNotes && hasPhoto && hasSignature;

    return (
      <div className="p-4 space-y-4">
        {/* Visit Header */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-slate-800">{activeVisit?.title}</h2>
            <div className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-xs font-medium">
              In Progress
            </div>
          </div>
          <p className="text-sm text-slate-600">{activeVisit?.client}</p>
          <p className="text-xs text-slate-500">{activeVisit?.location}</p>
        </div>

        {/* Timer Card */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-4 rounded-xl text-center">
          <p className="text-sm opacity-90">Visit Duration</p>
          <p className="text-3xl font-bold">{formatTime(visitTimer)}</p>
        </div>

        {/* Task Checklist */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-3">Visit Checklist</h3>
          <div className="space-y-3">
            {[
              { id: 'intro', label: 'Introduction & Greeting' },
              { id: 'demo', label: 'Product Demonstration' },
              { id: 'discussion', label: 'Needs Discussion' },
              { id: 'photos', label: 'Take Photos' },
              { id: 'signature', label: 'Get Signature' }
            ].map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <button 
                  onClick={() => setCompletedTasks(prev => ({
                    ...prev,
                    [item.id]: !prev[item.id]
                  }))}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    completedTasks[item.id] 
                      ? 'bg-purple-500 border-purple-500' 
                      : 'border-slate-300'
                  }`}
                >
                  {completedTasks[item.id] && <CheckCircle className="w-3 h-3 text-white" />}
                </button>
                <span className={`text-sm ${
                  completedTasks[item.id] 
                    ? 'text-purple-600 line-through' 
                    : 'text-slate-700'
                }`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button 
              onClick={handleCapturePhoto}
              className="flex items-center justify-center gap-2 p-3 bg-purple-100 rounded-lg"
            >
              <CameraIcon className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">Take Photo</span>
            </button>
            <button 
              onClick={handleCaptureSignature}
              className="flex items-center justify-center gap-2 p-3 bg-pink-100 rounded-lg"
            >
              <FileSignature className="w-5 h-5 text-pink-600" />
              <span className="text-sm font-medium text-pink-700">Signature</span>
            </button>
          </div>
          
          <Textarea 
            placeholder="Add visit notes (min 5 characters)..."
            className="mb-4"
            value={visitNotes}
            onChange={(e) => setVisitNotes(e.target.value)}
          />
          
          {/* Validation Checklist */}
          <div className="bg-slate-50 p-3 rounded-lg mb-4 space-y-2">
            <h4 className="text-sm font-semibold text-slate-700">Completion Requirements:</h4>
            <div className={`flex items-center gap-2 text-sm ${hasPhoto ? 'text-green-600' : 'text-slate-500'}`}>
              {hasPhoto ? <CheckCircle className="w-4 h-4"/> : <XCircle className="w-4 h-4"/>}
              <span>Capture at least one photo</span>
            </div>
            <div className={`flex items-center gap-2 text-sm ${hasSignature ? 'text-green-600' : 'text-slate-500'}`}>
              {hasSignature ? <CheckCircle className="w-4 h-4"/> : <XCircle className="w-4 h-4"/>}
              <span>Capture e-Signature</span>
            </div>
            <div className={`flex items-center gap-2 text-sm ${hasNotes ? 'text-green-600' : 'text-slate-500'}`}>
              {hasNotes ? <CheckCircle className="w-4 h-4"/> : <XCircle className="w-4 h-4"/>}
              <span>Add visit notes</span>
            </div>
          </div>
          
          <button 
            onClick={handleCompleteVisit}
            disabled={!isCompletable}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            Stop & Complete Visit
          </button>
        </div>
      </div>
    );
  };
  
  const renderTSMDashboard = () => (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-purple-600 text-white p-4 rounded-xl">
          <p className="text-sm opacity-90">Team Members</p>
          <p className="text-2xl font-bold">8</p>
          <p className="text-xs opacity-75">6 active today</p>
        </div>
        <div className="bg-pink-600 text-white p-4 rounded-xl">
          <p className="text-sm opacity-90">Today's Visits</p>
          <p className="text-2xl font-bold">24</p>
          <p className="text-xs opacity-75">18 completed</p>
        </div>
      </div>

      {/* Live Meetings Section */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <button 
          onClick={() => setShowLiveMeetings(!showLiveMeetings)}
          className="w-full flex items-center justify-between mb-3 hover:bg-slate-50 p-2 rounded-lg transition-colors"
        >
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Live Meetings
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-green-600 font-medium">
              {liveMeetings.filter(meeting => meeting.status === 'active').length} Active
            </span>
            <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${showLiveMeetings ? 'rotate-90' : ''}`} />
          </div>
        </button>
        
        {showLiveMeetings && (
          <div className="space-y-3">
            {liveMeetings.filter(meeting => meeting.status === 'active').map(meeting => (
              <div key={meeting.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-slate-800">{meeting.mdo}</p>
                  <p className="text-xs text-slate-600">{meeting.client}</p>
                  <p className="text-xs text-slate-500">{meeting.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-green-600">{meeting.duration}</p>
                  <p className="text-xs text-slate-500">Started {meeting.startTime}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-800">Team Status</h3>
          <button onClick={() => setCurrentScreen("team")} className="text-purple-600 text-sm font-medium">View All</button>
        </div>
        <div className="space-y-3">
          {teamMembers.slice(0, 3).map(member => (
            <div key={member.id} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
              <div className={`w-3 h-3 rounded-full ${member.status === 'on_visit' ? 'bg-green-500' : member.status === 'location_issue' ? 'bg-red-500' : 'bg-purple-500'}`}></div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-slate-800">{member.name}</p>
                <p className="text-xs text-slate-500">{member.location}</p>
              </div>
              <div className="flex items-center gap-1">
                <Battery className={`w-3 h-3 ${member.battery < 20 ? 'text-red-500' : 'text-slate-400'}`} />
                <span className={`text-xs ${member.battery < 20 ? 'text-red-600 font-medium' : 'text-slate-500'}`}>{member.battery}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Overview */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-3">Performance Overview</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">94%</p>
            <p className="text-xs text-slate-500">Visit Success Rate</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-pink-600">₹2.4L</p>
            <p className="text-xs text-slate-500">Weekly Revenue</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTSMTeam = () => (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Team Monitoring</h2>
        <button className="p-2 bg-purple-600 text-white rounded-lg">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Live Meetings at Top */}
      <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500">
        <button 
          onClick={() => setShowLiveMeetings(!showLiveMeetings)}
          className="w-full flex items-center justify-between mb-3 hover:bg-slate-50 p-2 rounded-lg transition-colors"
        >
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Current Live Meetings
          </h3>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-100 text-green-800">
              {liveMeetings.filter(meeting => meeting.status === 'active').length} Active
            </Badge>
            <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${showLiveMeetings ? 'rotate-90' : ''}`} />
          </div>
        </button>
        
        {showLiveMeetings && (
          <div className="space-y-3">
            {liveMeetings.filter(meeting => meeting.status === 'active').map(meeting => (
              <div key={meeting.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <p className="font-medium text-slate-800">{meeting.mdo}</p>
                  <p className="text-sm text-slate-600">{meeting.client}</p>
                  <p className="text-xs text-slate-500">{meeting.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">{meeting.duration}</p>
                  <p className="text-xs text-slate-500">Started {meeting.startTime}</p>
                </div>
                <button className="bg-green-600 text-white px-2 py-1 rounded text-xs">
                  Monitor
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {['All', 'Active', 'On Visit', 'Issues'].map((filter, index) => (
          <button key={filter} className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium ${index === 0 ? 'bg-purple-600 text-white' : 'bg-white text-slate-600 border'}`}>
            {filter}
          </button>
        ))}
      </div>
      
      <div className="space-y-3">
        {teamMembers.map(member => (
          <div key={member.id} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold text-slate-800">{member.name}</p>
                <div className={`flex items-center gap-1 text-xs ${member.isLocationOn ? 'text-green-600' : 'text-red-600'}`}>
                  {member.isLocationOn ? member.currentClient : 'Location Off'}
                </div>
              </div>
              <Badge className={`${member.status === 'location_issue' ? 'bg-red-100 text-red-800' : member.status === 'on_visit' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                {member.status.replace('_', ' ')}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <Battery className={`w-3 h-3 ${member.battery < 20 ? 'text-red-500' : 'text-slate-400'}`} />
                <span>{member.battery}%</span>
              </div>
              <span>Last seen: {member.lastSeen}</span>
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => { setSelectedTeamMember(member); setCurrentScreen("team_member_detail"); }} className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-lg text-sm font-medium">Details</button>
              <button className="flex-1 bg-purple-100 text-purple-700 py-2 rounded-lg text-sm font-medium">Message</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTSMAlerts = () => (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Critical Alerts</h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-red-600 font-medium">{criticalAlerts.length} Active</span>
        </div>
      </div>

      {/* Alert Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['All', 'Location', 'Battery', 'Geofence', 'Performance'].map((category, index) => (
          <button 
            key={category} 
            className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium ${
              index === 0 ? 'bg-red-600 text-white' : 'bg-white text-slate-600 border'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {criticalAlerts.map(alert => (
          <div key={alert.id} className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-red-500">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${alert.severity === 'high' ? 'bg-red-500' : 'bg-orange-500'} animate-pulse`}></div>
                <h3 className="font-semibold text-slate-900">{alert.user}</h3>
                <Badge className={`${alert.severity === 'high' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}`}>
                  {alert.severity} priority
                </Badge>
              </div>
              <span className="text-xs text-slate-500">2 mins ago</span>
            </div>
            
            <div className="flex items-center gap-2 mb-3">
              {alert.type === 'location_disabled' && <MapPinOff className="w-4 h-4 text-red-500" />}
              {alert.type === 'low_battery' && <BatteryLow className="w-4 h-4 text-orange-500" />}
              {alert.type === 'geofence_violation' && <AlertTriangle className="w-4 h-4 text-red-500" />}
              <p className="text-sm text-slate-700">{alert.message}</p>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 bg-purple-600 text-white py-2 rounded-lg text-sm font-medium">
                Contact MDO
              </button>
              <button className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-lg text-sm font-medium">
                Mark Resolved
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
            <Bell className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium text-red-700">Send Team Alert</span>
          </button>
          <button className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <MessageCircle className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">Broadcast Message</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderTeamMemberDetail = () => (
    <div className="p-4 space-y-4">
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800">{selectedTeamMember?.name}</h2>
        <p className="text-sm text-slate-600">MDO - North Delhi</p>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold mb-3">Live Status</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-600">Location</span>
          <span className={`font-medium ${selectedTeamMember?.isLocationOn ? 'text-green-600' : 'text-red-600'}`}>{selectedTeamMember?.isLocationOn ? 'Enabled' : 'Disabled'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Battery</span>
          <span className={`font-medium ${selectedTeamMember?.battery < 20 ? 'text-red-600' : 'text-slate-800'}`}>{selectedTeamMember?.battery}%</span>
        </div>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold mb-3">Today's Performance</h3>
        <div className="grid grid-cols-2 gap-3">
          <div><p className="text-xl font-bold">{selectedTeamMember?.visitsToday}</p><p className="text-xs text-slate-500">Visits</p></div>
          <div><p className="text-xl font-bold">{selectedTeamMember?.tasksCompleted}</p><p className="text-xs text-slate-500">Tasks</p></div>
        </div>
      </div>
      <div className="flex gap-3">
        <button className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-medium">Assign Task</button>
        <button className="flex-1 bg-pink-600 text-white py-3 rounded-lg font-medium">View Reports</button>
      </div>
    </div>
  );
  
  const renderTSMReports = () => (<div className="p-4"><h2 className="font-bold">Team Reports</h2><p>TSM reports section coming soon.</p></div>);
  const renderTSMSettings = () => (<div className="p-4"><h2 className="font-bold">Settings</h2><p>TSM settings section coming soon.</p></div>);

  const renderCurrentScreen = () => {
    if (selectedRole === 'mdo') {
      switch (currentScreen) {
        case 'dashboard': return renderMDODashboard();
        case 'schedule': return renderMDOSchedule();
        case 'tasks': return renderMDOTasks();
        case 'reports': return renderMDOReports();
        case 'visit_execution': return renderVisitExecution();
        default: return renderMDODashboard();
      }
    } else { // TSM
      switch (currentScreen) {
        case 'dashboard': return renderTSMDashboard();
        case 'team': return renderTSMTeam();
        case 'alerts': return renderTSMAlerts();
        case 'team_member_detail': return renderTeamMemberDetail();
        case 'reports': return renderTSMReports();
        case 'settings': return renderTSMSettings();
        default: return renderTSMDashboard();
      }
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-slate-100 to-blue-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Mobile App Design</h1>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" className="bg-white border-purple-200 text-purple-700 hover:bg-purple-50">
            <Link 
              to={createPageUrl("MobilePreview")} 
              target="_blank" 
              className="flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Full View
            </Link>
          </Button>
          <button
            onClick={() => setMobileOnlyView(!mobileOnlyView)}
            className={`px-4 py-2 rounded-lg font-medium ${
              mobileOnlyView 
                ? 'bg-purple-600 text-white' 
                : 'bg-white text-slate-700 border'
            }`}
          >
            {mobileOnlyView ? 'Show Full View' : 'Mobile Only'}
          </button>
          <div className="flex items-center gap-2 p-1 bg-white rounded-full shadow-md">
            <Button onClick={() => setSelectedRole("mdo")} variant={selectedRole === 'mdo' ? "primary" : "ghost"} className={`rounded-full px-4 py-1 ${selectedRole === 'mdo' ? 'bg-purple-600 text-white' : ''}`}>MDO View</Button>
            <Button onClick={() => setSelectedRole("tsm")} variant={selectedRole === 'tsm' ? "primary" : "ghost"} className={`rounded-full px-4 py-1 ${selectedRole === 'tsm' ? 'bg-purple-600 text-white' : ''}`}>TSM View</Button>
          </div>
        </div>
      </div>

      {mobileOnlyView ? (
        <div className="flex justify-center items-center min-h-[600px]">
          {phoneFrame(renderCurrentScreen())}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mt-6">
          <div className="order-2 lg:order-1">
            {phoneFrame(renderCurrentScreen())}
          </div>
          
          <div className="order-1 lg:order-2 space-y-6">
            <Card className="shadow-lg border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-purple-600" />
                  {selectedRole === 'mdo' ? 'MDO Mobile Features' : 'TSM Team Monitoring'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedRole === 'mdo' ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-purple-700">📍 Smart Location Nudges</h4>
                      <ul className="text-sm text-slate-600 space-y-1 ml-4">
                        <li>• Persistent location permission reminders</li>
                        <li>• One-tap enable location services</li>
                        <li>• Automatic manager notifications when disabled</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-purple-700">📸 Visit Execution</h4>
                      <ul className="text-sm text-slate-600 space-y-1 ml-4">
                        <li>• Task checklist with photo capture</li>
                        <li>• Digital signature collection</li>
                        <li>• Voice notes and visit documentation</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-purple-700">🔋 Live Team Status</h4>
                      <ul className="text-sm text-slate-600 space-y-1 ml-4">
                        <li>• Real-time location tracking on map</li>
                        <li>• Live battery percentage monitoring</li>
                        <li>• Critical alerts for low battery & disabled location</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-purple-700">📊 Performance Analytics</h4>
                      <ul className="text-sm text-slate-600 space-y-1 ml-4">
                        <li>• Team-level dashboards & leaderboards</li>
                        <li>• Individual performance reports</li>
                        <li>• Visit & task completion rate tracking</li>
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}


import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Territory } from "@/api/entities";
import { GeofenceAlert } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Users,
  Search,
  Shield,
  MapPin,
  Settings,
  AlertTriangle,
  Plus,
  Edit,
  Eye,
  Pencil,
  UserCheck,
  UserX,
  Clock,
  Calendar,
  Target // Added Target icon for the new Annual Targets Module card
} from "lucide-react";

export default function SuperAdminUsers() {
  const [users, setUsers] = useState([]);
  const [territories, setTerritories] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDesignation, setFilterDesignation] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isTerritoryDialogOpen, setIsTerritoryDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [editingTerritory, setEditingTerritory] = useState(null);
  const [pendingStatusChange, setPendingStatusChange] = useState(null);
  // New state for Annual Targets Module (placeholder count as no entity is defined)
  const [annualTargetsCount, setAnnualTargetsCount] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Always use sample data for demonstration
    const sampleUsers = [
      {
        id: 'sample-1',
        full_name: 'Super Admin',
        email: 'superadmin@gencrest.com',
        employee_id: 'SUP001',
        designation: 'super_admin',
        territory: 'Global',
        territory_id: null,
        status: 'active',
        join_date: '2023-01-01',
        last_login: '2024-01-15T10:30:00Z'
      },
      {
        id: 'sample-2',
        full_name: 'Admin User',
        email: 'admin@gencrest.com',
        employee_id: 'ADM001',
        designation: 'admin',
        territory: 'All India',
        territory_id: null,
        status: 'active',
        join_date: '2023-01-15',
        last_login: '2024-01-14T16:45:00Z'
      },
      {
        id: 'sample-3',
        full_name: 'S. Varma (TSM)',
        email: 'svarma2210@gmail.com',
        employee_id: 'TSM001',
        designation: 'TSM',
        territory: 'Mumbai Region',
        territory_id: 'terr-mumbai',
        status: 'active',
        join_date: '2023-02-01',
        last_login: '2024-01-15T09:15:00Z'
      },
      {
        id: 'sample-4',
        full_name: 'Rahul Sharma (RBH)',
        email: 'rahul.sharma@gencrest.com',
        employee_id: 'RBH001',
        designation: 'RBH',
        territory: 'North Zone',
        territory_id: null,
        status: 'active',
        join_date: '2023-01-20',
        last_login: '2024-01-14T14:20:00Z'
      },
      {
        id: 'sample-5',
        full_name: 'Mahesh Nair (MDO)',
        email: 'maheshnair73@gmail.com',
        employee_id: 'MDO001',
        designation: 'MDO',
        territory: 'Mumbai Region',
        territory_id: 'terr-mumbai',
        status: 'active',
        join_date: '2023-03-10',
        last_login: '2024-01-15T08:45:00Z'
      },
      {
        id: 'sample-6',
        full_name: 'Sanal Kumar (MDO)',
        email: 'sanal.kumar@gencrest.com',
        employee_id: 'MDO002',
        designation: 'MDO',
        territory: 'Pune Region',
        territory_id: 'terr-pune',
        status: 'inactive',
        join_date: '2023-04-05',
        last_login: '2024-01-10T11:30:00Z'
      },
      {
        id: 'sample-7',
        full_name: 'Priya Singh (TSM)',
        email: 'priya.singh@gencrest.com',
        employee_id: 'TSM002',
        designation: 'TSM',
        territory: 'Delhi Region',
        territory_id: 'terr-delhi',
        status: 'active',
        join_date: '2023-05-12',
        last_login: '2024-01-13T15:00:00Z'
      },
      {
        id: 'sample-8',
        full_name: 'Marketing Director',
        email: 'marketing@gencrest.com',
        employee_id: 'MKT001',
        designation: 'Marketing_Head',
        territory: 'National',
        territory_id: null,
        status: 'active',
        join_date: '2022-11-15',
        last_login: '2024-01-14T09:30:00Z'
      },
      {
        id: 'sample-9',
        full_name: 'VP Sales',
        email: 'vp.sales@gencrest.com',
        employee_id: 'VP001',
        designation: 'VP_Sales',
        territory: 'National',
        territory_id: null,
        status: 'active',
        join_date: '2022-12-01',
        last_login: '2024-01-15T12:00:00Z'
      },
      {
        id: 'sample-10',
        full_name: 'Managing Director',
        email: 'md@gencrest.com',
        employee_id: 'MD001',
        designation: 'Managing_Director',
        territory: 'Global',
        territory_id: null,
        status: 'active',
        join_date: '2022-01-01',
        last_login: '2024-01-15T08:00:00Z'
      },
      {
        id: 'sample-11',
        full_name: 'CFO',
        email: 'cfo@gencrest.com',
        employee_id: 'CFO001',
        designation: 'CFO',
        territory: 'Global',
        territory_id: null,
        status: 'active',
        join_date: '2022-03-01',
        last_login: '2024-01-14T10:45:00Z'
      },
      {
        id: 'sample-12',
        full_name: 'CHRO',
        email: 'hr@gencrest.com',
        employee_id: 'HR001',
        designation: 'CHRO',
        territory: 'Global',
        territory_id: null,
        status: 'active',
        join_date: '2022-04-15',
        last_login: '2024-01-13T16:20:00Z'
      },
      {
        id: 'sample-13',
        full_name: 'Amit Patel (MDO)',
        email: 'amit.patel@gencrest.com',
        employee_id: 'MDO003',
        designation: 'MDO',
        territory: 'Bangalore Region',
        territory_id: 'terr-bangalore',
        status: 'active',
        join_date: '2023-06-15',
        last_login: '2024-01-14T11:20:00Z'
      },
      {
        id: 'sample-14',
        full_name: 'Kavya Reddy (MDO)',
        email: 'kavya.reddy@gencrest.com',
        employee_id: 'MDO004',
        designation: 'MDO',
        territory: 'Hyderabad Region',
        territory_id: 'terr-hyderabad',
        status: 'active',
        join_date: '2023-07-01',
        last_login: '2024-01-15T13:45:00Z'
      },
      {
        id: 'sample-15',
        full_name: 'Rajesh Kumar (RMM)',
        email: 'rajesh.kumar@gencrest.com',
        employee_id: 'RMM001',
        designation: 'RMM',
        territory: 'South Zone',
        territory_id: null,
        status: 'active',
        join_date: '2023-02-15',
        last_login: '2024-01-14T10:15:00Z'
      }
    ];

    const sampleTerritories = [
      { id: 'terr-mumbai', name: 'Mumbai Region', radius_km: 50, center_latitude: 19.0760, center_longitude: 72.8777 },
      { id: 'terr-pune', name: 'Pune Region', radius_km: 40, center_latitude: 18.5204, center_longitude: 73.8567 },
      { id: 'terr-delhi', name: 'Delhi Region', radius_km: 60, center_latitude: 28.6139, center_longitude: 77.2090 },
      { id: 'terr-bangalore', name: 'Bangalore Region', radius_km: 45, center_latitude: 12.9716, center_longitude: 77.5946 },
      { id: 'terr-hyderabad', name: 'Hyderabad Region', radius_km: 35, center_latitude: 17.3850, center_longitude: 78.4867 }
    ];

    try {
      // Try to load real data first, catching errors to ensure Promise.all resolves
      let [usersData, territoriesData, alertsData] = await Promise.all([
        User.list().catch(() => []),
        Territory.list().catch(() => []),
        GeofenceAlert.list().catch(() => [])
      ]);

      // Combine sample data with any real data, filtering out duplicates by ID
      const combinedUsers = [...sampleUsers, ...usersData.filter(u => !sampleUsers.some(su => su.id === u.id))];
      const combinedTerritories = [...sampleTerritories, ...territoriesData.filter(t => !sampleTerritories.some(st => st.id === t.id))];

      setUsers(combinedUsers);
      setTerritories(combinedTerritories);
      setAlerts(alertsData || []);
      // Placeholder for annual targets count - could be based on field users
      setAnnualTargetsCount(combinedUsers.filter(u => ['RMM', 'TSM', 'MDO'].includes(u.designation)).length);

    } catch (error) {
      console.error("Error loading super admin data:", error);
      // Even on a critical error, show sample data as a fallback
      setUsers(sampleUsers);
      setTerritories(sampleTerritories);
      setAlerts([]);
      setAnnualTargetsCount(sampleUsers.filter(u => ['RMM', 'TSM', 'MDO'].includes(u.designation)).length);
    }
    setLoading(false);
  };

  const handleTerritoryAssignment = async (userId, territoryId) => {
    try {
      // Simulate API update for sample data
      if (userId.startsWith('sample-')) {
        setUsers(prevUsers => prevUsers.map(u => {
          if (u.id === userId) {
            const assignedTerritory = territories.find(t => t.id === territoryId);
            return {
              ...u,
              territory_id: territoryId === "null" ? null : territoryId, // Set to null if unassigned
              territory: territoryId === "null" ? u.territory : (assignedTerritory ? assignedTerritory.name : u.territory)
            };
          }
          return u;
        }));
      } else {
        await User.update(userId, { territory_id: territoryId });
      }
      loadData(); // Reload data to reflect changes
    } catch (error) {
      console.error("Error assigning territory:", error);
    }
  };

  const handleStatusChange = (userId, newStatus) => {
    const user = users.find(u => u.id === userId);
    setPendingStatusChange({ userId, newStatus, userName: user.full_name });
    setIsConfirmDialogOpen(true);
  };

  const confirmStatusChange = async () => {
    try {
      const { userId, newStatus } = pendingStatusChange;

      if (userId.startsWith('sample-')) {
        setUsers(prevUsers => prevUsers.map(u =>
          u.id === userId ? { ...u, status: newStatus } : u
        ));
      } else {
        await User.update(userId, { status: newStatus });
      }

      setIsConfirmDialogOpen(false);
      setPendingStatusChange(null);
      loadData(); // Reload data to reflect changes
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const handleCreateOrUpdateTerritory = async (territoryData) => {
    try {
      if (editingTerritory) {
        // Simulate API update for sample data
        if (editingTerritory.id.startsWith('terr-')) {
          setTerritories(prevTerritories => prevTerritories.map(t => t.id === editingTerritory.id ? { ...t, ...territoryData } : t));
        } else {
          await Territory.update(editingTerritory.id, territoryData);
        }
      } else {
        // Simulate API create for sample data
        const newId = `terr-${Date.now()}`; // Generate a unique ID for sample data
        setTerritories(prevTerritories => [...prevTerritories, { id: newId, ...territoryData }]);
      }
      setIsTerritoryDialogOpen(false);
      setEditingTerritory(null);
      loadData();
    } catch (error) {
      console.error("Error creating/updating territory:", error);
    }
  };

  const getUserAlerts = (userEmail) => {
    return alerts.filter(alert => alert.mdo_id === userEmail && alert.status === 'pending_review');
  };

  const getDesignationColor = (designation) => {
    const colors = {
      'super_admin': 'bg-red-100 text-red-800 border-red-200',
      'admin': 'bg-purple-100 text-purple-800 border-purple-200',
      'VP_Sales': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Marketing_Head': 'bg-pink-100 text-pink-800 border-pink-200',
      'Managing_Director': 'bg-gray-200 text-gray-800 border-gray-300',
      'CFO': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'CHRO': 'bg-teal-100 text-teal-800 border-teal-200',
      'ZBH': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'RMM': 'bg-blue-100 text-blue-800 border-blue-200',
      'RBH': 'bg-cyan-100 text-cyan-800 border-cyan-200',
      'TSM': 'bg-green-100 text-green-800 border-green-200',
      'MDO': 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[designation] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusColor = (status) => {
    return status === 'active'
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-red-100 text-red-800 border-red-200';
  };

  const formatLastLogin = (loginDate) => {
    if (!loginDate) return 'Never';
    const date = new Date(loginDate);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      if (diffInHours === 0) {
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        return `${diffInMinutes} mins ago`;
      }
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  const requiresGeofencing = (designation) => {
    return ['MDO', 'TSM'].includes(designation);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.territory?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDesignation = filterDesignation === "all" || user.designation === filterDesignation;
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesDesignation && matchesStatus;
  });

  if (loading) {
    return <div className="p-8">Loading user management...</div>;
  }

  return (
    <>
      <Dialog open={isTerritoryDialogOpen} onOpenChange={setIsTerritoryDialogOpen}>
        <div className="p-4 md:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                  <Users className="w-8 h-8 text-red-600" />
                  Super Admin - User Management
                </h1>
                <p className="text-slate-600">Manage all users and system access</p>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-100 text-sm">Total Users</p>
                      <p className="text-3xl font-bold">{users.length}</p>
                    </div>
                    <Users className="w-8 h-8 text-red-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Active Users</p>
                      <p className="text-3xl font-bold">
                        {users.filter(u => u.status === 'active').length}
                      </p>
                    </div>
                    <UserCheck className="w-8 h-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm">Field Users</p>
                      <p className="text-3xl font-bold">
                        {users.filter(u => ['MDO', 'TSM'].includes(u.designation)).length}
                      </p>
                    </div>
                    <Shield className="w-8 h-8 text-orange-200" />
                  </div>
                </CardContent>
              </Card>

              {/* New Card for Annual Targets Module */}
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Annual Targets Overview</p>
                      <p className="text-3xl font-bold">
                        {annualTargetsCount > 0 ? `${annualTargetsCount} Users Targeted` : 'N/A'}
                      </p>
                    </div>
                    <Target className="w-8 h-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Filters */}
            <Card className="bg-white/90 backdrop-blur-sm border-red-100 shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      placeholder="Search users by name, email, or territory..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterDesignation} onValueChange={setFilterDesignation}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by designation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Designations</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="VP_Sales">VP Sales</SelectItem>
                      <SelectItem value="Marketing_Head">Marketing Head</SelectItem>
                      <SelectItem value="Managing_Director">Managing Director</SelectItem>
                      <SelectItem value="CFO">CFO</SelectItem>
                      <SelectItem value="CHRO">CHRO</SelectItem>
                      <SelectItem value="ZBH">ZBH</SelectItem>
                      <SelectItem value="RMM">RMM</SelectItem>
                      <SelectItem value="RBH">RBH</SelectItem>
                      <SelectItem value="TSM">TSM</SelectItem>
                      <SelectItem value="MDO">MDO</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Users Table */}
            <Card className="bg-white/90 backdrop-blur-sm border-red-100 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-600" />
                  All System Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User Details</TableHead>
                        <TableHead>Designation</TableHead>
                        <TableHead>Territory/Region</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => {
                        const userAlerts = getUserAlerts(user.email);
                        const assignedTerritory = territories.find(t => t.id === user.territory_id);
                        const needsGeofencing = requiresGeofencing(user.designation);

                        return (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div>
                                <p className="font-semibold text-slate-900">{user.full_name}</p>
                                <p className="text-sm text-slate-600">{user.email}</p>
                                <p className="text-xs text-slate-500">ID: {user.employee_id}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getDesignationColor(user.designation)}>
                                {(user.designation || '').replace('_', ' ')}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium text-slate-700">{user.territory || 'Not assigned'}</p>
                                {needsGeofencing && (
                                  <>
                                    {assignedTerritory ? (
                                      <p className="text-xs text-green-600">
                                        ✓ Geofence: {assignedTerritory.radius_km}km radius
                                      </p>
                                    ) : (
                                      <p className="text-xs text-orange-600">⚠ Geofence: Not configured</p>
                                    )}
                                    {userAlerts.length > 0 && (
                                      <Badge className="bg-orange-100 text-orange-800 border-orange-200 mt-1">
                                        {userAlerts.length} Alert{userAlerts.length > 1 ? 's' : ''}
                                      </Badge>
                                    )}
                                  </>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getStatusColor(user.status)}>
                                {user.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-sm text-slate-600">
                                <Calendar className="w-3 h-3" />
                                {user.join_date}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-sm text-slate-600">
                                <Clock className="w-3 h-3" />
                                {formatLastLogin(user.last_login)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatusChange(
                                    user.id,
                                    user.status === 'active' ? 'inactive' : 'active'
                                  )}
                                  className={user.status === 'active' ? 'text-red-600 border-red-200' : 'text-green-600 border-green-200'}
                                >
                                  {user.status === 'active' ? (
                                    <>
                                      <UserX className="w-3 h-3 mr-1" />
                                      Deactivate
                                    </>
                                  ) : (
                                    <>
                                      <UserCheck className="w-3 h-3 mr-1" />
                                      Activate
                                    </>
                                  )}
                                </Button>
                                {needsGeofencing && (
                                  <Select
                                    value={user.territory_id || ""}
                                    onValueChange={(value) => handleTerritoryAssignment(user.id, value === "null" ? null : value)}
                                  >
                                    <SelectTrigger className="w-32">
                                      <SelectValue placeholder="Territory" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="null">Unassign</SelectItem>
                                      {territories.map(territory => (
                                        <SelectItem key={territory.id} value={territory.id}>
                                          {territory.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Territory Dialog Content - Removed */}

        {/* Confirmation Dialog for Status Change */}
        <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Status Change</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-slate-600">
                Are you sure you want to {pendingStatusChange?.newStatus === 'active' ? 'activate' : 'deactivate'} user{' '}
                <strong>{pendingStatusChange?.userName}</strong>?
              </p>
              {pendingStatusChange?.newStatus === 'inactive' && (
                <p className="text-red-600 text-sm mt-2">
                  ⚠ This user will lose access to the system immediately.
                </p>
              )}
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={confirmStatusChange}
                className={pendingStatusChange?.newStatus === 'active' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
              >
                Confirm {pendingStatusChange?.newStatus === 'active' ? 'Activation' : 'Deactivation'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </Dialog>
    </>
  );
}

// Territory Form Component
function TerritoryForm({ territory, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(territory || {
    name: "",
    center_latitude: "",
    center_longitude: "",
    radius_km: ""
  });

  // Update form data if 'territory' prop changes (e.g., when editing a different territory)
  useEffect(() => {
    setFormData(territory ? {
      name: territory.name || "",
      center_latitude: territory.center_latitude?.toString() || "",
      center_longitude: territory.center_longitude?.toString() || "",
      radius_km: territory.radius_km?.toString() || ""
    } : {
      name: "",
      center_latitude: "",
      center_longitude: "",
      radius_km: ""
    });
  }, [territory]);

  // Predefined locations with coordinates
  const predefinedLocations = [
    { name: "Mumbai Region", lat: 19.0760, lng: 72.8777 },
    { name: "Delhi Region", lat: 28.6139, lng: 77.2090 },
    { name: "Bangalore Region", lat: 12.9716, lng: 77.5946 },
    { name: "Chennai Region", lat: 13.0827, lng: 80.2707 },
    { name: "Kolkata Region", lat: 22.5726, lng: 88.3639 },
    { name: "Hyderabad Region", lat: 17.3850, lng: 78.4867 },
    { name: "Pune Region", lat: 18.5204, lng: 73.8567 },
    { name: "Ahmedabad Region", lat: 23.0225, lng: 72.5714 },
    { name: "Jaipur Region", lat: 26.9124, lng: 75.7873 },
    { name: "Lucknow Region", lat: 26.8467, lng: 80.9462 },
    { name: "Kanpur Region", lat: 26.4499, lng: 80.3319 },
    { name: "Nagpur Region", lat: 21.1458, lng: 79.0882 },
    { name: "Indore Region", lat: 22.7196, lng: 75.8577 },
    { name: "Bhopal Region", lat: 23.2599, lng: 77.4126 },
    { name: "Visakhapatnam Region", lat: 17.6868, lng: 83.2185 },
    { name: "Patna Region", lat: 25.5941, lng: 85.1376 },
    { name: "Vadodara Region", lat: 22.3072, lng: 73.1812 },
    { name: "Ludhiana Region", lat: 30.9010, lng: 75.8573 },
    { name: "Agra Region", lat: 27.1767, lng: 78.0081 },
    { name: "Nashik Region", lat: 19.9975, lng: 73.7898 }
  ];

  const handleLocationSelect = (locationName) => {
    const location = predefinedLocations.find(loc => loc.name === locationName);
    if (location) {
      setFormData(prev => ({
        ...prev,
        name: locationName,
        center_latitude: location.lat.toString(),
        center_longitude: location.lng.toString()
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      center_latitude: formData.center_latitude ? parseFloat(formData.center_latitude) : null,
      center_longitude: formData.center_longitude ? parseFloat(formData.center_longitude) : null,
      radius_km: formData.radius_km ? parseFloat(formData.radius_km) : null
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Select Territory from Predefined Locations
          </label>
          <Select onValueChange={handleLocationSelect} value={formData.name || ""}>
            <SelectTrigger className="bg-white border-slate-200">
              <SelectValue placeholder="Choose a location..." />
            </SelectTrigger>
            <SelectContent>
              {predefinedLocations.map(location => (
                <SelectItem key={location.name} value={location.name}>
                  {location.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="text-center text-sm text-slate-500">
          OR manually enter details below
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Territory Name
          </label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="e.g., Mumbai Region"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Radius (km) - Optional for Geofencing
          </label>
          <Input
            type="number"
            value={formData.radius_km}
            onChange={(e) => setFormData({...formData, radius_km: e.target.value})}
            placeholder="e.g., 25"
            min="0"
          />
          <p className="text-xs text-slate-500 mt-1">Leave empty if no geofencing needed</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Center Latitude - Optional
          </label>
          <Input
            type="number"
            step="any"
            value={formData.center_latitude}
            onChange={(e) => setFormData({...formData, center_latitude: e.target.value})}
            placeholder="e.g., 19.0760"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Center Longitude - Optional
          </label>
          <Input
            type="number"
            step="any"
            value={formData.center_longitude}
            onChange={(e) => setFormData({...formData, center_longitude: e.target.value})}
            placeholder="e.g., 72.8777"
          />
        </div>
      </div>

      <div className="bg-blue-50 p-3 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>Note:</strong> Only users with radius and coordinates will have geofencing enabled.
          Users assigned to territories without these details will not be tracked.
        </p>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-red-600 hover:bg-red-700">
          {territory ? 'Update' : 'Create'} Territory
        </Button>
      </div>
    </form>
  );
}

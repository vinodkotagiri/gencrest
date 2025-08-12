
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { ActivityCategory } from "@/api/entities"; // New import
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, Save, X } from "lucide-react";

export default function TaskForm({ task, onSubmit, onCancel, userRole, clients }) {
  const [formData, setFormData] = useState(task || {
    title: "",
    task_type: "farmer_meeting",
    activity_category: "", // New field
    activity_head: "", // New field
    assigned_to_mdo_id: "",
    client_id: "",
    target_date: "",
    priority: "medium",
    description: "",
    subtasks: "",
    tsm_remarks: ""
  });
  
  const [mdoUsers, setMdoUsers] = useState([]);
  const [activityCategories, setActivityCategories] = useState([]); // New state, holds all activities
  const [groupedActivities, setGroupedActivities] = useState({}); // New state, holds activities grouped by category
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (["TSM", "RBH", "RMM", "ZBH", "admin", "super_admin"].includes(userRole)) {
      loadMDOUsers();
      loadActivityCategories(); // New call
    }
  }, [userRole]);

  // Removed useEffect that was updating filteredHeads, as groupedActivities now handles this.
  // The 'filteredHeads' state variable is also removed.

  const loadMDOUsers = async () => {
    try {
      const users = await User.filter({ designation: "MDO" });
      setMdoUsers(users);
    } catch (error) {
      console.error("Error loading MDO users:", error);
    }
  };

  // New function to load activity categories
  const loadActivityCategories = async () => {
    try {
      const categories = await ActivityCategory.list();
      setActivityCategories(categories); // Store the flat list
      
      // Group activities by category
      const grouped = categories.reduce((acc, activity) => {
        const category = activity.category;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(activity);
        return acc;
      }, {});
      setGroupedActivities(grouped); // Store the grouped list
    } catch (error) {
      console.error("Error loading activity categories:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Ensure client_id is null if empty string
    const dataToSubmit = {
      ...formData,
      client_id: formData.client_id === "" ? null : formData.client_id,
      // Ensure activity_category and activity_head are null/empty if task_type doesn't require them
      activity_category: (['farmer_meeting', 'local_activity'].includes(formData.task_type)) ? formData.activity_category : "",
      activity_head: (['farmer_meeting', 'local_activity'].includes(formData.task_type)) ? formData.activity_head : "",
    };
    await onSubmit(dataToSubmit);
    setLoading(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // New function to handle category change and reset head
  const handleCategoryChange = (category) => {
    setFormData(prev => ({
      ...prev,
      activity_category: category,
      activity_head: "" // Reset head when category changes
    }));
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <Target className="w-5 h-5 text-blue-600" />
          {task ? "Edit Task" : "Assign New Task"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter task title"
                required
                className="bg-white border-slate-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="task_type">Task Type *</Label>
              <Select
                value={formData.task_type}
                onValueChange={(value) => handleInputChange("task_type", value)}
              >
                <SelectTrigger className="bg-white border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="farmer_meeting">Farmer Meeting</SelectItem>
                  <SelectItem value="distributor_visit">Distributor Visit</SelectItem>
                  <SelectItem value="retailer_visit">Retailer Visit</SelectItem>
                  <SelectItem value="local_activity">Local Activity</SelectItem>
                  <SelectItem value="sales_target">Sales Target</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* ACTIVITY CATEGORY & HEAD - Show for farmer meetings and local activities */}
            {(['farmer_meeting', 'local_activity'].includes(formData.task_type)) && (
              <div className="col-span-1 md:col-span-2 bg-yellow-50 p-4 rounded-lg border border-yellow-200 space-y-4">
                <Label className="text-base font-semibold text-yellow-900">
                  Activity Classification
                </Label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="activity_category">Activity Category *</Label>
                    <Select
                      value={formData.activity_category}
                      onValueChange={handleCategoryChange}
                      required={['farmer_meeting', 'local_activity'].includes(formData.task_type)}
                    >
                      <SelectTrigger className="bg-white border-yellow-200">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(groupedActivities).map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="activity_head">Activity Head *</Label>
                    <Select
                      value={formData.activity_head}
                      onValueChange={(value) => handleInputChange("activity_head", value)}
                      required={['farmer_meeting', 'local_activity'].includes(formData.task_type)}
                      disabled={!formData.activity_category}
                    >
                      <SelectTrigger className="bg-white border-yellow-200">
                        <SelectValue placeholder="Select activity head" />
                      </SelectTrigger>
                      <SelectContent>
                        {(groupedActivities[formData.activity_category] || []).map(activity => (
                          <SelectItem key={activity.id} value={activity.head}>
                            {activity.head}
                            {activity.max_participants && (
                              <span className="text-xs text-slate-500 ml-2">
                                (Max: {activity.max_participants})
                              </span>
                            )}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formData.activity_head && (
                      <p className="text-xs text-yellow-600 mt-1">
                        {activityCategories.find(a => a.head === formData.activity_head)?.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="client_id">Related Client</Label>
              <Select
                value={formData.client_id || ""} // Use "" for null or undefined client_id
                onValueChange={(value) => handleInputChange("client_id", value === "" ? null : value)}
              >
                <SelectTrigger className="bg-white border-slate-200">
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>None</SelectItem> {/* Value "" maps to null */}
                  {clients && clients.map(client => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.client_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assigned_to_mdo_id">Assign to MDO *</Label>
              <Select
                value={formData.assigned_to_mdo_id}
                onValueChange={(value) => handleInputChange("assigned_to_mdo_id", value)}
              >
                <SelectTrigger className="bg-white border-slate-200">
                  <SelectValue placeholder="Select MDO" />
                </SelectTrigger>
                <SelectContent>
                  {mdoUsers.map(mdo => (
                    <SelectItem key={mdo.id} value={mdo.email}>
                      {mdo.full_name} ({mdo.territory})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="target_date">Target Date *</Label>
              <Input
                id="target_date"
                type="date"
                value={formData.target_date}
                onChange={(e) => handleInputChange("target_date", e.target.value)}
                required
                className="bg-white border-slate-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleInputChange("priority", value)}
              >
                <SelectTrigger className="bg-white border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Task Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe the task in detail..."
              className="h-24 bg-white border-slate-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtasks">Subtasks / Checklist</Label>
            <Textarea
              id="subtasks"
              value={formData.subtasks}
              onChange={(e) => handleInputChange("subtasks", e.target.value)}
              placeholder="• Meet 5 farmers&#10;• Collect feedback&#10;• Take photos"
              className="h-20 bg-white border-slate-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tsm_remarks">TSM Remarks</Label>
            <Textarea
              id="tsm_remarks"
              value={formData.tsm_remarks}
              onChange={(e) => handleInputChange("tsm_remarks", e.target.value)}
              placeholder="Additional instructions or remarks..."
              className="h-20 bg-white border-slate-200"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {task ? "Update" : "Assign"} Task
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

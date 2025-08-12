
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calendar,
  Clock,
  Edit,
  CheckCircle,
  User,
  Target,
  Star,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import TaskExecutionModal from "@/components/tasks/TaskExecutionModal"; // Assuming this path for the new modal component

export default function TaskList({ tasks, filters, userRole, userEmail, onEdit, onComplete, onShowForm, clients, skus }) {
  const [completingTask, setCompletingTask] = React.useState(null);
  const [completionNotes, setCompletionNotes] = React.useState("");
  const [executingTask, setExecutingTask] = React.useState(null);

  const filteredTasks = tasks.filter(task => {
    // MDOs only see tasks assigned to them
    if (userRole === "MDO" && task.assigned_to_mdo_id !== userEmail) {
      return false;
    }

    const statusMatch = filters.status === "all" || task.status === filters.status;
    const typeMatch = filters.task_type === "all" || task.task_type === filters.task_type;  
    const priorityMatch = filters.priority === "all" || task.priority === filters.priority;
    const mdoMatch = filters.mdo_id === "all" || task.assigned_to_mdo_id === filters.mdo_id;
    
    return statusMatch && typeMatch && priorityMatch && mdoMatch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTaskTypeIcon = (type) => {
    switch (type) {
      case 'farmer_meeting':
        return '👨‍🌾';
      case 'distributor_visit':
        return '🏢';
      case 'retailer_visit':
        return '🏪';
      case 'local_activity':
        return '🎯';
      case 'sales_target':
        return '💰';
      default:
        return '📋';
    }
  };

  const handleCompleteTask = async (taskId) => {
    await onComplete(taskId, completionNotes);
    setCompletingTask(null);
    setCompletionNotes("");
  };

  const handleExecuteTask = (task) => {
    setExecutingTask(task);
  };

  const handleTaskExecution = async (taskId, executionData) => {
    try {
      // Create detailed completion notes from execution data
      let notes = `Task executed successfully!\n\n`;
      
      if (executionData.startTime && executionData.endTime) {
        notes += `⏱️ TIMING:\n`;
        notes += `• Start: ${new Date(executionData.startTime).toLocaleString()}\n`;
        notes += `• End: ${new Date(executionData.endTime).toLocaleString()}\n`;
        notes += `• Duration: ${executionData.duration} minutes\n\n`;
      }

      if (executionData.stockAudit && executionData.stockAudit.length > 0) {
        notes += `📦 STOCK AUDIT RESULTS:\n`;
        executionData.stockAudit.forEach(item => {
          notes += `• ${item.product_name}: Original ${item.original_stock} → Current ${item.current_stock} (Diff: ${item.difference}) ${item.verified ? '✓' : '✗'}\n`;
        });
        notes += `\n`;
      }

      if (executionData.photos && executionData.photos.length > 0) {
        notes += `📸 DOCUMENTATION:\n`;
        notes += `• Photos captured: ${executionData.photos.length}\n`;
      }

      if (executionData.signatures && executionData.signatures.length > 0) {
        notes += `• Signatures collected: ${executionData.signatures.map(s => s.type).join(', ')}\n`;
      }

      if (executionData.location) {
        notes += `• GPS Location: ${executionData.location.latitude.toFixed(6)}, ${executionData.location.longitude.toFixed(6)}\n\n`;
      }

      if (executionData.completionNotes) {
        notes += `📝 ADDITIONAL NOTES:\n${executionData.completionNotes}`;
      }

      await onComplete(taskId, notes);
      setExecutingTask(null);
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const getPointsForTask = (taskType) => {
    const points = {
      farmer_meeting: 50,
      distributor_visit: 40,
      retailer_visit: 30,
      local_activity: 60,
      sales_target: 100
    };
    return points[taskType] || 25;
  };

  if (filteredTasks.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
        <CardContent className="text-center py-12">
          <Target className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 mb-2">No tasks found</h3>
          <p className="text-slate-500 mb-4">
            {userRole === "MDO" ? 
              "No tasks assigned to you yet" : 
              "Start by assigning tasks to your team"
            }
          </p>
          {userRole !== "MDO" && (
            <Button onClick={() => onShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
              <Target className="w-4 h-4 mr-2" />
              Assign First Task
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <Card key={task.id} className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl">{getTaskTypeIcon(task.task_type)}</span>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{task.title}</h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="outline" className={getStatusColor(task.status)}>
                          {task.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline" className={getPriorityColor(task.priority)}>
                          {task.priority} priority
                        </Badge>
                        <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                          {task.task_type.replace('_', ' ')}
                        </Badge>
                        {userRole === "MDO" && (
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                            <Star className="w-3 h-3 mr-1" />
                            {getPointsForTask(task.task_type)} points
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">
                        Due: {format(new Date(task.target_date), "MMM d, yyyy")}
                      </span>
                    </div>
                    
                    {userRole !== "MDO" && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <User className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">Assigned to: {task.assigned_to_mdo_id}</span>
                      </div>
                    )}
                  </div>

                  {task.description && (
                    <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-700 font-medium mb-2">Description:</p>
                      <p className="text-sm text-slate-700">{task.description}</p>
                    </div>
                  )}

                  {task.subtasks && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700 font-medium mb-2">Subtasks:</p>
                      <pre className="text-sm text-blue-700 whitespace-pre-wrap">{task.subtasks}</pre>
                    </div>
                  )}

                  {task.tsm_remarks && (
                    <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm text-purple-700 font-medium mb-2">TSM Remarks:</p>
                      <p className="text-sm text-purple-700">{task.tsm_remarks}</p>
                    </div>
                  )}

                  {task.completion_notes && task.status === 'completed' && (
                    <div className="mb-4 p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-700 font-medium mb-2">Completion Notes:</p>
                      <p className="text-sm text-green-700">{task.completion_notes}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                <div className="text-sm text-slate-500">
                  Created {format(new Date(task.created_date), "MMM d, yyyy")}
                </div>
                
                <div className="flex gap-2">
                  {userRole === "MDO" && task.status !== 'completed' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleExecuteTask(task)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Execute Task
                      </Button>
                    </>
                  )}
                  
                  {userRole !== "MDO" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        onEdit(task);
                        onShowForm(true);
                      }}
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Task Execution Modal */}
      {executingTask && (
        <TaskExecutionModal
          task={executingTask}
          isOpen={!!executingTask}
          onClose={() => setExecutingTask(null)}
          onComplete={handleTaskExecution}
          clients={clients} 
          skus={skus} 
        />
      )}
    </>
  );
}

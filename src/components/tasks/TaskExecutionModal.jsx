import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Camera, 
  Clock, 
  CheckCircle, 
  Package, 
  Upload, 
  Navigation,
  FileSignature,
  Save,
  Timer,
  Play,
  Square
} from "lucide-react";

export default function TaskExecutionModal({ task, isOpen, onClose, onComplete, clients, skus }) {
  const [executionData, setExecutionData] = useState({
    startTime: null,
    endTime: null,
    stockAudit: [],
    photos: [],
    signatures: [],
    location: null,
    completionNotes: "",
    isInProgress: false
  });

  const [currentStockInputs, setCurrentStockInputs] = useState({});

  // Get client for this task
  const getTaskClient = () => {
    if (task?.task_type === 'distributor_visit') {
      return clients?.find(c => c.client_type === 'distributor') || clients?.[0];
    }
    return clients?.[0];
  };

  const taskClient = getTaskClient();

  // Initialize stock audit from client's initial stock
  useEffect(() => {
    if (taskClient?.initial_stock && skus) {
      const stockAudit = taskClient.initial_stock.map(stock => {
        const sku = skus.find(s => s.id === stock.sku_id || s.sku === stock.sku_id);
        return {
          sku_id: stock.sku_id,
          product_name: sku?.product_name || `Product ${stock.sku_id}`,
          original_stock: stock.quantity || 0,
          current_stock: 0,
          difference: 0,
          verified: false
        };
      });
      setExecutionData(prev => ({ ...prev, stockAudit }));
    } else {
      // Default SKUs if no client data
      const defaultStockAudit = [
        { sku_id: 'SKU001', product_name: 'Premium Cotton Seeds', original_stock: 5000, current_stock: 0, difference: 0, verified: false },
        { sku_id: 'SKU002', product_name: 'BioGrow Fertilizer', original_stock: 3000, current_stock: 0, difference: 0, verified: false },
        { sku_id: 'SKU003', product_name: 'CropShield Pesticide', original_stock: 2000, current_stock: 0, difference: 0, verified: false }
      ];
      setExecutionData(prev => ({ ...prev, stockAudit: defaultStockAudit }));
    }
  }, [taskClient, skus]);

  const handleStartTask = () => {
    const now = new Date();
    setExecutionData(prev => ({
      ...prev,
      startTime: now.toISOString(),
      isInProgress: true
    }));
    
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setExecutionData(prev => ({
            ...prev,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
          }));
        },
        (error) => console.log("Location error:", error)
      );
    }
  };

  const handleEndTask = () => {
    const now = new Date();
    setExecutionData(prev => ({
      ...prev,
      endTime: now.toISOString(),
      isInProgress: false
    }));
  };

  const handleStockUpdate = (index, field, value) => {
    const newStockAudit = [...executionData.stockAudit];
    newStockAudit[index] = {
      ...newStockAudit[index],
      [field]: field === 'current_stock' ? parseInt(value) || 0 : value
    };
    
    if (field === 'current_stock') {
      newStockAudit[index].difference = newStockAudit[index].original_stock - newStockAudit[index].current_stock;
    }
    
    setExecutionData(prev => ({ ...prev, stockAudit: newStockAudit }));
  };

  const handlePhotoCapture = () => {
    // Simulate photo capture
    const photoId = `photo_${Date.now()}`;
    setExecutionData(prev => ({
      ...prev,
      photos: [...prev.photos, {
        id: photoId,
        filename: `warehouse_${photoId}.jpg`,
        timestamp: new Date().toISOString()
      }]
    }));
    alert('Photo captured successfully!');
  };

  const handleSignatureCapture = (type) => {
    // Simulate signature capture
    const signature = prompt(`Capture ${type} signature (In production, this would be a signature pad):`);
    if (signature) {
      setExecutionData(prev => ({
        ...prev,
        signatures: [...prev.signatures, {
          type,
          signature,
          timestamp: new Date().toISOString()
        }]
      }));
    }
  };

  const handleCompleteTask = () => {
    if (!executionData.startTime) {
      alert('Please start the task first');
      return;
    }
    
    if (!executionData.endTime) {
      handleEndTask();
    }

    const taskDuration = executionData.endTime ? 
      Math.round((new Date(executionData.endTime) - new Date(executionData.startTime)) / (1000 * 60)) : 0;

    const completionData = {
      ...executionData,
      duration: taskDuration,
      completedAt: new Date().toISOString()
    };

    onComplete(task.id, completionData);
    onClose();
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Not started';
    return new Date(timeString).toLocaleTimeString();
  };

  const getDuration = () => {
    if (!executionData.startTime) return '0 min';
    const endTime = executionData.endTime ? new Date(executionData.endTime) : new Date();
    const startTime = new Date(executionData.startTime);
    return Math.round((endTime - startTime) / (1000 * 60)) + ' min';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            Execute Task: {task?.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Task Timer */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-semibold">Task Timer</p>
                    <div className="text-sm text-slate-600">
                      <span>Start: {formatTime(executionData.startTime)} | </span>
                      <span>End: {formatTime(executionData.endTime)} | </span>
                      <span>Duration: {getDuration()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!executionData.startTime ? (
                    <Button onClick={handleStartTask} className="bg-green-600 hover:bg-green-700">
                      <Play className="w-4 h-4 mr-2" />
                      Start Task
                    </Button>
                  ) : !executionData.endTime ? (
                    <Button onClick={handleEndTask} variant="outline">
                      <Square className="w-4 h-4 mr-2" />
                      End Task
                    </Button>
                  ) : (
                    <Badge className="bg-green-100 text-green-800">Task Completed</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stock Audit Section */}
          {task?.task_type === 'distributor_visit' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-purple-600" />
                  Stock Audit - {taskClient?.client_name || 'Distributor'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {executionData.stockAudit.map((item, index) => (
                  <div key={item.sku_id} className="grid grid-cols-6 gap-4 items-center p-3 bg-slate-50 rounded-lg">
                    <div className="col-span-2">
                      <p className="font-medium">{item.product_name}</p>
                      <p className="text-sm text-slate-600">SKU: {item.sku_id}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-slate-600">Original</p>
                      <p className="font-bold text-blue-600">{item.original_stock}</p>
                    </div>
                    <div className="text-center">
                      <Label className="text-sm text-slate-600">Current Stock</Label>
                      <Input
                        type="number"
                        value={item.current_stock}
                        onChange={(e) => handleStockUpdate(index, 'current_stock', e.target.value)}
                        className="text-center mt-1"
                        placeholder="Enter current"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-slate-600">Difference</p>
                      <p className={`font-bold ${item.difference > 0 ? 'text-red-600' : item.difference < 0 ? 'text-green-600' : 'text-slate-600'}`}>
                        {item.difference > 0 ? `-${item.difference}` : item.difference}
                      </p>
                    </div>
                    <div className="text-center">
                      <Button
                        size="sm"
                        variant={item.verified ? "default" : "outline"}
                        onClick={() => handleStockUpdate(index, 'verified', !item.verified)}
                        className={item.verified ? "bg-green-600 hover:bg-green-700" : ""}
                      >
                        {item.verified ? <CheckCircle className="w-4 h-4" /> : "Verify"}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Documentation Section */}
          <Card>
            <CardHeader>
              <CardTitle>Documentation & Verification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Photo Capture */}
                <Button 
                  variant="outline" 
                  onClick={handlePhotoCapture}
                  className="h-20 flex-col"
                >
                  <Camera className="w-6 h-6 mb-2" />
                  Capture Photo
                  {executionData.photos.length > 0 && (
                    <span className="text-xs text-green-600">
                      {executionData.photos.length} photo(s)
                    </span>
                  )}
                </Button>

                {/* Distributor Signature */}
                <Button 
                  variant="outline" 
                  onClick={() => handleSignatureCapture('distributor')}
                  className="h-20 flex-col"
                >
                  <FileSignature className="w-6 h-6 mb-2" />
                  Distributor E-Sign
                  {executionData.signatures.some(s => s.type === 'distributor') && (
                    <span className="text-xs text-green-600">✓ Signed</span>
                  )}
                </Button>

                {/* MDO Signature */}
                <Button 
                  variant="outline" 
                  onClick={() => handleSignatureCapture('mdo')}
                  className="h-20 flex-col"
                >
                  <Upload className="w-6 h-6 mb-2" />
                  MDO E-Sign
                  {executionData.signatures.some(s => s.type === 'mdo') && (
                    <span className="text-xs text-green-600">✓ Signed</span>
                  )}
                </Button>
              </div>

              {/* Location Status */}
              {executionData.location && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <Navigation className="w-4 h-4" />
                  Location captured: {executionData.location.latitude.toFixed(6)}, {executionData.location.longitude.toFixed(6)}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Completion Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Completion Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={executionData.completionNotes}
                onChange={(e) => setExecutionData(prev => ({ ...prev, completionNotes: e.target.value }))}
                placeholder="Add detailed notes about the task completion, findings, next steps..."
                className="h-24"
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleCompleteTask}
              disabled={!executionData.startTime}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Complete Task
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
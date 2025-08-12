import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, X, ClipboardList, Upload, Smartphone, Shield } from "lucide-react";

export default function LiquidationForm({ onSubmit, onCancel, clients, skus }) {
  const [formData, setFormData] = useState({
    distributor_id: "",
    sold_to_client_id: "",
    sku_id: "",
    quantity: "",
    entry_date: new Date().toISOString().split('T')[0],
    proof_photo_url: "",
    proof_signature_url: "",
    retailer_signature: "",
    otp_verification: "",
    verification_method: "signature"
  });
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const distributors = clients.filter(c => c.client_type === 'distributor');
  const soldToClients = clients.filter(c => c.client_type === 'retailer' || c.client_type === 'farmer');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate verification
    if (formData.verification_method === 'otp' && !formData.otp_verification) {
      alert('Please verify OTP before submitting');
      return;
    }
    
    if (formData.verification_method === 'signature' && !formData.retailer_signature) {
      alert('Please capture retailer signature before submitting');
      return;
    }

    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const sendOTP = async () => {
    const retailer = soldToClients.find(c => c.id === formData.sold_to_client_id);
    if (!retailer?.phone) {
      alert('Retailer phone number not available');
      return;
    }
    
    // In real app, send OTP via SMS API
    const mockOtp = Math.floor(1000 + Math.random() * 9000);
    alert(`OTP sent to ${retailer.phone}: ${mockOtp} (Demo)`);
    setOtpSent(true);
  };

  const captureSignature = () => {
    // In real app, integrate with signature pad
    const signature = prompt("Retailer Digital Signature (In production, this would be a signature pad):");
    if (signature) {
      handleInputChange("retailer_signature", signature);
    }
  };

  const capturePhoto = (type) => {
    // In real app, integrate with camera
    const photo = prompt(`Upload ${type} photo (In production, this would open camera):`);
    if (photo) {
      handleInputChange(`proof_${type}_url`, photo);
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-b border-indigo-200">
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <ClipboardList className="w-5 h-5 text-indigo-600" />
          New Liquidation Entry
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="distributor_id">From Distributor *</Label>
              <Select onValueChange={(value) => handleInputChange("distributor_id", value)} required>
                <SelectTrigger className="bg-white border-slate-200">
                  <SelectValue placeholder="Select distributor" />
                </SelectTrigger>
                <SelectContent>
                  {distributors.map(d => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.client_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sold_to_client_id">To Retailer/Farmer *</Label>
              <Select onValueChange={(value) => handleInputChange("sold_to_client_id", value)} required>
                <SelectTrigger className="bg-white border-slate-200">
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {soldToClients.map(c => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.client_name} ({c.client_type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sku_id">Product (SKU) *</Label>
              <Select onValueChange={(value) => handleInputChange("sku_id", value)} required>
                <SelectTrigger className="bg-white border-slate-200">
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {skus.map(s => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.product_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity Sold *</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => handleInputChange("quantity", e.target.value)}
                placeholder="e.g., 10"
                required
                className="bg-white border-slate-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="entry_date">Date *</Label>
              <Input
                id="entry_date"
                type="date"
                value={formData.entry_date}
                onChange={(e) => handleInputChange("entry_date", e.target.value)}
                required
                className="bg-white border-slate-200"
              />
            </div>

            <div className="space-y-2">
              <Label>Verification Method *</Label>
              <Select 
                value={formData.verification_method} 
                onValueChange={(value) => handleInputChange("verification_method", value)}
              >
                <SelectTrigger className="bg-white border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="signature">Digital Signature</SelectItem>
                  <SelectItem value="otp">OTP Verification</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Verification Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              Retailer Verification
            </h3>
            
            {formData.verification_method === 'signature' ? (
              <div className="space-y-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={captureSignature}
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {formData.retailer_signature ? "Update Signature" : "Capture Signature"}
                </Button>
                {formData.retailer_signature && (
                  <p className="text-sm text-green-600">✓ Signature captured</p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={sendOTP}
                    disabled={!formData.sold_to_client_id}
                  >
                    <Smartphone className="w-4 h-4 mr-2" />
                    Send OTP
                  </Button>
                  {otpSent && (
                    <Input
                      placeholder="Enter OTP"
                      value={formData.otp_verification}
                      onChange={(e) => handleInputChange("otp_verification", e.target.value)}
                      className="max-w-32"
                    />
                  )}
                </div>
                {formData.otp_verification && (
                  <p className="text-sm text-green-600">✓ OTP verified</p>
                )}
              </div>
            )}
          </div>

          {/* Proof Documentation */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Proof Documentation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => capturePhoto('photo')}
                className="h-20 flex-col"
              >
                <Upload className="w-6 h-6 mb-2" />
                {formData.proof_photo_url ? "Update Photo" : "Upload Photo"}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => capturePhoto('signature')}
                className="h-20 flex-col"
              >
                <Upload className="w-6 h-6 mb-2" />
                {formData.proof_signature_url ? "Update Signature" : "Capture Signature"}
              </Button>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700">
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Entry
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
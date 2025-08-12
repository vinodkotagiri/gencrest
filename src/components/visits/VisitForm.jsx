
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin, Save, X, Camera, Upload, Navigation, Video, Mic, Users, Hash, ListChecks, UserPlus, Trash2 } from "lucide-react";
import { User } from "@/api/entities";
import { Territory } from "@/api/entities";
import { GeofenceAlert } from "@/api/entities";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuditTrailTab from "@/components/shared/AuditTrailTab";
import { History } from "lucide-react";
import { ActivityCategory } from "@/api/entities";


export default function VisitForm({ visit, clients, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(visit || {
    visit_purpose: "", // This will now store the 'activity_head'
    activity_category: "", // This will store the derived 'activity_category'
    client_id: "",
    visit_date: new Date().toISOString().split('T')[0],
    visit_time: new Date().toTimeString().slice(0, 5),
    location: "",
    notes: "",
    status: "planned",
    latitude: null,
    longitude: null,
    expected_attendees: 0, // For farmer meetings
    meeting_topic: "", // For farmer meetings
    attendee_capture_method: "head_count", // new field
    expected_attendee_list: [], // new field - will store farmer details
    photos: [],
    videos: [],
    voice_notes: [],
    signature_url: "", // Keep MDO signature only
    product_inputs_given: []
  });

  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activityCategories, setActivityCategories] = useState([]);
  const [groupedActivities, setGroupedActivities] = useState({});

  const [expectedFarmers, setExpectedFarmers] = useState(
    visit?.expected_attendee_list && visit.expected_attendee_list.length > 0
      ? visit.expected_attendee_list
      : [
          { name: '', mobile: '', farm_ownership: 'own', farm_size: '', remarks: '' }
        ]
  );

  useEffect(() => {
    const fetchUser = async () => {
      const user = await User.me();
      setCurrentUser(user);
    };

    const fetchActivityCategories = async () => {
      try {
        const activities = await ActivityCategory.list();
        setActivityCategories(activities);

        const grouped = activities.reduce((acc, activity) => {
          const category = activity.category;
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(activity);
          return acc;
        }, {});
        setGroupedActivities(grouped);

        // When editing, set the form data from the `visit` prop
        if (visit) {
            setFormData({
                ...visit,
                visit_purpose: visit.visit_purpose || "",
                activity_category: visit.activity_category || ""
            });
            if (visit.activity_category === 'Farmer BTL Engagement') {
                setExpectedFarmers(
                    visit.expected_attendee_list && visit.expected_attendee_list.length > 0
                        ? visit.expected_attendee_list
                        : [{ name: '', mobile: '', farm_ownership: 'own', farm_size: '', remarks: '' }]
                );
            }
        }
      } catch (error) {
        console.error("Error fetching activity categories:", error);
      }
    };

    fetchUser();
    fetchActivityCategories();
  }, [visit]); // Depend on visit to re-run when editing a different visit

  // Haversine formula to calculate distance between two lat/long points
  const getDistanceInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const checkGeofence = async (latitude, longitude) => {
    if (!currentUser || !currentUser.territory_id) {
      console.log("User or territory not defined, skipping geofence check.");
      return { inTerritory: true };
    }
    
    try {
      const territories = await Territory.filter({ id: currentUser.territory_id });
      if (territories.length === 0) {
          console.log("Territory details not found.");
          return { inTerritory: true }; // Fail open if territory not found
      }
      
      const territory = territories[0];
      const distance = getDistanceInKm(
        latitude,
        longitude,
        territory.center_latitude,
        territory.center_longitude
      );

      if (distance > territory.radius_km) {
        return { 
            inTerritory: false, 
            distance,
            territoryName: territory.name 
        };
      }
      
      return { inTerritory: true };
    } catch (error) {
      console.error("Error checking geofence:", error);
      return { inTerritory: true }; // Fail open on error
    }
  };

  // Get current location with geo-tagging
  const getCurrentLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const locationString = `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`;

          const geofenceStatus = await checkGeofence(latitude, longitude);

          if (!geofenceStatus.inTerritory) {
            alert(
              `🔴 GEOFENCE ALERT 🔴\n\nYou appear to be outside your assigned territory (${geofenceStatus.territoryName}). \nDistance: ${geofenceStatus.distance.toFixed(1)} km away. \n\nThis activity will be flagged for manager review.`
            );
            // Create a red flag record
            if (currentUser && currentUser.email && currentUser.reporting_manager) {
                await GeofenceAlert.create({
                    mdo_id: currentUser.email,
                    manager_id: currentUser.reporting_manager,
                    visit_id: visit?.id || "new_visit", // Handle new visits
                    captured_location: locationString,
                    territory_name: geofenceStatus.territoryName,
                    distance_from_territory_km: geofenceStatus.distance,
                });
            } else {
                console.warn("Cannot create geofence alert: currentUser or its properties (email, reporting_manager) are missing.");
            }
          }

          setFormData(prev => ({
            ...prev,
            latitude: latitude,
            longitude: longitude,
            location: prev.location || locationString
          }));
          setLocationLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationLoading(false);
          alert("Unable to get location. Please ensure location services are enabled.");
        }
      );
    } else {
      setLocationLoading(false);
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleCategoryChange = (category) => {
    setFormData(prev => ({
      ...prev,
      activity_category: category,
      visit_purpose: "", // Reset head when category changes
      // Reset client_id if category does not require a client
      client_id: ['Farmer BTL Engagement', 'Internal Meetings'].includes(category) ? "" : prev.client_id,
      // Reset farmer meeting specific fields if not Farmer BTL Engagement
      meeting_topic: category === 'Farmer BTL Engagement' ? prev.meeting_topic : "",
      expected_attendees: category === 'Farmer BTL Engagement' ? prev.expected_attendees : 0,
      attendee_capture_method: category === 'Farmer BTL Engagement' ? prev.attendee_capture_method : 'head_count',
      expected_attendee_list: category === 'Farmer BTL Engagement' ? prev.expected_attendee_list : [],
    }));

    if (category === 'Farmer BTL Engagement') {
        setExpectedFarmers(
            visit?.expected_attendee_list && visit.expected_attendee_list.length > 0
            ? visit.expected_attendee_list
            : [{ name: '', mobile: '', farm_ownership: 'own', farm_size: '', remarks: '' }]
        );
    } else {
        setExpectedFarmers([{ name: '', mobile: '', farm_ownership: 'own', farm_size: '', remarks: '' }]);
    }
  };
  
  // Add new farmer to the expected list
  const addNewFarmer = () => {
    setExpectedFarmers([...expectedFarmers, { 
      name: '', 
      mobile: '', 
      farm_ownership: 'own', 
      farm_size: '', 
      remarks: '' 
    }]);
  };

  // Update farmer details in the list
  const updateFarmer = (index, field, value) => {
    const updated = [...expectedFarmers];
    updated[index] = { ...updated[index], [field]: value };
    setExpectedFarmers(updated);
    
    // Update the count and form data
    const validFarmers = updated.filter(f => f.name.trim() !== '');
    setFormData(prev => ({
      ...prev,
      expected_attendees: validFarmers.length,
      expected_attendee_list: updated
    }));
  };

  // Remove farmer from the list
  const removeFarmer = (index) => {
    if (expectedFarmers.length > 1) { // Keep at least one row
      const updated = expectedFarmers.filter((_, i) => i !== index);
      setExpectedFarmers(updated);
      setFormData(prev => ({
        ...prev,
        expected_attendees: updated.filter(f => f.name.trim() !== '').length,
        expected_attendee_list: updated
      }));
    }
  };

  // Check if current purpose requires a client
  const requiresClient = () => {
    return formData.activity_category === 'Channel BTL Engagement';
  };

  // Check if current purpose supports multiple attendees
  const supportsAttendees = () => {
    return formData.activity_category === 'Farmer BTL Engagement';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Auto-capture timestamp
    const visitData = {
      ...formData,
      timestamp: new Date().toISOString(),
      expected_attendee_list: formData.attendee_capture_method === 'name_list' ? expectedFarmers.filter(f => f.name.trim() !== '') : formData.expected_attendee_list // Pass structured farmers or default list
    };
    
    // Ensure location is captured for completed visits
    if (formData.status === 'completed' && !formData.latitude) {
      if (confirm('Location not captured. Would you like to capture it now?')) {
        getCurrentLocation();
        setLoading(false);
        return;
      }
    }
    
    onSubmit(visitData);
    setLoading(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMediaUpload = (type, e) => {
    const file = e.target.files[0];
    if (file) {
      const mediaUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        [type]: [...(prev[type] || []), {
          url: mediaUrl,
          filename: file.name,
          timestamp: new Date().toISOString()
        }]
      }));
    }
  };

  const handleVoiceRecording = () => {
    if (recording) {
      // Stop recording logic (simplified)
      setRecording(false);
      const mockVoiceNote = {
        url: "mock-voice-note.mp3",
        duration: "2:30",
        timestamp: new Date().toISOString()
      };
      setFormData(prev => ({
        ...prev,
        voice_notes: [...(prev.voice_notes || []), mockVoiceNote]
      }));
    } else {
      // Start recording logic
      setRecording(true);
      // In real app, would use MediaRecorder API
    }
  };

  const handleSignatureCapture = () => {
    const signature = prompt("MDO Digital Signature (In production, this would be a signature pad):");
    if (signature) {
      setFormData(prev => ({
        ...prev,
        signature_url: signature
      }));
    }
  };

  const addProductInput = () => {
    const product = prompt("Product given to client:");
    const quantity = prompt("Quantity:");
    if (product && quantity) {
      setFormData(prev => ({
        ...prev,
        product_inputs_given: [...(prev.product_inputs_given || []), {
          product,
          quantity,
          timestamp: new Date().toISOString()
        }]
      }));
    }
  };

  const predefinedLocations = [
    "Village Bhucho, Sirsa, Haryana",
    "Main Market, Meerut, UP", 
    "Industrial Area, Rohtak, Haryana",
    "Gandhi Chowk, Anand, Gujarat",
    "Kisan Bazaar, Ludhiana, Punjab",
    "Highway Road, Indore, MP",
    "Community Center, Karnal, Haryana",
    "Farmer Field School, Hisar, Haryana",
    "Agricultural University, Ludhiana, Punjab"
  ];

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <MapPin className="w-5 h-5 text-blue-600" />
          {visit ? "Edit Visit" : "New Field Visit"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="details">
          <TabsList className="w-full justify-start rounded-none bg-slate-100 p-0">
            <TabsTrigger value="details" className="px-4 py-3">Visit Details</TabsTrigger>
            {visit?.id && <TabsTrigger value="audit" className="px-4 py-3 flex items-center gap-2"><History className="w-4 h-4" /> Audit Trail</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="details" className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* PRIMARY FIELDS: Activity Category & Head */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Category Dropdown */}
                  <div className="space-y-2">
                    <Label htmlFor="activity_category" className="text-base font-semibold text-blue-900">
                      Activity Category *
                    </Label>
                    <Select
                      value={formData.activity_category}
                      onValueChange={handleCategoryChange}
                      required
                    >
                      <SelectTrigger className="bg-white border-blue-200 mt-2">
                        <SelectValue placeholder="Select a category" />
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

                  {/* Head Dropdown */}
                  <div className="space-y-2">
                    <Label htmlFor="visit_purpose" className="text-base font-semibold text-blue-900">
                      Activity Head *
                    </Label>
                    <Select
                      value={formData.visit_purpose}
                      onValueChange={(value) => handleInputChange("visit_purpose", value)}
                      required
                      disabled={!formData.activity_category}
                    >
                      <SelectTrigger className="bg-white border-blue-200 mt-2">
                        <SelectValue placeholder="Select an activity head" />
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
                  </div>
                </div>
                {formData.visit_purpose && (
                  <p className="text-xs text-blue-600 mt-2">
                    {activityCategories.find(a => a.head === formData.visit_purpose)?.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* CLIENT SELECTION - Only show if purpose requires a client (Channel BTL Engagement) */}
                {requiresClient() && (
                  <div className="space-y-2">
                    <Label htmlFor="client_id">Client *</Label>
                    <Select
                      value={formData.client_id}
                      onValueChange={(value) => handleInputChange("client_id", value)}
                      required={requiresClient()}
                    >
                      <SelectTrigger className="bg-white border-slate-200">
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map(client => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.client_name} ({client.client_type})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* FARMER MEETING SPECIFIC FIELDS - Show for Farmer BTL Engagement */}
                {supportsAttendees() && (
                  <>
                    <div className="space-y-2 col-span-1 md:col-span-2">
                      <Label htmlFor="meeting_topic">Meeting Topic *</Label>
                      <Input
                        id="meeting_topic"
                        value={formData.meeting_topic}
                        onChange={(e) => handleInputChange("meeting_topic", e.target.value)}
                        placeholder="e.g., New Crop Protection Solutions"
                        required
                        className="bg-white border-slate-200"
                      />
                    </div>
                    
                    <div className="space-y-2 col-span-1 md:col-span-2">
                      <Label>Attendance Planning Method</Label>
                      <div className="grid grid-cols-2 gap-2">
                          <Button
                            type="button"
                            variant={formData.attendee_capture_method === 'head_count' ? 'default' : 'outline'}
                            onClick={() => handleInputChange('attendee_capture_method', 'head_count')}
                            className="flex items-center gap-2"
                          >
                            <Hash className="w-4 h-4" />
                            By Head Count
                          </Button>
                          <Button
                            type="button"
                            variant={formData.attendee_capture_method === 'name_list' ? 'default' : 'outline'}
                            onClick={() => handleInputChange('attendee_capture_method', 'name_list')}
                            className="flex items-center gap-2"
                          >
                            <ListChecks className="w-4 h-4" />
                            By Name List
                          </Button>
                      </div>
                    </div>

                    {formData.attendee_capture_method === 'head_count' ? (
                      <div className="space-y-2">
                        <Label htmlFor="expected_attendees">Expected Attendees</Label>
                        <Input
                          id="expected_attendees"
                          type="number"
                          value={formData.expected_attendees}
                          onChange={(e) => handleInputChange("expected_attendees", parseInt(e.target.value) || 0)}
                          placeholder="Number of farmers expected"
                          className="bg-white border-slate-200"
                        />
                      </div>
                    ) : (
                      <div className="space-y-4 col-span-1 md:col-span-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-base font-semibold">Expected Farmer Details</Label>
                            <Badge variant="outline">{expectedFarmers.filter(f => f.name.trim() !== '').length} farmers planned</Badge>
                          </div>
                          
                          {/* Farmer Details Table */}
                          <div className="border rounded-lg overflow-hidden">
                            <div className="bg-slate-50 grid grid-cols-7 gap-2 p-2 text-sm font-semibold border-b">
                              <div>Sr.</div>
                              <div>Name *</div>
                              <div>Mobile</div>
                              <div>Farm</div>
                              <div>Farm Size</div>
                              <div>Remarks</div>
                              <div>Action</div>
                            </div>
                            
                            <div className="max-h-64 overflow-y-auto">
                              {expectedFarmers.map((farmer, index) => (
                                <div key={index} className="grid grid-cols-7 gap-2 p-2 border-b last:border-b-0 items-center">
                                  <div className="text-sm font-medium">{index + 1}</div>
                                  <Input
                                    value={farmer.name}
                                    onChange={(e) => updateFarmer(index, 'name', e.target.value)}
                                    placeholder="Farmer name"
                                    className="text-sm h-8"
                                    required={formData.attendee_capture_method === 'name_list'} // Name is required if this method is chosen
                                  />
                                  <Input
                                    value={farmer.mobile}
                                    onChange={(e) => updateFarmer(index, 'mobile', e.target.value)}
                                    placeholder="Mobile no."
                                    className="text-sm h-8"
                                  />
                                  <Select
                                    value={farmer.farm_ownership}
                                    onValueChange={(value) => updateFarmer(index, 'farm_ownership', value)}
                                  >
                                    <SelectTrigger className="text-sm h-8">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="own">Own</SelectItem>
                                      <SelectItem value="leased">Leased</SelectItem>
                                      <SelectItem value="both">Both</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Input
                                    value={farmer.farm_size}
                                    onChange={(e) => updateFarmer(index, 'farm_size', e.target.value)}
                                    placeholder="Acres"
                                    className="text-sm h-8"
                                  />
                                  <Input
                                    value={farmer.remarks}
                                    onChange={(e) => updateFarmer(index, 'remarks', e.target.value)}
                                    placeholder="Remarks"
                                    className="text-sm h-8"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFarmer(index)}
                                    disabled={expectedFarmers.length === 1}
                                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                            
                            <div className="p-2 bg-slate-50 border-t">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addNewFarmer}
                                className="w-full flex items-center gap-2"
                              >
                                <UserPlus className="w-4 h-4" />
                                + Add New Farmer
                              </Button>
                            </div>
                          </div>
                      </div>
                    )}
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="visit_date">Visit Date *</Label>
                  <Input
                    id="visit_date"
                    type="date"
                    value={formData.visit_date}
                    onChange={(e) => handleInputChange("visit_date", e.target.value)}
                    required
                    className="bg-white border-slate-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="visit_time">Visit Time</Label>
                  <Input
                    id="visit_time"
                    type="time"
                    value={formData.visit_time}
                    onChange={(e) => handleInputChange("visit_time", e.target.value)}
                    className="bg-white border-slate-200"
                  />
                </div>
              </div>

              {/* LOCATION SECTION */}
              <div className="space-y-4">
                <Label>Visit Location *</Label>
                
                {/* GPS Location Capture */}
                <div className="flex gap-2">
                  <Input
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder={
                      formData.activity_category === 'Farmer BTL Engagement' 
                        ? "Meeting venue (Community Center, Village, etc.)"
                        : formData.activity_category === 'Channel BTL Engagement'
                        ? "Client location (Shop/Dealership, etc.)"
                        : "Visit location or meeting place"
                    }
                    required
                    className="bg-white border-slate-200"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={getCurrentLocation}
                    disabled={locationLoading}
                    className="px-3"
                  >
                    {locationLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    ) : (
                      <Navigation className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                {/* Predefined Location Dropdown */}
                <Select onValueChange={(value) => handleInputChange("location", value)}>
                  <SelectTrigger className="bg-white border-slate-200">
                    <SelectValue placeholder="Or choose from common locations" />
                  </SelectTrigger>
                  <SelectContent>
                    {predefinedLocations.map((location, index) => (
                      <SelectItem key={index} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {formData.latitude && formData.longitude && (
                  <p className="text-xs text-green-600">
                    ✓ GPS Location captured: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger className="bg-white border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="postponed">Postponed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">
                  {formData.activity_category === 'Farmer BTL Engagement' 
                    ? "Meeting Notes & Agenda (e.g., discussion points, farmer concerns)" 
                    : formData.activity_category === 'Channel BTL Engagement'
                    ? "Client Notes & Sales Discussion (e.g., product needs, follow-ups)"
                    : "Visit Notes & Meeting Minutes"}
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder={
                    formData.activity_category === 'Farmer BTL Engagement'
                      ? "Meeting agenda, key discussion points, farmer concerns, solutions discussed..."
                      : formData.activity_category === 'Channel BTL Engagement'
                      ? "Sales discussion, stock check, order details, feedback, next steps..."
                      : "Detailed visit notes, specific observations, client feedback, next steps, agreements made..."
                  }
                  className="h-32 bg-white border-slate-200"
                />
              </div>

              {/* Product Inputs Given */}
              <div className="space-y-2">
                <Label>Product Inputs Given to Client</Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addProductInput}
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Log Product Input
                </Button>
                {formData.product_inputs_given && formData.product_inputs_given.length > 0 && (
                  <div className="space-y-2">
                    {formData.product_inputs_given.map((input, index) => (
                      <div key={index} className="p-2 bg-green-50 rounded text-sm">
                        {input.product} - Qty: {input.quantity}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SHOW ATTENDEE SECTION FOR MEETINGS */}
              {supportsAttendees() && (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-yellow-600" />
                    <Label className="text-base font-semibold text-yellow-900">
                      Attendee Management
                    </Label>
                  </div>
                  <p className="text-sm text-yellow-700 mb-3">
                    During visit execution, you'll be able to capture attendee details, signatures, and upload attendance sheets with OCR.
                  </p>
                </div>
              )}

              {/* Simplified Media Capture Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Media Gallery</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Photo Upload */}
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleMediaUpload('photos', e)}
                      className="hidden"
                      id="photo-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('photo-upload').click()}
                      className="w-full h-20 flex-col"
                    >
                      <Camera className="w-6 h-6 mb-2" />
                      Add Photos
                    </Button>
                    {formData.photos && formData.photos.length > 0 && (
                      <p className="text-xs text-green-600">✓ {formData.photos.length} photo(s)</p>
                    )}
                  </div>

                  {/* Video Upload */}
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleMediaUpload('videos', e)}
                      className="hidden"
                      id="video-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('video-upload').click()}
                      className="w-full h-20 flex-col"
                    >
                      <Video className="w-6 h-6 mb-2" />
                      Add Videos
                    </Button>
                    {formData.videos && formData.videos.length > 0 && (
                      <p className="text-xs text-green-600">✓ {formData.videos.length} video(s)</p>
                    )}
                  </div>

                  {/* Voice Notes */}
                  <div className="space-y-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleVoiceRecording}
                      className={`w-full h-20 flex-col ${recording ? 'bg-red-50 border-red-200' : ''}`}
                    >
                      <Mic className={`w-6 h-6 mb-2 ${recording ? 'text-red-500 animate-pulse' : ''}`} />
                      {recording ? 'Stop Recording' : 'Voice Notes'}
                    </Button>
                    {formData.voice_notes && formData.voice_notes.length > 0 && (
                      <p className="text-xs text-green-600">✓ {formData.voice_notes.length} note(s)</p>
                    )}
                  </div>
                </div>
              </div>

              {/* MDO Signature Only */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">MDO Signature</h3>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSignatureCapture}
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Capture MDO Signature
                </Button>
                {formData.signature_url && (
                  <p className="text-xs text-green-600 mt-2">✓ MDO signature captured</p>
                )}
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={loading}
                  className="min-w-20"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 min-w-20"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {visit ? "Update" : "Save"} Visit
                </Button>
              </div>
            </form>
          </TabsContent>
          {visit?.id && (
            <TabsContent value="audit" className="p-0">
              <AuditTrailTab entityName="Visit" recordId={visit.id} />
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}

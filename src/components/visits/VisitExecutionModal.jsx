
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  X, Clock, Camera, Video, Mic, FileSignature, MapPin, CheckCircle2,
  Upload, Play, Pause, Square, Users, UserPlus, FileText, ScanLine,
  Navigation, AlertTriangle, Shield
} from 'lucide-react';

export default function VisitExecutionModal({ isOpen, onClose, visit, client, relatedTasks, onComplete }) {
  const [startTime] = useState(new Date());
  const [elapsedTime, setElapsedTime] = useState("00:00");
  const [completedTasks, setCompletedTasks] = useState({});
  const [visitNotes, setVisitNotes] = useState('');
  const [capturedMedia, setCapturedMedia] = useState([]);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [signature, setSignature] = useState(null);
  const [thumbPrint, setThumbPrint] = useState(null);
  const [gpsLocation, setGpsLocation] = useState(null);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [showThumbPad, setShowThumbPad] = useState(false);

  // New states for enhanced features
  const [showNewContactForm, setShowNewContactForm] = useState(false);
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);
  const [attendees, setAttendees] = useState([]);
  const [newContact, setNewContact] = useState({
    name: '', phone: '', type: 'farmer', address: '', consent: false
  });
  const [routeDeviation, setRouteDeviation] = useState(null);
  const [isPunchedIn, setIsPunchedIn] = useState(true); // Assume punched in when visit starts

  // Refs for media capture
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const attendanceUploadRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    if (!isOpen) return;

    // Pre-populate attendees if it's a farmer meeting with a name list
    if (visit.visit_purpose === 'farmer_meeting' && visit.attendee_capture_method === 'name_list' && visit.expected_attendee_list && visit.expected_attendee_list.length > 0) {
        setAttendees(prevAttendees => {
          // Only pre-populate if attendees array is empty or hasn't been pre-populated yet
          if (prevAttendees.length === 0 || !prevAttendees.some(a => a.source === 'pre-registered')) {
            const prefilledAttendees = visit.expected_attendee_list.map(name => ({
                id: Date.now() + Math.random(), // Ensure unique ID
                name: name,
                phone: '',
                location: '', // Added location field
                type: 'farmer',
                present: false, // Default to not present
                source: 'pre-registered'
            }));
            return prefilledAttendees;
          }
          return prevAttendees; // Keep existing attendees if already populated
        });
    }

    // Timer for visit duration
    const timer = setInterval(() => {
      const now = new Date();
      const diff = Math.floor((now - startTime) / 1000);
      const minutes = String(Math.floor(diff / 60)).padStart(2, '0');
      const seconds = String(diff % 60).padStart(2, '0');
      setElapsedTime(`${minutes}:${seconds}`);
    }, 1000);

    // Capture GPS location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date().toISOString()
          };
          setGpsLocation(location);

          // Simulate route deviation check (in real app, this would check against planned route)
          if (Math.random() > 0.7) {
            setRouteDeviation({
              distance: Math.floor(Math.random() * 50) + 10,
              reason: 'Off planned route'
            });
          }
        },
        (error) => console.log("GPS access denied:", error)
      );
    }

    return () => clearInterval(timer);
  }, [isOpen, startTime, visit]); // Added visit to dependency array to react to visit changes

  const handleTaskToggle = (taskId, completed, remarks = '') => {
    setCompletedTasks(prev => ({
      ...prev,
      [taskId]: { completed, remarks }
    }));
  };

  const handleMediaCapture = (type) => {
    switch (type) {
      case 'photo':
        fileInputRef.current?.click();
        break;
      case 'video':
        videoInputRef.current?.click();
        break;
      case 'audio':
        toggleAudioRecording();
        break;
      default:
        break;
    }
  };

  const handleFileCapture = (event, mediaType) => {
    const file = event.target.files[0];
    if (file) {
      const mediaUrl = URL.createObjectURL(file);
      const mediaData = {
        type: mediaType,
        url: mediaUrl,
        file: file,
        timestamp: new Date().toISOString(),
        location: gpsLocation
      };
      setCapturedMedia(prev => [...prev, mediaData]);
    }
  };

  const toggleAudioRecording = async () => {
    if (isRecordingAudio) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        setIsRecordingAudio(false);
      }
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          const audioUrl = URL.createObjectURL(audioBlob);
          setCapturedMedia(prev => [...prev, {
            type: 'audio',
            url: audioUrl,
            file: audioBlob,
            timestamp: new Date().toISOString(),
            location: gpsLocation
          }]);
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecordingAudio(true);
      } catch (error) {
        console.error("Audio recording failed:", error);
        alert("Could not access microphone");
      }
    }
  };

  const handleSignatureCapture = (type) => {
    if (type === 'signature') {
      setShowSignaturePad(true);
    } else if (type === 'thumb') {
      setShowThumbPad(true);
    }
  };

  const saveSignature = (type) => {
    const timestamp = new Date().toISOString();
    const signatureData = {
      type: type,
      timestamp: timestamp,
      location: gpsLocation,
      client_name: client?.client_name,
      captured: true
    };

    if (type === 'signature') {
      setSignature(signatureData);
      setShowSignaturePad(false);
    } else {
      setThumbPrint(signatureData);
      setShowThumbPad(false);
    }
  };

  const handleNewContactSubmit = () => {
    if (!newContact.consent) {
      alert("Consent is required to add contact to database");
      return;
    }

    // In real app, this would call Client.create()
    console.log("Creating new contact:", {
      ...newContact,
      signature_url: signature?.captured ? "signature_captured" : null,
      thumb_print_url: thumbPrint?.captured ? "thumb_print_captured" : null,
      location: gpsLocation,
      created_during_visit: visit.id
    });

    alert(`New ${newContact.type} "${newContact.name}" added to database`);
    setShowNewContactForm(false);
    setNewContact({ name: '', phone: '', type: 'farmer', address: '', consent: false });
  };

  const handleAddAttendee = () => {
    const attendee = {
      id: Date.now() + Math.random(),
      name: '',
      phone: '',
      location: '', // Added location field
      type: 'farmer',
      present: true,
      source: 'manual'
    };
    setAttendees([...attendees, attendee]);
  };

  const updateAttendee = (id, field, value) => {
    setAttendees(prev => prev.map(a =>
      a.id === id ? { ...a, [field]: value } : a
    ));
  };

  const handleAttendanceUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Simulate OCR processing
      alert(`Processing attendance sheet: ${file.name}\nOCR will extract names and add them to the attendance list.`);

      // Simulate adding extracted names
      const extractedNames = ["Ram Kumar", "Shyam Singh", "Geeta Devi", "Mohan Lal"];
      const extractedAttendees = extractedNames.map((name, index) => ({
        id: Date.now() + index + Math.random(), // Ensure unique ID
        name: name,
        phone: '',
        location: '', // Default location for OCR extracted
        type: 'farmer',
        present: true,
        source: 'ocr'
      }));

      setAttendees(prev => [...prev, ...extractedAttendees]);
    }
  };

  const handleCompleteVisit = () => {
    const visitDuration = Math.floor((new Date() - startTime) / (1000 * 60));

    // Check for compliance issues
    const complianceIssues = [];
    if (visitDuration < 30) {
      complianceIssues.push("Visit duration too short (less than 30 minutes)");
    }
    if (!signature && !thumbPrint) {
      complianceIssues.push("No validation signature or thumb print captured");
    }
    if (capturedMedia.length === 0) {
      complianceIssues.push("No media documentation captured");
    }
    if (routeDeviation) {
      complianceIssues.push(`Route deviation: ${routeDeviation.distance}km from planned route`);
    }

    const executionData = {
      completedTasks,
      visitNotes,
      media: capturedMedia,
      signature,
      thumbPrint,
      visit_duration: visitDuration,
      gps_location: gpsLocation,
      photos: capturedMedia.filter(m => m.type === 'photo').map(m => m.url),
      new_contacts_created: showNewContactForm ? 1 : 0,
      attendees_count: attendees.filter(a => a.present).length, // Count only present attendees
      attendance_details: attendees, // Include full attendance list
      compliance_issues: complianceIssues,
      route_deviation: routeDeviation
    };

    onComplete(visit.id, executionData);
  };

  const completionProgress = relatedTasks.length > 0
    ? Object.keys(completedTasks).filter(taskId => completedTasks[taskId]?.completed).length / relatedTasks.length * 100
    : 0;

  // New Contact Form Component
  const NewContactForm = () => (
    <Card className="mt-4 border-green-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-green-600" />
          Add New {newContact.type === 'farmer' ? 'Farmer' : 'Retailer'} to Database
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-sm">Name *</Label>
            <Input
              value={newContact.name}
              onChange={(e) => setNewContact({...newContact, name: e.target.value})}
              placeholder="Full name"
              className="text-sm"
            />
          </div>
          <div>
            <Label className="text-sm">Phone</Label>
            <Input
              value={newContact.phone}
              onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
              placeholder="Phone number"
              className="text-sm"
            />
          </div>
        </div>

        <div>
          <Label className="text-sm">Type</Label>
          <Select value={newContact.type} onValueChange={(v) => setNewContact({...newContact, type: v})}>
            <SelectTrigger className="text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="farmer">Farmer</SelectItem>
              <SelectItem value="retailer">Retailer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm">Address</Label>
          <Textarea
            value={newContact.address}
            onChange={(e) => setNewContact({...newContact, address: e.target.value})}
            placeholder="Complete address"
            className="text-sm h-16"
          />
        </div>

        <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="consent"
              checked={newContact.consent}
              onChange={(e) => setNewContact({...newContact, consent: e.target.checked})}
              className="mt-1"
            />
            <label htmlFor="consent" className="text-sm">
              <strong>Data Consent:</strong> I consent to my information being stored in the company database.
              Signature/thumb print below validates this consent.
            </label>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowNewContactForm(false)}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleNewContactSubmit}
            className="bg-green-600 hover:bg-green-700"
            disabled={!newContact.name || !newContact.consent}
          >
            Save to Database
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // Attendance Form Component
  const AttendanceForm = () => (
    <Card className="mt-4 border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          Meeting Attendance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button size="sm" onClick={handleAddAttendee} className="flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            + Add New Attendee
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => attendanceUploadRef.current?.click()}
            className="flex items-center gap-2"
          >
            <ScanLine className="w-4 h-4" />
            Upload Attendance Sheet (OCR)
          </Button>
        </div>

        <input
          ref={attendanceUploadRef}
          type="file"
          accept="image/*"
          onChange={handleAttendanceUpload}
          className="hidden"
        />

        {attendees.length > 0 && (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            <Label className="text-sm font-semibold">Attendees ({attendees.filter(a => a.present).length} / {attendees.length})</Label>
            {attendees.map((attendee, index) => (
              <div key={attendee.id} className="flex gap-2 items-center p-2 bg-slate-50 rounded flex-wrap">
                {attendee.source === 'pre-registered' && (
                  <input
                    type="checkbox"
                    checked={attendee.present}
                    onChange={(e) => updateAttendee(attendee.id, 'present', e.target.checked)}
                    className="w-5 h-5"
                  />
                )}
                <span className="text-xs w-6">{index + 1}.</span>
                <Input
                  value={attendee.name}
                  onChange={(e) => updateAttendee(attendee.id, 'name', e.target.value)}
                  placeholder="Name"
                  className={`text-xs h-8 flex-1 min-w-[150px] ${attendee.source === 'pre-registered' ? 'bg-slate-100' : 'bg-white'}`}
                  readOnly={attendee.source === 'pre-registered'}
                />
                <Input
                  value={attendee.phone}
                  onChange={(e) => updateAttendee(attendee.id, 'phone', e.target.value)}
                  placeholder="Phone"
                  className="text-xs h-8 w-28"
                />
                <Input
                  value={attendee.location || ''}
                  onChange={(e) => updateAttendee(attendee.id, 'location', e.target.value)}
                  placeholder="Location (Village)"
                  className="text-xs h-8 w-32"
                />
                {attendee.source === 'ocr' && (
                  <Badge variant="secondary" className="text-xs">OCR</Badge>
                )}
                 {attendee.source === 'pre-registered' && (
                  <Badge variant="outline" className="text-xs">Planned</Badge>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAttendanceForm(false)}
          >
            Close
          </Button>
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              alert(`Attendance saved: ${attendees.filter(a => a.present).length} attendees recorded`);
              setShowAttendanceForm(false);
            }}
          >
            Save Attendance
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const SignaturePad = ({ type, onSave, onCancel }) => (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-white">
        <CardHeader>
          <CardTitle className="text-center">
            {type === 'signature' ? 'Client Digital Signature' : 'Thumb Impression Capture'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 bg-slate-50 text-center">
            <p className="text-slate-500 text-lg">
              {type === 'signature' ? '✍️ Sign Here' : '👍 Place Thumb Here'}
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Tap anywhere in this area to simulate capture
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
            <Button onClick={() => onSave(type)} className="bg-green-600 hover:bg-green-700">
              Save {type === 'signature' ? 'Signature' : 'Print'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-40">
      <Card className="w-full max-w-4xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <CardTitle className="text-xl">Visit in Progress</CardTitle>
                <p className="text-slate-600">{client?.client_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {elapsedTime}
              </Badge>
              {gpsLocation && (
                <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700">
                  <MapPin className="w-3 h-3" />
                  GPS Locked
                </Badge>
              )}
              {routeDeviation && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Route Deviation
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Progress Overview */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-900">Visit Completion</span>
              <span className="text-sm text-blue-700">{Math.round(completionProgress)}%</span>
            </div>
            <Progress value={completionProgress} className="h-2" />
          </div>

          {/* Route Deviation Alert */}
          {routeDeviation && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-orange-800">
                  <Navigation className="w-4 h-4" />
                  <strong>Route Deviation Alert</strong>
                </div>
                <p className="text-sm text-orange-700 mt-1">
                  You are {routeDeviation.distance}km away from your planned route.
                  Your manager has been notified for approval.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Task Completion */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Visit Tasks
            </h3>
            {relatedTasks.length > 0 ? (
              <div className="space-y-3">
                {relatedTasks.map((task) => (
                  <Card key={task.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={completedTasks[task.id]?.completed || false}
                          onChange={(e) => handleTaskToggle(task.id, e.target.checked)}
                          className="mt-1 w-5 h-5"
                        />
                        <div className="flex-1">
                          <p className={`font-medium ${completedTasks[task.id]?.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                            {task.title}
                          </p>
                          <p className="text-sm text-slate-600 mt-1">{task.description}</p>
                          {completedTasks[task.id]?.completed && (
                            <input
                              type="text"
                              placeholder="Add completion remarks..."
                              value={completedTasks[task.id]?.remarks || ''}
                              onChange={(e) => handleTaskToggle(task.id, true, e.target.value)}
                              className="mt-2 w-full p-2 border rounded text-sm"
                            />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-4">No specific tasks assigned for this visit</p>
            )}
          </div>

          {/* Media Capture */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Camera className="w-5 h-5 text-purple-600" />
              Media Documentation
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                variant="outline"
                onClick={() => handleMediaCapture('photo')}
                className="flex items-center gap-2 h-12"
              >
                <Camera className="w-4 h-4" />
                Photo
              </Button>

              <Button
                variant="outline"
                onClick={() => handleMediaCapture('video')}
                className="flex items-center gap-2 h-12"
              >
                <Video className="w-4 h-4" />
                Video
              </Button>

              <Button
                variant={isRecordingAudio ? "destructive" : "outline"}
                onClick={() => handleMediaCapture('audio')}
                className="flex items-center gap-2 h-12"
              >
                {isRecordingAudio ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                {isRecordingAudio ? 'Stop' : 'Voice Note'}
              </Button>

              <Button
                variant="outline"
                onClick={() => document.getElementById('device-upload')?.click()}
                className="flex items-center gap-2 h-12"
              >
                <Upload className="w-4 h-4" />
                Upload
              </Button>
            </div>

            {/* Hidden file inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => handleFileCapture(e, 'photo')}
              className="hidden"
            />

            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              capture="environment"
              onChange={(e) => handleFileCapture(e, 'video')}
              className="hidden"
            />

            <input
              id="device-upload"
              type="file"
              accept="image/*,video/*,audio/*"
              onChange={(e) => handleFileCapture(e, 'upload')}
              className="hidden"
            />

            {/* Display captured media */}
            {capturedMedia.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                {capturedMedia.map((media, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="p-2">
                      {media.type === 'photo' || media.type === 'upload' ? (
                        <img src={media.url} alt="Captured" className="w-full h-20 object-cover rounded" />
                      ) : media.type === 'video' ? (
                        <video src={media.url} className="w-full h-20 object-cover rounded" controls />
                      ) : (
                        <div className="w-full h-20 bg-slate-100 rounded flex items-center justify-center">
                          <Mic className="w-8 h-8 text-slate-400" />
                        </div>
                      )}
                      <p className="text-xs text-slate-500 mt-1 capitalize">{media.type}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Contact Management */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              Attendance & Contact Capture
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => setShowNewContactForm(!showNewContactForm)}
                className="flex items-center gap-2 h-12"
              >
                <UserPlus className="w-4 h-4" />
                Add New Contact
              </Button>

              <Button
                variant="outline"
                onClick={() => setShowAttendanceForm(!showAttendanceForm)}
                className="flex items-center gap-2 h-12"
              >
                <FileText className="w-4 h-4" />
                Meeting Attendance
              </Button>
            </div>

            {showNewContactForm && <NewContactForm />}
            {showAttendanceForm && <AttendanceForm />}
          </div>

          {/* Digital Verification */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileSignature className="w-5 h-5 text-green-600" />
              Digital Verification
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={signature ? "default" : "outline"}
                onClick={() => handleSignatureCapture('signature')}
                className="flex items-center gap-2 h-12"
              >
                <FileSignature className="w-4 h-4" />
                {signature ? 'Signature ✓' : 'Get Signature'}
              </Button>

              <Button
                variant={thumbPrint ? "default" : "outline"}
                onClick={() => handleSignatureCapture('thumb')}
                className="flex items-center gap-2 h-12"
              >
                👍 {thumbPrint ? 'Thumb Print ✓' : 'Get Thumb Print'}
              </Button>
            </div>
          </div>

          {/* Visit Notes */}
          <div className="space-y-2">
            <label className="text-lg font-semibold">Visit Notes & Observations</label>
            <Textarea
              value={visitNotes}
              onChange={(e) => setVisitNotes(e.target.value)}
              placeholder="Record detailed visit notes, client feedback, next steps, etc."
              className="min-h-[100px]"
            />
          </div>

          {/* Complete Visit Button */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Save Draft
            </Button>
            <Button
              onClick={handleCompleteVisit}
              className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
              disabled={completionProgress < 100 && relatedTasks.length > 0}
            >
              <CheckCircle2 className="w-4 h-4" />
              Complete Visit & Submit
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Signature/Thumb Print Modals */}
      {showSignaturePad && (
        <SignaturePad
          type="signature"
          onSave={saveSignature}
          onCancel={() => setShowSignaturePad(false)}
        />
      )}

      {showThumbPad && (
        <SignaturePad
          type="thumb"
          onSave={saveSignature}
          onCancel={() => setShowThumbPad(false)}
        />
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Settings, Plus, Trash2, MapPin } from 'lucide-react';

const initialLocations = [
    { id: 1, name: "Mumbai Region", lat: 19.0760, lng: 72.8777 },
    { id: 2, name: "Delhi Region", lat: 28.6139, lng: 77.2090 },
    { id: 3, name: "Bangalore Region", lat: 12.9716, lng: 77.5946 },
    { id: 4, name: "Chennai Region", lat: 13.0827, lng: 80.2707 },
    { id: 5, name: "Kolkata Region", lat: 22.5726, lng: 88.3639 },
    { id: 6, name: "Hyderabad Region", lat: 17.3850, lng: 78.4867 },
    { id: 7, name: "Pune Region", lat: 18.5204, lng: 73.8567 },
    { id: 8, name: "Ahmedabad Region", lat: 23.0225, lng: 72.5714 },
    { id: 9, name: "Jaipur Region", lat: 26.9124, lng: 75.7873 },
    { id: 10, name: "Lucknow Region", lat: 26.8467, lng: 80.9462 },
];

export default function PredefinedLocations() {
    const [locations, setLocations] = useState(initialLocations);
    const [newLocation, setNewLocation] = useState({ name: '', lat: '', lng: '' });

    const handleAddLocation = () => {
        if (newLocation.name && newLocation.lat && newLocation.lng) {
            setLocations([...locations, { id: Date.now(), ...newLocation, lat: parseFloat(newLocation.lat), lng: parseFloat(newLocation.lng) }]);
            setNewLocation({ name: '', lat: '', lng: '' });
        } else {
            alert('Please fill all fields for the new location.');
        }
    };

    const handleDeleteLocation = (id) => {
        if (window.confirm('Are you sure you want to delete this location?')) {
            setLocations(locations.filter(loc => loc.id !== id));
        }
    };

    return (
        <div className="p-4 md:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <Settings className="w-8 h-8 text-blue-600" />
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Manage Predefined Locations</h1>
                        <p className="text-slate-600">Control the list of locations available for territory creation.</p>
                    </div>
                </div>

                <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-lg mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Plus className="w-5 h-5 text-blue-600" />
                            Add New Location
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1">
                            <label className="text-sm font-medium text-slate-700 mb-1 block">Location Name</label>
                            <Input
                                placeholder="e.g., Nagpur Region"
                                value={newLocation.name}
                                onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                            />
                        </div>
                        <div className="flex-1">
                            <label className="text-sm font-medium text-slate-700 mb-1 block">Latitude</label>
                            <Input
                                type="number"
                                placeholder="e.g., 21.1458"
                                value={newLocation.lat}
                                onChange={(e) => setNewLocation({ ...newLocation, lat: e.target.value })}
                            />
                        </div>
                        <div className="flex-1">
                            <label className="text-sm font-medium text-slate-700 mb-1 block">Longitude</label>
                            <Input
                                type="number"
                                placeholder="e.g., 79.0882"
                                value={newLocation.lng}
                                onChange={(e) => setNewLocation({ ...newLocation, lng: e.target.value })}
                            />
                        </div>
                        <Button onClick={handleAddLocation} className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="w-4 h-4 mr-2" /> Add
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-blue-600" />
                            Available Locations List
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Location Name</TableHead>
                                        <TableHead>Latitude</TableHead>
                                        <TableHead>Longitude</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {locations.map((loc) => (
                                        <TableRow key={loc.id}>
                                            <TableCell className="font-medium">{loc.name}</TableCell>
                                            <TableCell>{loc.lat}</TableCell>
                                            <TableCell>{loc.lng}</TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="icon" onClick={() => handleDeleteLocation(loc.id)}>
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
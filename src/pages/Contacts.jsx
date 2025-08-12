import React, { useState, useEffect } from "react";
import { Client } from "@/api/entities";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Search, 
  Building2, 
  Store, 
  Tractor,
  Phone,
  MapPin,
  CreditCard
} from "lucide-react";

import ContactCard from "../components/contacts/ContactCard";
import ContactForm from "../components/contacts/ContactForm";

export default function Contacts() {
  const [user, setUser] = useState(null);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

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

      const clientsData = await Client.list("-created_date");
      setClients(clientsData);
    } catch (error) {
      console.error("Error loading contacts:", error);
    }
    setLoading(false);
  };

  const handleSubmit = async (clientData) => {
    try {
      if (editingClient) {
        await Client.update(editingClient.id, clientData);
      } else {
        await Client.create(clientData);
      }
      setShowForm(false);
      setEditingClient(null);
      loadData();
    } catch (error) {
      console.error("Error saving client:", error);
    }
  };

  const filteredClients = clients.filter(client => {
    const searchLower = (searchTerm || '').toLowerCase();
    const nameMatch = (client.client_name || '').toLowerCase().includes(searchLower);
    const locationMatch = (client.address || '').toLowerCase().includes(searchLower);
    const phoneMatch = (client.phone || '').toLowerCase().includes(searchLower);
    
    const searchMatch = nameMatch || locationMatch || phoneMatch;
    
    if (activeTab === "all") return searchMatch;
    return searchMatch && client.client_type === activeTab;
  });

  const getTabCounts = () => {
    return {
      all: clients.length,
      distributor: clients.filter(c => c.client_type === 'distributor').length,
      retailer: clients.filter(c => c.client_type === 'retailer').length,
      farmer: clients.filter(c => c.client_type === 'farmer').length
    };
  };

  const counts = getTabCounts();

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
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Contacts</h1>
            <p className="text-slate-600">Manage your business contacts and relationships</p>
          </div>
          <Button 
            onClick={() => {
              setEditingClient(null);
              setShowForm(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Contact
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/80 border-blue-100"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80">
            <TabsTrigger value="all" className="flex items-center gap-2">
              All ({counts.all})
            </TabsTrigger>
            <TabsTrigger value="distributor" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Distributors ({counts.distributor})
            </TabsTrigger>
            <TabsTrigger value="retailer" className="flex items-center gap-2">
              <Store className="w-4 h-4" />
              Retailers ({counts.retailer})
            </TabsTrigger>
            <TabsTrigger value="farmer" className="flex items-center gap-2">
              <Tractor className="w-4 h-4" />
              Farmers ({counts.farmer})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {showForm && (
              <ContactForm
                client={editingClient}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingClient(null);
                }}
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <ContactCard
                    key={client.id}
                    client={client}
                    onEdit={(client) => {
                      setEditingClient(client);
                      setShowForm(true);
                    }}
                  />
                ))
              ) : (
                <div className="col-span-full">
                  <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
                    <CardContent className="text-center py-12">
                      <Store className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-600 mb-2">No contacts found</h3>
                      <p className="text-slate-500 mb-4">
                        {searchTerm ? "Try adjusting your search terms" : "Get started by adding your first contact"}
                      </p>
                      {!searchTerm && (
                        <Button 
                          onClick={() => setShowForm(true)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add First Contact
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
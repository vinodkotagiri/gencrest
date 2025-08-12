import React, { useState, useEffect } from "react";
import { Liquidation } from "@/api/entities";
import { User } from "@/api/entities";
import { Client } from "@/api/entities";
import { SKUInventory } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ClipboardList, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import LiquidationForm from "../components/liquidation/LiquidationForm";
import LiquidationList from "../components/liquidation/LiquidationList";

export default function LiquidationPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [liquidationEntries, setLiquidationEntries] = useState([]);
  const [clients, setClients] = useState([]);
  const [skus, setSkus] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadData();
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('action') === 'new') {
      setShowForm(true);
    }
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const userData = await User.me();
      setUser(userData);
      
      const [entries, clientData, skuData] = await Promise.all([
        Liquidation.filter({ mdo_id: userData.email }, "-created_date"),
        Client.list(),
        SKUInventory.list()
      ]);
      
      setLiquidationEntries(entries);
      setClients(clientData);
      setSkus(skuData);
    } catch (error) {
      console.error("Error loading liquidation data:", error);
    }
    setLoading(false);
  };

  const handleSubmit = async (formData) => {
    try {
      await Liquidation.create({
        ...formData,
        mdo_id: user?.email
      });
      setShowForm(false);
      loadData();
    } catch (error) {
      console.error("Error saving liquidation entry:", error);
    }
  };
  
  const filteredEntries = liquidationEntries.filter(entry => {
    const distributor = clients.find(c => c.id === entry.distributor_id);
    const soldTo = clients.find(c => c.id === entry.sold_to_client_id);
    const sku = skus.find(s => s.id === entry.sku_id);
    
    const searchLower = (searchTerm || '').toLowerCase();
    const distributorName = distributor?.client_name || '';
    const soldToName = soldTo?.client_name || '';
    const productName = sku?.product_name || '';
    
    return distributorName.toLowerCase().includes(searchLower) ||
           soldToName.toLowerCase().includes(searchLower) ||
           productName.toLowerCase().includes(searchLower);
  });

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Stock Liquidation</h1>
            <p className="text-slate-600">Log stock movement from distributors to retailers/farmers.</p>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 hover:bg-indigo-700 shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Entry
          </Button>
        </div>

        {showForm && (
          <LiquidationForm
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
            clients={clients}
            skus={skus}
          />
        )}
        
        <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900">
                <ClipboardList className="w-5 h-5 text-indigo-600" />
                Recent Entries
              </div>
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/80 border-blue-100"
                />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LiquidationList 
              entries={filteredEntries} 
              clients={clients} 
              skus={skus} 
              loading={loading}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
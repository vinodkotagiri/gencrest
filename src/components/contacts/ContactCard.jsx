import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Store, 
  Tractor,
  Phone,
  MapPin,
  CreditCard,
  Edit,
  IndianRupee
} from "lucide-react";

export default function ContactCard({ client, onEdit }) {
  const getClientIcon = (type) => {
    switch (type) {
      case 'distributor':
        return <Building2 className="w-5 h-5 text-purple-600" />;
      case 'retailer':
        return <Store className="w-5 h-5 text-green-600" />;
      case 'farmer':
        return <Tractor className="w-5 h-5 text-orange-600" />;
      default:
        return <Building2 className="w-5 h-5 text-slate-600" />;
    }
  };

  const getClientTypeColor = (type) => {
    switch (type) {
      case 'distributor':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'retailer':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'farmer':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-50 rounded-lg">
              {getClientIcon(client.client_type)}
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">{client.client_name}</h3>
              <Badge variant="outline" className={getClientTypeColor(client.client_type)}>
                {client.client_type}
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(client)}
            className="text-slate-400 hover:text-slate-600"
          >
            <Edit className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-3">
          {client.contact_person && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span className="font-medium">Contact:</span>
              <span>{client.contact_person}</span>
            </div>
          )}

          {client.phone && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Phone className="w-4 h-4 text-blue-500" />
              <span>{client.phone}</span>
            </div>
          )}

          {client.address && (
            <div className="flex items-start gap-2 text-sm text-slate-600">
              <MapPin className="w-4 h-4 text-blue-500 mt-0.5" />
              <span className="flex-1">{client.address}</span>
            </div>
          )}

          {client.territory && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span className="font-medium">Territory:</span>
              <span>{client.territory}</span>
            </div>
          )}

          {(client.credit_limit || client.outstanding_balance) && (
            <div className="pt-3 border-t border-slate-200">
              <div className="grid grid-cols-2 gap-3">
                {client.credit_limit && (
                  <div className="text-center">
                    <div className="text-xs text-slate-500">Credit Limit</div>
                    <div className="text-sm font-medium text-green-600">
                      ₹{(client.credit_limit).toLocaleString()}
                    </div>
                  </div>
                )}
                {client.outstanding_balance && (
                  <div className="text-center">
                    <div className="text-xs text-slate-500">Outstanding</div>
                    <div className="text-sm font-medium text-red-600">
                      ₹{(client.outstanding_balance).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <Badge 
              variant="outline" 
              className={client.status === 'active' ? 
                'bg-green-100 text-green-800 border-green-200' : 
                'bg-red-100 text-red-800 border-red-200'
              }
            >
              {client.status || 'active'}
            </Badge>
            <span className="text-xs text-slate-400">
              Added {new Date(client.created_date).toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Calendar, User, ShoppingBag } from "lucide-react";
import { format } from "date-fns";

export default function OrderCard({ order, client, onEdit }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'shipped': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'approved': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Use client_name from order first, then fallback to client object
  const clientName = order.client_name || client?.client_name || "Unknown Client";

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">{clientName}</h3>
            <p className="text-sm text-slate-500">Order #{order.order_number}</p>
          </div>
          <Badge variant="outline" className={getStatusColor(order.status)}>
            {order.status}
          </Badge>
        </div>
        
        <div className="flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 text-slate-600 mb-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span>{format(new Date(order.order_date), "MMM d, yyyy")}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <ShoppingBag className="w-4 h-4 text-blue-500" />
              <span>{order.items?.length || 0} items</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-slate-800">
              ₹{(order.total_amount || 0).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-4 mt-4 border-t border-slate-200">
          <Button size="sm" variant="outline" onClick={() => onEdit(order)}>
            <Edit className="w-4 h-4 mr-2" />
            View/Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

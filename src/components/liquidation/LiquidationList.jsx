import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function LiquidationList({ entries, clients, skus, loading }) {
  if (loading) {
    return <div className="text-center py-8">Loading entries...</div>;
  }

  if (entries.length === 0) {
    return <div className="text-center py-16 text-slate-500">No liquidation entries found.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead>Date</TableHead>
            <TableHead>From (Distributor)</TableHead>
            <TableHead>To (Retailer/Farmer)</TableHead>
            <TableHead>Product</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map(entry => {
            const distributor = clients.find(c => c.id === entry.distributor_id);
            const soldTo = clients.find(c => c.id === entry.sold_to_client_id);
            const sku = skus.find(s => s.id === entry.sku_id);
            return (
              <TableRow key={entry.id}>
                <TableCell>{format(new Date(entry.entry_date), "MMM d, yyyy")}</TableCell>
                <TableCell>{distributor?.client_name || 'N/A'}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{soldTo?.client_name || 'N/A'}</span>
                    <Badge variant="outline" className="w-fit mt-1 text-xs">{soldTo?.client_type}</Badge>
                  </div>
                </TableCell>
                <TableCell>{sku?.product_name || 'N/A'}</TableCell>
                <TableCell className="text-right font-medium">{entry.quantity}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { AuditTrail } from '@/api/entities';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, UserCircle, Edit, PlusCircle, Trash2 } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

const ActionIcon = ({ action }) => {
  switch (action) {
    case 'create':
      return <PlusCircle className="w-4 h-4 text-green-500" />;
    case 'update':
      return <Edit className="w-4 h-4 text-blue-500" />;
    case 'delete':
      return <Trash2 className="w-4 h-4 text-red-500" />;
    default:
      return <History className="w-4 h-4 text-gray-500" />;
  }
};

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") return <i className="text-slate-400">empty</i>;
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'object') return <pre className="text-xs bg-slate-100 p-1 rounded-md">{JSON.stringify(value, null, 2)}</pre>;
  return `"${String(value)}"`;
};

export default function AuditTrailTab({ entityName, recordId }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuditTrail = async () => {
      if (!recordId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const trailData = await AuditTrail.filter(
          { entity_name: entityName, record_id: recordId },
          '-created_date'
        );
        setLogs(trailData);
      } catch (error) {
        console.error("Error fetching audit trail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAuditTrail();
  }, [entityName, recordId]);

  if (loading) {
    return <div className="p-6 text-center">Loading change history...</div>;
  }

  if (logs.length === 0) {
    return (
      <div className="p-6 text-center text-slate-500">
        <History className="w-8 h-8 mx-auto mb-2 text-slate-400" />
        No change history found for this record.
      </div>
    );
  }

  return (
    <ScrollArea className="h-96 p-1">
      <div className="space-y-6 p-4">
        {logs.map(log => (
          <div key={log.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="p-2 bg-slate-100 rounded-full">
                <ActionIcon action={log.action} />
              </div>
              <div className="flex-1 w-px bg-slate-200 my-2"></div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-slate-800">{log.user_full_name || log.user_email}</p>
                <Badge variant={log.action === 'create' ? 'success' : log.action === 'delete' ? 'destructive' : 'secondary'}>
                  {log.action}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mb-2">
                {formatDistanceToNow(new Date(log.created_date), { addSuffix: true })}
              </p>
              <div className="text-sm text-slate-600 space-y-1">
                {log.action === 'create' && <p>Record was created.</p>}
                {log.action === 'delete' && <p>Record was deleted.</p>}
                {log.action === 'update' && log.changes && Object.keys(log.changes).map(field => (
                  <div key={field} className="p-2 bg-slate-50 rounded-md">
                    Changed <strong>{field}</strong> from {formatValue(log.changes[field].old_value)} to {formatValue(log.changes[field].new_value)}.
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
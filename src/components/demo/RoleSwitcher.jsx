import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users } from 'lucide-react';

export default function RoleSwitcher() {
  const [currentRole, setCurrentRole] = React.useState(localStorage.getItem('demoRole') || 'TSM');

  const handleRoleChange = (role) => {
    localStorage.setItem('demoRole', role);
    window.location.reload();
  };

  return (
    <div className="p-2 bg-blue-50 border-t border-blue-100 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <Users className="w-4 h-4 text-blue-700" />
        <p className="text-xs font-semibold text-blue-700">Switch Demo Role</p>
      </div>
      <Select value={currentRole} onValueChange={handleRoleChange}>
        <SelectTrigger className="w-full bg-white text-xs">
          <SelectValue placeholder="Select a role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="TSM">TSM (Manager View)</SelectItem>
          <SelectItem value="MDO">MDO (Field Officer View)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
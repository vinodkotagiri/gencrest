
import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { AnnualTarget } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Target, Edit, Save, Lock, UserCheck, TrendingUp, MapPin, PlusCircle, CheckCircle } from 'lucide-react';

// RMM View: Form to set targets for an MDO
const TargetSettingForm = ({ mdo, year, rmmId, onSave }) => {
  const [target, setTarget] = useState({
    annual_sales_target: 1000000,
    annual_visit_target: 300,
    new_client_target: 20,
  });

  const handleSave = async () => {
    const payload = {
      mdo_id: mdo.email,
      rmm_id: rmmId,
      year: year,
      status: 'finalized', // Automatically finalize on save for simplicity
      ...target
    };
    await onSave(payload);
  };

  return (
    <Card className="bg-white/90 shadow-lg border-blue-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <UserCheck className="w-6 h-6 text-blue-600" />
          Set Annual Targets for {mdo.full_name} ({year})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="sales_target">Annual Sales Target (₹)</Label>
            <Input id="sales_target" type="number" value={target.annual_sales_target} onChange={(e) => setTarget({...target, annual_sales_target: parseInt(e.target.value, 10)})} />
          </div>
          <div>
            <Label htmlFor="visit_target">Annual Visit Target</Label>
            <Input id="visit_target" type="number" value={target.annual_visit_target} onChange={(e) => setTarget({...target, annual_visit_target: parseInt(e.target.value, 10)})} />
          </div>
          <div>
            <Label htmlFor="client_target">New Client Target</Label>
            <Input id="client_target" type="number" value={target.new_client_target} onChange={(e) => setTarget({...target, new_client_target: parseInt(e.target.value, 10)})} />
          </div>
        </div>
        <Button onClick={handleSave} className="w-full bg-blue-600 hover:bg-blue-700">
          <Lock className="w-4 h-4 mr-2" />
          Finalize & Save Targets
        </Button>
      </CardContent>
    </Card>
  );
};

// MDO View: Display targets and update progress
const MDOTargetView = ({ target, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [progress, setProgress] = useState({
    sales_achieved: target.sales_achieved || 0,
    visits_achieved: target.visits_achieved || 0,
    new_clients_achieved: target.new_clients_achieved || 0,
  });

  const handleUpdate = async () => {
    await onUpdate(target.id, {
      ...progress,
      last_updated_by_mdo: new Date().toISOString()
    });
    setIsEditing(false);
  };
  
  const getProgress = (achieved, targetValue) => (targetValue > 0 ? (achieved / targetValue) * 100 : 0);

  return (
    <Card className="bg-white/90 shadow-lg border-green-100">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-3"><Target className="w-6 h-6 text-green-600" /> Your {target.year} Annual Targets</span>
          <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
            {isEditing ? 'Save Progress' : 'Update Progress'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Display */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-end mb-1">
              <Label className="text-lg font-semibold text-slate-700">Sales Achievement</Label>
              <span className="font-bold text-green-600 text-xl">
                ₹{progress.sales_achieved.toLocaleString()} / ₹{target.annual_sales_target.toLocaleString()}
              </span>
            </div>
            <Progress value={getProgress(progress.sales_achieved, target.annual_sales_target)} className="w-full" />
          </div>
          <div>
            <div className="flex justify-between items-end mb-1">
              <Label className="text-lg font-semibold text-slate-700">Visit Completion</Label>
              <span className="font-bold text-blue-600 text-xl">
                {progress.visits_achieved} / {target.annual_visit_target}
              </span>
            </div>
            <Progress value={getProgress(progress.visits_achieved, target.annual_visit_target)} className="w-full" />
          </div>
          <div>
            <div className="flex justify-between items-end mb-1">
              <Label className="text-lg font-semibold text-slate-700">New Client Acquisition</Label>
              <span className="font-bold text-purple-600 text-xl">
                {progress.new_clients_achieved} / {target.new_client_target}
              </span>
            </div>
            <Progress value={getProgress(progress.new_clients_achieved, target.new_client_target)} className="w-full" />
          </div>
        </div>

        {/* Editing Form */}
        {isEditing && (
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4">
             <h3 className="font-semibold text-slate-800">Update Your Year-to-Date Cumulative Progress:</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <Label htmlFor="sales_achieved">Sales Achieved YTD (₹)</Label>
                    <Input id="sales_achieved" type="number" value={progress.sales_achieved} onChange={(e) => setProgress({...progress, sales_achieved: parseInt(e.target.value, 10)})} />
                </div>
                <div>
                    <Label htmlFor="visits_achieved">Visits Completed YTD</Label>
                    <Input id="visits_achieved" type="number" value={progress.visits_achieved} onChange={(e) => setProgress({...progress, visits_achieved: parseInt(e.target.value, 10)})} />
                </div>
                <div>
                    <Label htmlFor="clients_achieved">New Clients Acquired YTD</Label>
                    <Input id="clients_achieved" type="number" value={progress.new_clients_achieved} onChange={(e) => setProgress({...progress, new_clients_achieved: parseInt(e.target.value, 10)})} />
                </div>
             </div>
             <Button onClick={handleUpdate} className="bg-green-600 hover:bg-green-700"><CheckCircle className="w-4 h-4 mr-2" />Confirm & Save Progress</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};


export default function AnnualTargetsPage() {
  const [user, setUser] = useState(null);
  const [mdoTeam, setMdoTeam] = useState([]);
  const [annualTargets, setAnnualTargets] = useState([]);
  const [selectedMdo, setSelectedMdo] = useState('');
  const [loading, setLoading] = useState(true);

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await User.me();
        const demoRole = localStorage.getItem('demoRole');
        if (demoRole) currentUser.designation = demoRole;
        setUser(currentUser);

        if (['RMM', 'RBH', 'ZBH', 'admin'].includes(currentUser.designation)) {
          // Regional Manager view: Load their team of TSMs and MDOs
          const directReports = await User.filter({ reporting_manager: currentUser.email });
          // Also get MDOs under their TSMs
          const tsmEmails = directReports.filter(u => u.designation === 'TSM').map(u => u.email);
          let mdosUnderTsms = [];
          for (const tsmEmail of tsmEmails) {
            const tsm_mdos = await User.filter({ reporting_manager: tsmEmail, designation: 'MDO' });
            mdosUnderTsms = [...mdosUnderTsms, ...tsm_mdos];
          }
          
          const allMdos = [...directReports.filter(u => u.designation === 'MDO'), ...mdosUnderTsms];
          setMdoTeam(allMdos.length > 0 ? allMdos : await User.filter({ designation: 'MDO' }));
          
        } else if (['TSM'].includes(currentUser.designation)) {
          // TSM view: Load only their direct MDO reports
          const team = await User.filter({ reporting_manager: currentUser.email, designation: 'MDO' });
          setMdoTeam(team.length > 0 ? team : []);
        }

        const targets = await AnnualTarget.list();
        setAnnualTargets(targets);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSaveTarget = async (payload) => {
    // Check if a target for this MDO/year already exists
    const existing = annualTargets.find(t => t.mdo_id === payload.mdo_id && t.year === payload.year);
    if (existing) {
      await AnnualTarget.update(existing.id, payload);
    } else {
      await AnnualTarget.create(payload);
    }
    // Refresh data
    const targets = await AnnualTarget.list();
    setAnnualTargets(targets);
  };
  
  const handleUpdateProgress = async (targetId, progressData) => {
      await AnnualTarget.update(targetId, progressData);
      const targets = await AnnualTarget.list();
      setAnnualTargets(targets);
  };

  const isRegionalManager = user && ['RMM', 'RBH', 'ZBH', 'admin'].includes(user.designation);
  const isTerritoryManager = user && ['TSM'].includes(user.designation);
  const isManager = isRegionalManager || isTerritoryManager;
  
  // Find target for current user (if MDO) or selected MDO (if Manager)
  const activeMdoEmail = isManager ? selectedMdo : user?.email;
  const activeTarget = annualTargets.find(t => t.mdo_id === activeMdoEmail && t.year === currentYear);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
            <Target className="w-8 h-8 text-blue-600"/>
            Annual Performance Targets
          </h1>
          <p className="text-slate-600">
            {isRegionalManager 
              ? "Set and track annual goals across your region." 
              : isTerritoryManager
              ? "Set and track annual goals for your territory team."
              : "View your goals and update your progress."
            }
          </p>
        </header>

        {isManager && (
          <Card className="bg-white/80 shadow-md">
            <CardContent className="p-6">
              <Label htmlFor="mdo-select" className="text-lg font-semibold text-slate-800">Select an MDO to View or Set Targets</Label>
              <Select value={selectedMdo} onValueChange={setSelectedMdo}>
                <SelectTrigger id="mdo-select" className="mt-2">
                  <SelectValue placeholder="Choose an MDO from your team..." />
                </SelectTrigger>
                <SelectContent>
                  {mdoTeam.map(mdo => (
                    <SelectItem key={mdo.id} value={mdo.email}>{mdo.full_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        )}

        {/* Dynamic View based on role and selection */}
        {isManager ? (
          selectedMdo && (
            activeTarget ? (
              <MDOTargetView target={activeTarget} onUpdate={() => alert("Managers can only view progress here. MDOs must update.")} />
            ) : (
              <TargetSettingForm mdo={mdoTeam.find(m => m.email === selectedMdo)} year={currentYear} rmmId={user.email} onSave={handleSaveTarget} />
            )
          )
        ) : (
          activeTarget ? (
            <MDOTargetView target={activeTarget} onUpdate={handleUpdateProgress} />
          ) : (
            <Card className="text-center p-8 bg-white/80 shadow-md">
              <h3 className="text-xl font-semibold text-slate-700">Your annual targets for {currentYear} have not been set.</h3>
              <p className="text-slate-500 mt-2">Please contact your manager to finalize your goals for the year.</p>
            </Card>
          )
        )}
      </div>
    </div>
  );
}

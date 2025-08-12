import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, BarChart, Route, Target, HelpCircle } from 'lucide-react';

export default function AskGency() {
  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen flex items-center justify-center">
      <div className="max-w-4xl mx-auto text-center">
        <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-xl overflow-hidden">
          <div className="p-10 md:p-16 space-y-6">
            <div className="relative inline-block">
              <Sparkles className="w-20 h-20 text-blue-500 mx-auto animate-pulse" />
            </div>

            <Badge variant="outline" className="text-lg bg-blue-100 text-blue-800 border-blue-200 py-1 px-4">
              Coming Soon
            </Badge>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Meet Gency, Your AI Assistant
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Gency will be your intelligent partner, ready to provide instant insights and streamline your daily tasks. Get ready to unlock a new level of productivity.
            </p>

            <div className="text-left pt-6 space-y-6">
              <h3 className="text-xl font-semibold text-slate-800 text-center">In the future, you'll be able to ask Gency to:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                  <BarChart className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-700">Analyze Performance</h4>
                    <p className="text-sm text-slate-600">"Show me my sales trend for the last 3 months."</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                  <Route className="w-6 h-6 text-purple-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-700">Plan Your Day</h4>
                    <p className="text-sm text-slate-600">"What's the most efficient route for my visits today?"</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                  <Target className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-700">Track Your Targets</h4>
                    <p className="text-sm text-slate-600">"How close am I to my monthly visit target?"</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                  <HelpCircle className="w-6 h-6 text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-700">Get Quick Answers</h4>
                    <p className="text-sm text-slate-600">"What is the outstanding balance for Kumar Farm Inputs?"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
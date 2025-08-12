import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Target, Award } from "lucide-react";

export default function GameStatsCard({ gameStats, user }) {
  const defaultStats = {
    total_points: 0,
    tasks_completed: 0,
    level: 1,
    badges_earned: []
  };

  const stats = gameStats || defaultStats;
  const pointsToNextLevel = (stats.level * 500) - (stats.total_points % 500);
  const levelProgress = ((stats.total_points % 500) / 500) * 100;

  return (
    <Card className="bg-gradient-to-br from-purple-500 to-blue-600 text-white shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-6 h-6" />
          Your Game Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold">{stats.total_points}</div>
            <div className="text-sm opacity-90">Total Points</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">Level {stats.level}</div>
            <div className="text-sm opacity-90">Current Level</div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Progress to Level {stats.level + 1}</span>
            <span>{pointsToNextLevel} points needed</span>
          </div>
          <Progress value={levelProgress} className="h-3 bg-white/20" />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
          <div className="text-center">
            <Target className="w-6 h-6 mx-auto mb-2 opacity-90" />
            <div className="text-xl font-semibold">{stats.tasks_completed}</div>
            <div className="text-xs opacity-90">Tasks Completed</div>
          </div>
          <div className="text-center">
            <Award className="w-6 h-6 mx-auto mb-2 opacity-90" />
            <div className="text-xl font-semibold">{stats.badges_earned?.length || 0}</div>
            <div className="text-xs opacity-90">Badges Earned</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
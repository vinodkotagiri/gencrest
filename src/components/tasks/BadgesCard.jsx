import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Star, Target, Trophy, Zap, Crown } from "lucide-react";

export default function BadgesCard({ gameStats }) {
  const availableBadges = [
    {
      id: "first_task",
      name: "Getting Started",
      description: "Complete your first task",
      icon: Target,
      color: "bg-green-100 text-green-800",
      requirement: 1
    },
    {
      id: "task_master",
      name: "Task Master",
      description: "Complete 10 tasks",
      icon: Star,
      color: "bg-blue-100 text-blue-800",
      requirement: 10
    },
    {
      id: "point_collector",
      name: "Point Collector",
      description: "Earn 500 points",
      icon: Trophy,
      color: "bg-purple-100 text-purple-800",
      requirement: 500
    },
    {
      id: "speed_demon",
      name: "Speed Demon",
      description: "Complete 5 tasks in one day",
      icon: Zap,
      color: "bg-yellow-100 text-yellow-800",
      requirement: 5
    },
    {
      id: "champion",
      name: "Champion",
      description: "Reach Level 5",
      icon: Crown,
      color: "bg-red-100 text-red-800",
      requirement: 5
    }
  ];

  const earnedBadges = gameStats?.badges_earned || [];
  const tasksCompleted = gameStats?.tasks_completed || 0;
  const totalPoints = gameStats?.total_points || 0;
  const level = gameStats?.level || 1;

  const isBadgeEarned = (badge) => {
    switch (badge.id) {
      case "first_task":
        return tasksCompleted >= 1;
      case "task_master":
        return tasksCompleted >= 10;
      case "point_collector":
        return totalPoints >= 500;
      case "speed_demon":
        return earnedBadges.includes(badge.id);
      case "champion":
        return level >= 5;
      default:
        return false;
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-6 h-6 text-orange-600" />
          Badges & Achievements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          {availableBadges.map((badge) => {
            const earned = isBadgeEarned(badge);
            const IconComponent = badge.icon;
            
            return (
              <div
                key={badge.id}
                className={`flex items-center gap-4 p-3 rounded-lg border-2 transition-all ${
                  earned 
                    ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' 
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className={`p-2 rounded-full ${earned ? 'bg-yellow-100' : 'bg-slate-200'}`}>
                  <IconComponent className={`w-6 h-6 ${earned ? 'text-yellow-600' : 'text-slate-400'}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`font-semibold ${earned ? 'text-slate-900' : 'text-slate-500'}`}>
                      {badge.name}
                    </h4>
                    {earned && (
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                        Earned!
                      </Badge>
                    )}
                  </div>
                  <p className={`text-sm ${earned ? 'text-slate-600' : 'text-slate-400'}`}>
                    {badge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
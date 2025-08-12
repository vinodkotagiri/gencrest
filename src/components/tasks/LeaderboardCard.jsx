import React, { useState, useEffect } from "react";
import { GameStats } from "@/api/entities";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Crown } from "lucide-react";

export default function LeaderboardCard({ currentUser }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const [gameStatsData, usersData] = await Promise.all([
        GameStats.list("-total_points", 10),
        User.list()
      ]);

      // Combine game stats with user data
      const leaderboardData = gameStatsData.map(stat => {
        const user = usersData.find(u => u.email === stat.user_id);
        return {
          ...stat,
          user_name: user?.full_name || "Unknown User",
          user_territory: user?.territory || "N/A",
          user_designation: user?.designation || "N/A"
        };
      });

      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error("Error loading leaderboard:", error);
    }
    setLoading(false);
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Trophy className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-orange-500" />;
      default:
        return <Award className="w-6 h-6 text-slate-400" />;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-300";
      case 2:
        return "bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300";
      case 3:
        return "bg-gradient-to-r from-orange-100 to-orange-200 border-orange-300";
      default:
        return "bg-white border-slate-200";
    }
  };

  if (loading) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading leaderboard...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-600" />
          Top Performers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {leaderboard.length === 0 ? (
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No leaderboard data yet</p>
            <p className="text-sm text-slate-400">Complete tasks to appear here!</p>
          </div>
        ) : (
          leaderboard.map((entry, index) => {
            const rank = index + 1;
            const isCurrentUser = entry.user_id === currentUser?.email;
            
            return (
              <div
                key={entry.id}
                className={`flex items-center gap-4 p-4 rounded-lg border-2 ${getRankColor(rank)} ${
                  isCurrentUser ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  {getRankIcon(rank)}
                  <span className="text-2xl font-bold text-slate-700">#{rank}</span>
                </div>

                <Avatar className="w-12 h-12 border-2 border-white">
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold">
                    {entry.user_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-slate-900">{entry.user_name}</h4>
                    {isCurrentUser && (
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        You
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-slate-600">
                    {entry.user_designation} • {entry.user_territory}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-900">
                    {entry.total_points.toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-500">points</div>
                  <div className="text-xs text-slate-400">
                    Level {entry.level} • {entry.tasks_completed} tasks
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}

import React, { useState, useEffect, useMemo } from 'react';
import { User } from '@/api/entities';
import { SalesOrder } from '@/api/entities';
import { MonthlyPlan } from '@/api/entities';
import { Liquidation } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, CircleDollarSign, CheckCircle2, Award } from 'lucide-react';

// Mock data and logic for demonstration
const calculateCredibilityScore = (user, plans, orders, liquidations) => {
  // --- Target Achievement (40%) ---
  // A simple mock calculation: score is based on a predefined value for demo
  const targetScore = (user.email.length % 40) + 55; // Random-ish score between 55-95

  // --- Collections Performance (30%) ---
  // Mock calculation based on user ID
  const collectionScore = 80 - (user.employee_id.charCodeAt(user.employee_id.length - 1) % 20); // 60-80

  // --- Liquidation Alignment (20%) ---
  const liquidationScore = 75 + (user.email.length % 20); // 75-95

  // --- Performance Consistency (10%) ---
  // Clear business logic: Consistency is measured by how stable their monthly performance is
  // High consistency = low variance in monthly target achievement
  // For demo purposes, we simulate this with a clear formula:
  const monthlyVariance = Math.abs(targetScore - 75); // How far they are from average (75)
  const consistencyScore = Math.max(60, 100 - (monthlyVariance * 2)); // Lower variance = higher consistency
  
  // Calculate weighted total
  const totalScore = Math.round(
    (targetScore * 0.4) + 
    (collectionScore * 0.3) + 
    (liquidationScore * 0.2) + 
    (consistencyScore * 0.1)
  );

  return {
    // Preserving original user details and updating score keys
    id: user.id,
    name: user.full_name,
    designation: user.designation,
    territory: user.territory,
    total_score: totalScore,
    target_achievement_score: targetScore,
    collections_score: collectionScore,
    liquidation_alignment_score: liquidationScore,
    consistency_score: consistencyScore
  };
};


const getScoreColor = (score) => {
  if (score >= 90) return 'bg-green-100 text-green-800 border-green-200';
  if (score >= 75) return 'bg-blue-100 text-blue-800 border-blue-200';
  if (score >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  return 'bg-red-100 text-red-800 border-red-200';
};

export default function CredibilityIndex() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [users, plans, orders, liquidations] = await Promise.all([
          User.filter({ designation: { $in: ['TSM', 'MDO'] } }),
          MonthlyPlan.list(),
          SalesOrder.list(),
          Liquidation.list()
        ]);
        
        const calculatedScores = users.map(user => 
          calculateCredibilityScore(user, plans, orders, liquidations)
        );

        // Update sorting key to new `total_score`
        setScores(calculatedScores.sort((a, b) => b.total_score - a.total_score));
      } catch (error) {
        console.error("Error loading credibility index data:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
            <Star className="w-10 h-10 text-yellow-500" />
            Credibility Index Score
          </h1>
          <p className="text-lg text-slate-600">Performance scoring for TSMs & MDOs based on key business metrics.</p>
        </header>

        <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle>Employee Scores</CardTitle>
          </CardHeader>
          <CardContent>
             {loading ? (
              <p>Calculating scores...</p>
            ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead className="text-center">Total Score</TableHead>
                    <TableHead className="text-center">Target Achievement (40%)</TableHead>
                    <TableHead className="text-center">Collections (30%)</TableHead>
                    <TableHead className="text-center">Liquidation (20%)</TableHead>
                    <TableHead className="text-center">Consistency (10%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scores.map((score, index) => (
                    <React.Fragment key={score.id}>
                      <TableRow>
                        <TableCell className="font-bold text-lg text-slate-600">{index + 1}</TableCell>
                        <TableCell>
                          <p className="font-semibold text-slate-900">{score.name}</p>
                          <p className="text-sm text-slate-500">{score.designation} - {score.territory}</p>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={`text-lg ${getScoreColor(score.total_score)}`}>
                            <Award className="w-4 h-4 mr-2" />{score.total_score}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className={getScoreColor(score.target_achievement_score)}>
                            <TrendingUp className="w-3 h-3 mr-1" /> {score.target_achievement_score}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className={getScoreColor(score.collections_score)}>
                            <CircleDollarSign className="w-3 h-3 mr-1" /> {score.collections_score}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className={getScoreColor(score.liquidation_alignment_score)}>
                            <CheckCircle2 className="w-3 h-3 mr-1" /> {score.liquidation_alignment_score}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {/* Added Award icon as per the new detailed card for consistency */}
                          <Badge variant="outline" className={getScoreColor(score.consistency_score)}>
                            <Award className="w-3 h-3 mr-1" /> {score.consistency_score}
                          </Badge>
                        </TableCell>
                      </TableRow>
                      {/* New row for detailed score breakdown */}
                      <TableRow>
                         {/* This cell spans all columns to contain the grid of detailed cards */}
                         <TableCell colSpan={7} className="py-4 border-b-2 border-slate-100"> 
                            <div className="grid grid-cols-4 gap-4 mb-6">
                              <Card className="bg-blue-50 border-blue-200">
                                <CardContent className="p-4 text-center">
                                  <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                  <p className="text-2xl font-bold text-blue-600">{score.target_achievement_score}</p>
                                  <p className="text-sm text-blue-700">Target Achievement (40%)</p>
                                  <p className="text-xs text-slate-500 mt-1">Based on sales vs targets</p>
                                </CardContent>
                              </Card>

                              <Card className="bg-green-50 border-green-200">
                                <CardContent className="p-4 text-center">
                                  <CircleDollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                  <p className="text-2xl font-bold text-green-600">{score.collections_score}</p>
                                  <p className="text-sm text-green-700">Collections (30%)</p>
                                  <p className="text-xs text-slate-500 mt-1">Payment collection efficiency</p>
                                </CardContent>
                              </Card>

                              <Card className="bg-purple-50 border-purple-200">
                                <CardContent className="p-4 text-center">
                                  <CheckCircle2 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                                  <p className="text-2xl font-bold text-purple-600">{score.liquidation_alignment_score}</p>
                                  <p className="text-sm text-purple-700">Liquidation (20%)</p>
                                  <p className="text-xs text-slate-500 mt-1">Stock movement alignment</p>
                                </CardContent>
                              </Card>

                              <Card className="bg-orange-50 border-orange-200">
                                <CardContent className="p-4 text-center">
                                  <Award className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                                  <p className="text-2xl font-bold text-orange-600">{score.consistency_score}</p>
                                  <p className="text-sm text-orange-700">Consistency (10%)</p>
                                  <p className="text-xs text-slate-500 mt-1">Monthly performance stability</p>
                                </CardContent>
                              </Card>
                            </div>
                         </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

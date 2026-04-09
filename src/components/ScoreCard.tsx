import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AnalysisResult } from '../lib/gemini';
import { Shield, TrendingUp, Wallet, ArrowUpRight, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ScoreCardProps {
  result: AnalysisResult;
}

export function ScoreCard({ result }: ScoreCardProps) {
  const scoreData = [
    { name: 'Score', value: result.trust_score },
    { name: 'Remaining', value: 1000 - result.trust_score },
  ];

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'high': return 'text-rose-600 bg-rose-50 border-rose-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const metrics = [
    { label: 'Income Consistency', value: result.key_metrics.income_consistency, icon: TrendingUp, color: 'text-blue-600' },
    { label: 'Expense Management', value: result.key_metrics.expense_management, icon: Wallet, color: 'text-indigo-600' },
    { label: 'Liquidity Ratio', value: result.key_metrics.liquidity_ratio, icon: ArrowUpRight, color: 'text-violet-600' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1 border-none shadow-lg bg-white overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Trust Score</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center pt-0">
          <div className="relative w-full aspect-square max-w-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={scoreData}
                  cx="50%"
                  cy="50%"
                  innerRadius="70%"
                  outerRadius="90%"
                  startAngle={225}
                  endAngle={-45}
                  paddingAngle={0}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill="var(--color-primary)" />
                  <Cell fill="var(--color-muted)" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold tracking-tighter text-slate-900">{result.trust_score}</span>
              <span className="text-xs font-medium text-muted-foreground">out of 1000</span>
            </div>
          </div>
          
          <Badge className={`mt-4 px-4 py-1 text-sm font-semibold border ${getRiskColor(result.risk_level)}`}>
            {result.risk_level} Risk
          </Badge>
          
          <div className="mt-6 flex items-center gap-2 text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-2 rounded-full">
            <Shield className="w-4 h-4" />
            {result.loan_eligibility_status}
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2 border-none shadow-lg bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Key Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {metrics.map((metric, idx) => (
            <motion.div 
              key={metric.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="space-y-2"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg bg-slate-50 ${metric.color}`}>
                    <metric.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{metric.label}</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{metric.value}%</span>
              </div>
              <Progress value={metric.value} className="h-2 bg-slate-100" />
            </motion.div>
          ))}
          
          <div className="pt-4 flex items-start gap-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
            <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-800 leading-relaxed">
              These metrics are derived from AI analysis of transaction patterns, frequency, and categorization. 
              They represent alternative creditworthiness factors.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

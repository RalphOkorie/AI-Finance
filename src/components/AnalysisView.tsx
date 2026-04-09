import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalysisResult } from '../lib/gemini';
import { Sparkles, PiggyBank, Lightbulb, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface AnalysisViewProps {
  result: AnalysisResult;
}

export function AnalysisView({ result }: AnalysisViewProps) {
  return (
    <div className="space-y-6">
      <Card className="border-none shadow-lg bg-white">
        <CardHeader className="flex flex-row items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <CardTitle className="text-lg font-semibold">AI Financial Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
            {result.analysis}
          </p>
        </CardContent>
      </Card>

      <Card className="border-none shadow-lg bg-primary text-primary-foreground overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <PiggyBank className="w-32 h-32" />
        </div>
        <CardHeader className="flex flex-row items-center gap-2 relative z-10">
          <Lightbulb className="w-5 h-5 text-amber-300" />
          <CardTitle className="text-lg font-semibold">Recommended Micro-Savings Plan</CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <p className="text-xl font-medium leading-snug">
              {result.recommended_savings_plan}
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm font-medium text-white/80">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              Automated daily deductions recommended
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

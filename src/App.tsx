import React from 'react';
import { TransactionForm } from './components/TransactionForm';
import { ScoreCard } from './components/ScoreCard';
import { AnalysisView } from './components/AnalysisView';
import { analyzeTransactions, AnalysisResult } from './lib/gemini';
import { motion, AnimatePresence } from 'motion/react';
import { Wallet, RefreshCcw, Info, Github } from 'lucide-react';
import { Button } from './components/ui/button';

export default function App() {
  const [result, setResult] = React.useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleAnalyze = async (logs: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await analyzeTransactions(logs);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-primary/10">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
            <div className="bg-primary p-1.5 rounded-lg shadow-lg shadow-primary/20">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
              Beyond the Wallet
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="hidden sm:flex text-muted-foreground hover:text-primary">
              <Info className="w-4 h-4 mr-2" />
              How it works
            </Button>
            {result && (
              <Button variant="outline" size="sm" onClick={handleReset} className="border-slate-200">
                <RefreshCcw className="w-4 h-4 mr-2" />
                New Analysis
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4 max-w-2xl mx-auto">
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
                  Alternative Credit Scoring for the <span className="text-primary">Unbanked</span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Empowering informal vendors by turning mobile money footprints into trust scores and micro-savings plans.
                </p>
              </div>

              <TransactionForm onSubmit={handleAnalyze} isLoading={isLoading} />

              {error && (
                <div className="max-w-2xl mx-auto p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-800 text-sm flex items-center gap-3">
                  <div className="p-1 bg-rose-100 rounded-full">
                    <RefreshCcw className="w-4 h-4" />
                  </div>
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
                {[
                  { title: "AI-Powered", desc: "Advanced pattern recognition for informal income streams.", icon: "✨" },
                  { title: "Privacy First", desc: "Secure analysis of raw logs without storing PII.", icon: "🔒" },
                  { title: "Actionable", desc: "Get instant micro-loan eligibility and savings goals.", icon: "📈" }
                ].map((feature) => (
                  <div key={feature.title} className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 space-y-2">
                    <div className="text-2xl">{feature.icon}</div>
                    <h3 className="font-bold text-slate-900">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-slate-900">Financial Profile</h2>
                  <p className="text-muted-foreground">Generated analysis based on provided transaction history.</p>
                </div>
                <div className="text-xs font-mono text-muted-foreground bg-slate-100 px-2 py-1 rounded">
                  ANALYSIS_ID: {Math.random().toString(36).substring(7).toUpperCase()}
                </div>
              </div>

              <ScoreCard result={result} />
              <AnalysisView result={result} />
              
              <footer className="pt-12 pb-8 text-center text-sm text-muted-foreground border-t border-slate-200">
                <p>© 2026 Beyond the Wallet. Prototype built with Gemini 1.5 Flash.</p>
                <div className="mt-4 flex justify-center gap-6">
                  <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                  <a href="#" className="hover:text-primary transition-colors">API Documentation</a>
                </div>
              </footer>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}


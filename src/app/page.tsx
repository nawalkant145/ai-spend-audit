'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SpendForm } from '@/components/audit/SpendForm';
import { ResultsDashboard } from '@/components/audit/ResultsDashboard';
import { runAudit } from '@/lib/audit/engine';
import { useAuditForm } from '@/hooks/useAuditForm';
import { AuditResult } from '@/lib/audit/types';
import { Sparkles, ArrowRight, BarChart3, ShieldCheck, Zap } from 'lucide-react';

export default function Home() {
  const [showResults, setShowResults] = useState(false);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const { formData, resetForm } = useAuditForm();

  const handleRunAudit = () => {
    const result = runAudit(formData);
    setAuditResult(result);
    setShowResults(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setShowResults(false);
    setAuditResult(null);
    resetForm();
  };

  return (
    <main className="min-h-screen bg-slate-50/50">
      <AnimatePresence mode="wait">
        {!showResults ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Landing Hero */}
            <div className="relative pt-20 pb-16 overflow-hidden">
              <div className="container mx-auto px-4 relative z-10">
                <div className="text-center space-y-6 max-w-4xl mx-auto">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm border border-primary/20"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Lead-gen asset for Credex</span>
                  </motion.div>
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900"
                  >
                    Stop Burning Cash on <span className="text-primary italic">AI Tools</span>
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-xl text-slate-600 max-w-2xl mx-auto"
                  >
                    Get a free, instant audit of your startup's AI spend. 
                    Benchmark your stack and uncover hidden savings in minutes.
                  </motion.p>
                </div>

                {/* Features Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-20">
                  <Feature 
                    icon={<Zap className="h-6 w-6 text-yellow-500" />} 
                    title="Instant Audit" 
                    desc="No login required. Just input your tools and see the results immediately." 
                  />
                  <Feature 
                    icon={<BarChart3 className="h-6 w-6 text-blue-500" />} 
                    title="Defensible Data" 
                    desc="Real reasoning powered by current 2026 pricing across 8+ major vendors." 
                  />
                  <Feature 
                    icon={<ShieldCheck className="h-6 w-6 text-green-500" />} 
                    title="Credex Optimized" 
                    desc="Unlock access to discounted infrastructure credits if your spend is high." 
                  />
                </div>
              </div>
              
              {/* Decorative background elements */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-3xl -z-10" />
            </div>

            {/* The Form Section */}
            <div className="bg-white border-y py-20">
              <SpendForm onComplete={handleRunAudit} />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
          >
            {auditResult && <ResultsDashboard result={auditResult} onReset={handleReset} />}
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="py-12 border-t bg-white">
        <div className="container mx-auto px-4 text-center space-y-4">
          <p className="font-bold text-lg">Lumina AI Audit</p>
          <p className="text-muted-foreground text-sm">A Credex Lead Generation Project. All Rights Reserved 2026.</p>
        </div>
      </footer>
    </main>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-sm border hover:shadow-md transition-shadow">
      <div className="p-3 bg-slate-50 rounded-xl mb-4">{icon}</div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{desc}</p>
    </div>
  );
}

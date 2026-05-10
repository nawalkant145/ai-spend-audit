'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AuditResult } from '@/lib/audit/types';
import { TrendingDown, ShieldCheck, Zap, AlertCircle, Share2, Mail, Sparkles, Loader2, Check } from 'lucide-react';
import { LeadCapture } from './LeadCapture';
import { supabase } from '@/lib/supabase';

import { AuditResult, AuditInput } from '@/lib/audit/types';

export function ResultsDashboard({ result, input, onReset, isPublic = false }: { result: AuditResult; input: AuditInput; onReset?: () => void; isPublic?: boolean }) {
  const [summary, setSummary] = useState<string>('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(!isPublic);
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [auditId, setAuditId] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const hasHighSavings = result.totalMonthlySavings >= 500;

  const saveAuditToDb = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('audits').insert([{
        result: result,
        input: input, // Storing input for shared reports
      }]).select().single();
      
      if (!error && data) {
        setAuditId(data.id);
      }
    } catch (err) {
      console.error('Save Audit Error:', err);
    }
  }, [result]);

  const generateSummary = useCallback(async () => {
    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamSize: input.teamSize,
          useCase: input.primaryUseCase,
          toolsList: result.recommendations.map(r => r.toolName).join(', '),
          monthlySavings: result.totalMonthlySavings,
          annualSavings: result.totalAnnualSavings,
          recommendations: result.recommendations.map(r => r.reasoning).join('\n'),
        }),
      });
      const data = await res.json();
      setSummary(data.summary);
    } catch (err) {
      console.error('Summary Error:', err);
      setSummary("Your audit is ready. We&apos;ve found significant opportunities to optimize your AI stack.");
    } finally {
      setIsLoadingSummary(false);
    }
  }, [result, input]);

  useEffect(() => {
    const init = async () => {
      if (!isPublic) {
        await generateSummary();
        await saveAuditToDb();
      }
    };
    init();
  }, [isPublic, generateSummary, saveAuditToDb]);

  const handleShare = async () => {
    if (!auditId) return;
    const url = `${window.location.origin}/share/${auditId}`;
    await navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8 pb-20">
      {/* Hero Savings Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <Badge variant="outline" className="px-4 py-1 text-sm font-medium border-primary text-primary bg-primary/5">
          {isPublic ? 'Shared Public Audit' : 'Audit Complete'}
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Potential Savings: <span className="text-primary">${result.totalAnnualSavings.toLocaleString()}</span>/yr
        </h1>
      </motion.div>

      {/* AI Summary Section */}
      {!isPublic && (
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Sparkles className="h-5 w-5" />
              AI Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingSummary ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing your stack...
              </div>
            ) : (
              <p className="text-lg leading-relaxed text-slate-700 italic">
                &quot;{summary}&quot;
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Savings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-primary text-primary-foreground overflow-hidden relative shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-6 w-6" />
              Monthly Reduction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold">${result.totalMonthlySavings}</p>
            <div className="mt-4 flex items-center gap-2 opacity-80">
              <Zap className="h-4 w-4" />
              <span>Instant action items identified</span>
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
             <TrendingDown className="h-24 w-24" />
          </div>
        </Card>

        <Card className="border-2 bg-background shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-green-500" />
              Efficiency Score
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-4xl font-bold">
                {Math.max(10, 100 - Math.floor((result.totalMonthlySavings / (result.totalMonthlySpend || 1)) * 100))}%
              </span>
              <span className="text-muted-foreground pb-1 text-sm">Target: 95%+</span>
            </div>
            <Progress value={Math.max(10, 100 - Math.floor((result.totalMonthlySavings / (result.totalMonthlySpend || 1)) * 100))} className="h-3" />
          </CardContent>
        </Card>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <AlertCircle className="text-primary" />
          Optimization Roadmap
        </h2>
        {result.recommendations.map((rec, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow border-l-4 border-l-primary">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-xl">{rec.toolName}</h3>
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-none">
                        {rec.recommendedAction}
                      </Badge>
                    </div>
                    <p className="text-slate-600">{rec.reasoning}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">+${rec.potentialMonthlySavings}/mo</p>
                    <p className="text-sm text-muted-foreground italic">Impact: {((rec.potentialMonthlySavings / result.totalMonthlySavings) * 100).toFixed(0)}% of total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Lead Capture or Share CTA */}
      {!isPublic && (
        <div className="pt-8 border-t space-y-12">
          {!showLeadCapture ? (
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">What&apos;s Next?</h3>
                <p className="text-muted-foreground">Capture this report to your email or share it with your team.</p>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="h-12 px-8" onClick={() => setShowLeadCapture(true)}>
                  <Mail className="mr-2 h-5 w-5" /> Capture Full Report
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8" onClick={handleShare}>
                  {isCopied ? <Check className="mr-2 h-5 w-5 text-green-500" /> : <Share2 className="mr-2 h-5 w-5" />}
                  {isCopied ? 'Link Copied!' : 'Share Public Link'}
                </Button>
              </div>
            </div>
          ) : (
            <LeadCapture 
              auditId={auditId || undefined} 
              savings={result.totalAnnualSavings}
              onCaptured={() => setShowLeadCapture(false)} 
            />
          )}
        </div>
      )}

      {/* Credex CTA for High Savings */}
      {hasHighSavings && !isPublic && (
        <Card className="bg-slate-900 text-white border-none overflow-hidden relative mt-12">
          <CardContent className="p-10 relative z-10">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1 space-y-4 text-center md:text-left">
                <Badge className="bg-yellow-500 text-black border-none">High Impact Opportunity</Badge>
                <h2 className="text-3xl md:text-4xl font-bold leading-tight">Credex can save you another 30%+.</h2>
                <p className="text-slate-400 text-lg">
                  We specialize in sourcing discounted infrastructure credits from companies that over-forecast. 
                  You get the same tools, but at enterprise-exclusive prices.
                </p>
                <Button size="lg" className="bg-white text-black hover:bg-slate-200 h-14 px-8 text-lg font-bold">
                  Book Credex Consultation
                </Button>
              </div>
              <div className="w-32 h-32 md:w-48 md:h-48 bg-primary/20 rounded-full blur-2xl absolute -right-10 -bottom-10" />
            </div>
          </CardContent>
        </Card>
      )}

      {onReset && (
        <div className="text-center pt-8">
          <Button variant="ghost" onClick={onReset} className="text-muted-foreground">
            Start New Audit from Scratch
          </Button>
        </div>
      )}
    </div>
  );
}

'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AuditResult } from '@/lib/audit/types';
import { TrendingDown, ShieldCheck, Zap, AlertCircle, Share2, Mail, ExternalLink } from 'lucide-react';

export function ResultsDashboard({ result, onReset }: { result: AuditResult; onReset: () => void }) {
  const hasHighSavings = result.totalMonthlySavings >= 500;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
      {/* Hero Savings Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <Badge variant="outline" className="px-4 py-1 text-sm font-medium border-primary text-primary">
          Audit Complete
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Your Potential Savings: <span className="text-primary">${result.totalAnnualSavings.toLocaleString()}</span>/yr
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          We found <span className="font-bold text-foreground">${result.totalMonthlySavings}</span> in monthly optimizations across your AI stack.
        </p>
      </motion.div>

      {/* Savings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-primary text-primary-foreground overflow-hidden relative">
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
          <div className="absolute top-0 right-0 p-4 opacity-10">
             <TrendingDown className="h-24 w-24" />
          </div>
        </Card>

        <Card className="border-2 border-primary/20 bg-background shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-green-500" />
              Audit Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result.isOptimal ? (
              <p className="text-lg font-medium">Your stack is lean and optimized. Great job!</p>
            ) : (
              <div className="space-y-4">
                <p className="text-lg font-medium">Optimization potential detected.</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Efficiency Score</span>
                    <span>{Math.max(10, 100 - Math.floor((result.totalMonthlySavings / (result.totalMonthlySpend || 1)) * 100))}%</span>
                  </div>
                  <Progress value={Math.max(10, 100 - Math.floor((result.totalMonthlySavings / (result.totalMonthlySpend || 1)) * 100))} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <AlertCircle className="text-primary" />
          Recommended Actions
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
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-xl">{rec.toolName}</h3>
                      <Badge variant="secondary">{rec.recommendedAction}</Badge>
                    </div>
                    <p className="text-muted-foreground">{rec.reasoning}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">Save ${rec.potentialMonthlySavings}/mo</p>
                    <p className="text-sm text-muted-foreground">Current spend: ${rec.currentSpend}/mo</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Credex CTA for High Savings */}
      {hasHighSavings && (
        <Card className="bg-black text-white border-none overflow-hidden group">
          <CardContent className="p-8 relative">
            <div className="space-y-4 relative z-10">
              <Badge className="bg-yellow-500 text-black border-none">Maximize Savings</Badge>
              <h2 className="text-3xl font-bold">You're a High-Savings Candidate.</h2>
              <p className="text-gray-400 max-w-xl">
                We've identified significant over-spend. Credex specializes in discounted enterprise credits 
                that can cut your AI infrastructure costs by another 30-50%.
              </p>
              <Button size="lg" className="bg-white text-black hover:bg-gray-200 mt-4 group">
                Book Credex Consultation
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            <div className="absolute top-1/2 -right-20 -translate-y-1/2 opacity-20 pointer-events-none">
              <Sparkles className="h-64 w-64 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Bar */}
      <div className="flex flex-wrap gap-4 pt-8 border-t">
        <Button onClick={onReset} variant="outline">
          Start New Audit
        </Button>
        <Button variant="outline">
          <Share2 className="mr-2 h-4 w-4" /> Share Results
        </Button>
        <Button className="ml-auto">
          <Mail className="mr-2 h-4 w-4" /> Capture Report
        </Button>
      </div>
    </div>
  );
}

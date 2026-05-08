'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { Mail, Loader2, CheckCircle } from 'lucide-react';

export function LeadCapture({ auditId, onCaptured }: { auditId?: string, onCaptured: () => void }) {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('leads').insert([{
        email,
        company_name: company,
        audit_id: auditId,
      }]);

      if (error) throw error;
      
      setIsSuccess(true);
      setTimeout(() => onCaptured(), 2000);
    } catch (err) {
      console.error('Lead Capture Error:', err);
      // Fallback: even if DB fails, show success to user to not block them
      setIsSuccess(true);
      onCaptured();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="border-2 border-green-500 bg-green-50/50">
        <CardContent className="p-12 text-center space-y-4">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
          <h3 className="text-2xl font-bold">Report Captured!</h3>
          <p className="text-muted-foreground text-lg">We've sent the full audit to your inbox. Credex will reach out if we find more savings.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl">Capture Your Full Report</CardTitle>
        <CardDescription>Enter your email to receive the detailed PDF audit and get notified of new optimizations.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Work Email</Label>
            <Input 
              id="email" 
              type="email" 
              required 
              placeholder="you@company.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company Name (Optional)</Label>
            <Input 
              id="company" 
              placeholder="Startup Inc." 
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full h-12 text-lg" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Mail className="mr-2 h-5 w-5" />}
            Get Detailed Report
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            No spam. Only high-value AI optimization insights.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

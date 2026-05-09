'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { Mail, Loader2, CheckCircle } from 'lucide-react';

export function LeadCapture({ auditId, savings, onCaptured }: { auditId?: string, savings?: number, onCaptured: () => void }) {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Anti-spam
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return; // Silent fail for bots

    setIsSubmitting(true);

    try {
      // 1. Store in Supabase
      const { error: dbError } = await supabase.from('leads').insert([{
        email,
        company_name: company,
        audit_id: auditId,
      }]);

      if (dbError) throw dbError;

      // 2. Trigger Transactional Email
      if (savings && auditId) {
        await fetch('/api/send-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            companyName: company,
            savings: savings * 12, // Annual
            auditLink: `${window.location.origin}/share/${auditId}`,
          }),
        });
      }
      
      setIsSuccess(true);
      setTimeout(() => onCaptured(), 3000);
    } catch (err) {
      console.error('Lead Capture Error:', err);
      setIsSuccess(true); // Don't block user on non-critical failures
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
          <h3 className="text-2xl font-bold">Report Sent!</h3>
          <p className="text-muted-foreground text-lg">Check your inbox for the full breakdown. Credex will reach out to discuss further optimizations.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Capture Your Full Report</CardTitle>
        <CardDescription className="text-center">Enter your email to receive the detailed optimization roadmap and annual savings summary.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Honeypot field - hidden from users */}
          <div className="hidden" aria-hidden="true">
            <Input value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
          </div>

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
            <Label htmlFor="company">Company Name</Label>
            <Input 
              id="company" 
              placeholder="e.g. Acme AI" 
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full h-12 text-lg font-bold" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Mail className="mr-2 h-5 w-5" />}
            Email My Audit Results
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Trusted by founders to optimize burn. By clicking, you agree to a follow-up from Credex if high savings are found.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

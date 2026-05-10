import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { ResultsDashboard } from '@/components/audit/ResultsDashboard';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { data: audit } = await supabase
    .from('audits')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!audit) return { title: 'Audit Not Found' };

  const savings = audit.result.totalAnnualSavings;
  
  return {
    title: `AI Spend Audit: $${savings.toLocaleString()} Savings Found`,
    description: `Check out this AI spend audit result. We found significant optimizations for this stack.`,
    openGraph: {
      title: `AI Spend Audit: $${savings.toLocaleString()} Savings Found`,
      description: `Instant audit results for an AI tool stack. Built for Credex.`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `AI Spend Audit: $${savings.toLocaleString()} Savings Found`,
      description: `Instant audit results for an AI tool stack. Built for Credex.`,
    },
  };
}

export default async function SharePage({ params }: { params: { id: string } }) {
  const { data: audit, error } = await supabase
    .from('audits')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !audit) {
    notFound();
  }

  // Strip any potential PII from the audit object before passing to UI if needed
  // For now, our DB schema will only store non-PII in the public 'audits' table

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="container mx-auto py-10">
        <ResultsDashboard result={audit.result} input={audit.input} isPublic={true} />
      </div>
    </div>
  );
}

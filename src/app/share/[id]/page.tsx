import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { ResultsDashboard } from '@/components/audit/ResultsDashboard';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  const { data: audit } = await supabase
    .from('audits')
    .select('*')
    .eq('id', id)
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

export default async function SharePage({ params }: Props) {
  const { id } = await params;

  const { data: audit, error } = await supabase
    .from('audits')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !audit) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="container mx-auto py-10">
        <ResultsDashboard result={audit.result} input={audit.input} isPublic={true} />
      </div>
    </div>
  );
}

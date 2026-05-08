import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function saveAudit(auditData: any) {
  const { data, error } = await supabase
    .from('audits')
    .insert([auditData])
    .select();
  
  if (error) throw error;
  return data[0];
}

export async function saveLead(leadData: any) {
  const { data, error } = await supabase
    .from('leads')
    .insert([leadData]);
  
  if (error) throw error;
  return data;
}

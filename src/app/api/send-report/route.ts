import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, companyName, savings, auditLink } = await req.json();

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ message: 'Email skipped (no API key)' }, { status: 200 });
    }

    const { data, error } = await resend.emails.send({
      from: 'Lumina AI Audit <onboarding@resend.dev>', // Replace with custom domain in production
      to: [email],
      subject: `Your AI Spend Audit: $${savings.toLocaleString()} Potential Savings Found`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h1 style="color: #2563eb; font-size: 24px;">Your AI Spend Audit is Ready</h1>
          <p style="font-size: 16px; color: #475569;">Hi there,</p>
          <p style="font-size: 16px; color: #475569;">
            We've completed the audit for <strong>${companyName || 'your team'}</strong>. 
            Our engine has identified <strong>$${savings.toLocaleString()} in annual savings</strong> across your AI stack.
          </p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 24px 0; text-align: center;">
            <p style="margin: 0; color: #64748b; font-size: 14px;">ANNUAL SAVINGS POTENTIAL</p>
            <p style="margin: 8px 0 0 0; color: #2563eb; font-size: 36px; font-weight: bold;">$${savings.toLocaleString()}</p>
          </div>

          <p style="font-size: 16px; color: #475569;">You can view your full breakdown and optimization roadmap here:</p>
          <a href="${auditLink}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin-bottom: 24px;">View Full Report</a>

          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          
          <p style="font-size: 14px; color: #94a3b8;">
            Lumina is powered by <strong>Credex</strong>. If you're spending more than $500/mo on AI, 
            Credex can help you secure enterprise-grade infrastructure credits at a 30-50% discount.
          </p>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error('Email Send Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

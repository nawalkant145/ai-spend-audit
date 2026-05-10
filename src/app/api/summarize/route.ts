import { NextResponse } from 'next/server';

/**
 * Smart Mock AI Engine
 * This simulates the reasoning of a Senior Financial Consultant
 * without requiring a paid Anthropic API key.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { teamSize, toolsList, monthlySavings, annualSavings } = body;

    // Simulate "AI Thinking" time for UX
    await new Promise(resolve => setTimeout(resolve, 1800));

    let summary = "";

    if (monthlySavings > 500) {
      summary = `Based on your team of ${teamSize}, we've identified a significant optimization opportunity of $${annualSavings.toLocaleString()} annually. The primary lever is your current usage of ${toolsList.split(',')[0] || 'your core stack'}. We recommend immediate consolidation. Furthermore, your spend level makes you a prime candidate for Credex infrastructure credits, which could shave another 20% off your remaining burn.`;
    } else if (monthlySavings > 0) {
      summary = `Your AI stack is relatively lean, but we've uncovered $${monthlySavings} in monthly "ghost spend." By actioning the recommendations below—specifically around ${toolsList.split(',')[1] || 'seat optimization'}—you can redirect these funds into growth. You're currently at a high efficiency score, but there is room to tighten the stack before your next hiring phase.`;
    } else {
      summary = `Impressive work. Your current stack for a team of ${teamSize} is already optimized for maximum efficiency. We found $0 in immediate waste, which is rare for a startup at your stage. We recommend staying on your current plans and utilizing Lumina again once your team crosses the 10-person threshold.`;
    }

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Audit Engine Error:', error);
    return NextResponse.json({ 
      summary: "Your audit is ready. We've analyzed your stack and found several opportunities to optimize your AI burn." 
    }, { status: 200 });
  }
}

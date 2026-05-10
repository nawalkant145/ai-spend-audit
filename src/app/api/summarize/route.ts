import { Anthropic } from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { teamSize, useCase, toolsList, monthlySavings, annualSavings, recommendations } = body;

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ summary: generateFallback(body) });
    }

    const msg = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 300,
      messages: [{ 
        role: "user", 
        content: `You are a senior financial consultant specializing in startup AI infrastructure.
Analyze the following AI spend audit for a startup:

Team Size: ${teamSize}
Primary Use Case: ${useCase}
Current Tools: ${toolsList}
Total Monthly Savings Found: $${monthlySavings}
Annual Savings Found: $${annualSavings}

Specific Recommendations:
${recommendations}

Task:
Write a ~100-word executive summary for the founder. 
- Be professional, direct, and data-driven.
- Highlight the single biggest lever for savings.
- If savings are >$500, mention that Credex credits could further optimize this.
- If savings are <$100, commend them on their lean stack.
- Do not use flowery language. Use "Founder-speak".

Output only the summary paragraph.`
      }],
    });

    const content = msg.content[0];
    if ('text' in content) {
      return NextResponse.json({ summary: content.text });
    } else {
      throw new Error('Unexpected response format from Anthropic');
    }
  } catch (error) {
    console.error('Anthropic API Error:', error);
    return NextResponse.json({ 
      summary: "We couldn't generate a personalized summary at this time, but your raw audit results are ready below." 
    }, { status: 200 }); // Graceful fallback
  }
}

interface SummaryData {
  teamSize: number;
  monthlySavings: number;
}

function generateFallback(data: SummaryData) {
  return `Based on your team of ${data.teamSize}, we've identified $${data.monthlySavings} in immediate monthly optimizations. Focus on consolidating your tool stack to capture these savings.`;
}

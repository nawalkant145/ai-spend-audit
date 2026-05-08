# AI Prompts Strategy

This document outlines the LLM prompts used in Lumina to generate personalized summaries. We prioritize **Anthropic's Claude 3.5 Sonnet** for its superior reasoning on financial and technical trade-offs.

## Personalized Audit Summary

### The Prompt
```text
You are a senior financial consultant specializing in startup AI infrastructure.
Analyze the following AI spend audit for a startup:

Team Size: {{teamSize}}
Primary Use Case: {{useCase}}
Current Tools: {{toolsList}}
Total Monthly Savings Found: ${{monthlySavings}}
Annual Savings Found: ${{annualSavings}}

Specific Recommendations:
{{recommendations}}

Task:
Write a ~100-word executive summary for the founder. 
- Be professional, direct, and data-driven.
- Highlight the single biggest lever for savings.
- If savings are >$500, mention that Credex credits could further optimize this.
- If savings are <$100, commend them on their lean stack.
- Do not use flowery language. Use "Founder-speak".

Output only the summary paragraph.
```

### Why this works
1.  **Role Prompting**: Setting the persona as a "senior financial consultant" ensures the tone is authoritative and professional.
2.  **Context Injection**: By passing the raw audit results, the AI doesn't have to "guess" the math (which LLMs are bad at); it only has to synthesize the *meaning* of the math.
3.  **Constraint-Based**: Hard limits on word count and specific conditional triggers (Credex mention) ensure consistent output.

## Fallback Strategy
If the Anthropic API fails (e.g., rate limits or key issues), the system falls back to a template-driven summary:
*"Based on your team of {{teamSize}}, your current spend is {{status}}. We've identified ${{monthlySavings}} in immediate monthly optimizations. Focus on {{topRecommendation}} to capture these savings."*

import { AuditInput, AuditResult, AuditRecommendation, ToolSpend } from './types';

const PRICING = {
  Cursor: { Pro: 20, Business: 40 },
  'GitHub Copilot': { Individual: 10, Business: 19, Enterprise: 39 },
  Claude: { Pro: 20, Team: 30 },
  ChatGPT: { Plus: 20, Team: 25 },
  Windsurf: { Pro: 15, Teams: 30 },
};

export function runAudit(input: AuditInput): AuditResult {
  const recommendations: AuditRecommendation[] = [];
  let totalMonthlySpend = 0;

  input.tools.forEach((tool) => {
    totalMonthlySpend += tool.monthlySpend;
    const rec = evaluateTool(tool);
    if (rec) recommendations.push(rec);
  });

  // Cross-tool optimization (Example: multiple coding assistants)
  const codingAssistants = input.tools.filter(t => 
    ['Cursor', 'GitHub Copilot', 'Windsurf'].includes(t.toolName)
  );

  if (codingAssistants.length > 1) {
    // To avoid double counting: consolidation saving is the current spend of redundant tools
    // but we must subtract any individual savings already accounted for in those tools
    const primaryTool = codingAssistants[0];
    const redundantTools = codingAssistants.slice(1);
    
    const redundantSpend = redundantTools.reduce((sum, t) => sum + t.monthlySpend, 0);
    const individualSavingsAlreadyCounted = recommendations
      .filter(r => redundantTools.some(t => t.toolName === r.toolName))
      .reduce((sum, r) => sum + r.potentialMonthlySavings, 0);

    recommendations.push({
      toolName: redundantTools[0].toolName,
      currentSpend: redundantSpend,
      recommendedAction: 'Consolidate Coding Assistants',
      reasoning: `You're paying for both ${codingAssistants.map(t => t.toolName).join(' and ')}. By consolidating to just ${primaryTool.toolName}, you can eliminate redundant subscriptions.`,
      potentialMonthlySavings: redundantSpend - individualSavingsAlreadyCounted,
    });
  }

  const totalMonthlySavings = recommendations.reduce((sum, r) => sum + r.potentialMonthlySavings, 0);
  const totalAnnualSavings = totalMonthlySavings * 12;

  return {
    totalMonthlySpend,
    totalMonthlySavings,
    totalAnnualSavings,
    recommendations,
    isOptimal: totalMonthlySavings < 100,
  };
}

function evaluateTool(tool: ToolSpend): AuditRecommendation | null {
  const { toolName, planName, monthlySpend, seats } = tool;

  // 1. Cursor Optimization
  if (toolName === 'Cursor') {
    if (planName.toLowerCase().includes('business') && seats < 3) {
      const proCost = PRICING.Cursor.Pro * seats;
      return {
        toolName,
        currentSpend: monthlySpend,
        recommendedAction: 'Downgrade to Pro',
        recommendedPlan: 'Pro',
        potentialMonthlySavings: monthlySpend - proCost,
        reasoning: 'Business tier features (SSO/Admin) are rarely needed for teams under 3 users.',
      };
    }
  }

  // 2. GitHub Copilot Optimization
  if (toolName === 'GitHub Copilot') {
    if (planName.toLowerCase().includes('business') && seats === 1) {
      return {
        toolName,
        currentSpend: monthlySpend,
        recommendedAction: 'Switch to Individual',
        recommendedPlan: 'Individual',
        potentialMonthlySavings: monthlySpend - PRICING['GitHub Copilot'].Individual,
        reasoning: 'You are paying for a Business seat for a single user. The Individual plan offers the same core features for $9/mo less.',
      };
    }
  }

  // 3. Claude Optimization
  if (toolName === 'Claude') {
    if (planName.toLowerCase().includes('team') && seats < 5) {
      const proCost = PRICING.Claude.Pro * seats;
      return {
        toolName,
        currentSpend: monthlySpend,
        recommendedAction: 'Downgrade to Pro',
        recommendedPlan: 'Pro',
        potentialMonthlySavings: monthlySpend - proCost,
        reasoning: 'Claude Team requires a 5-seat minimum payment. At your current team size, Pro seats are more cost-effective.',
      };
    }
  }

  // 4. ChatGPT Optimization
  if (toolName === 'ChatGPT') {
    if (planName.toLowerCase().includes('team') && seats < 2) {
       return {
        toolName,
        currentSpend: monthlySpend,
        recommendedAction: 'Switch to Plus',
        recommendedPlan: 'Plus',
        potentialMonthlySavings: monthlySpend - PRICING.ChatGPT.Plus,
        reasoning: 'ChatGPT Team is designed for 2+ users. A single user gets identical model access on the Plus plan.',
      };
    }
  }

  // 5. API Optimization (Simple heuristic for now)
  if (toolName === 'OpenAI API' || toolName === 'Anthropic API') {
    if (monthlySpend > 500) {
      return {
        toolName,
        currentSpend: monthlySpend,
        recommendedAction: 'Implement Prompt Caching',
        potentialMonthlySavings: monthlySpend * 0.3,
        reasoning: 'At your spend level, implementing prompt caching could reduce your API costs by up to 30%.',
      };
    }
  }

  return null;
}

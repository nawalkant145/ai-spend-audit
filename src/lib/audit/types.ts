export type ToolName = 
  | 'Cursor' 
  | 'GitHub Copilot' 
  | 'Claude' 
  | 'ChatGPT' 
  | 'Anthropic API' 
  | 'OpenAI API' 
  | 'Gemini' 
  | 'Windsurf';

export type PlanName = string;

export type UseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed';

export interface ToolSpend {
  toolName: ToolName;
  planName: PlanName;
  monthlySpend: number;
  seats: number;
}

export interface AuditInput {
  tools: ToolSpend[];
  teamSize: number;
  primaryUseCase: UseCase;
}

export interface AuditRecommendation {
  toolName: ToolName;
  currentSpend: number;
  recommendedAction: string;
  recommendedPlan?: string;
  potentialMonthlySavings: number;
  reasoning: string;
}

export interface AuditResult {
  totalMonthlySpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  recommendations: AuditRecommendation[];
  isOptimal: boolean;
}

import { describe, it, expect } from 'vitest';
import { runAudit } from './engine';
import { AuditInput } from './types';

describe('AuditEngine', () => {
  it('should recommend downgrading Cursor Business for small teams', () => {
    const input: AuditInput = {
      tools: [
        { toolName: 'Cursor', planName: 'Business', monthlySpend: 80, seats: 2 }
      ],
      teamSize: 2,
      primaryUseCase: 'coding'
    };

    const result = runAudit(input);
    const rec = result.recommendations.find(r => r.toolName === 'Cursor');
    
    expect(rec?.recommendedAction).toBe('Downgrade to Pro');
    expect(result.totalMonthlySavings).toBe(40); // 80 - (20 * 2)
  });

  it('should recommend switching Copilot Business to Individual for 1 user', () => {
    const input: AuditInput = {
      tools: [
        { toolName: 'GitHub Copilot', planName: 'Business', monthlySpend: 19, seats: 1 }
      ],
      teamSize: 1,
      primaryUseCase: 'coding'
    };

    const result = runAudit(input);
    const rec = result.recommendations.find(r => r.toolName === 'GitHub Copilot');
    
    expect(rec?.recommendedAction).toBe('Switch to Individual');
    expect(result.totalMonthlySavings).toBe(9);
  });

  it('should recommend consolidating multiple coding assistants', () => {
    const input: AuditInput = {
      tools: [
        { toolName: 'Cursor', planName: 'Pro', monthlySpend: 20, seats: 1 },
        { toolName: 'GitHub Copilot', planName: 'Individual', monthlySpend: 10, seats: 1 }
      ],
      teamSize: 1,
      primaryUseCase: 'coding'
    };

    const result = runAudit(input);
    const consolidationRec = result.recommendations.find(r => r.recommendedAction === 'Consolidate Coding Assistants');
    
    expect(consolidationRec).toBeDefined();
    expect(result.totalMonthlySavings).toBeGreaterThan(0);
  });

  it('should suggest prompt caching for high API spend', () => {
    const input: AuditInput = {
      tools: [
        { toolName: 'OpenAI API', planName: 'Usage', monthlySpend: 1000, seats: 1 }
      ],
      teamSize: 10,
      primaryUseCase: 'mixed'
    };

    const result = runAudit(input);
    const rec = result.recommendations.find(r => r.toolName === 'OpenAI API');
    
    expect(rec?.recommendedAction).toBe('Implement Prompt Caching');
    expect(result.totalMonthlySavings).toBe(300); // 30% of 1000
  });

  it('should return isOptimal=true for already efficient spend', () => {
    const input: AuditInput = {
      tools: [
        { toolName: 'Claude', planName: 'Pro', monthlySpend: 20, seats: 1 }
      ],
      teamSize: 1,
      primaryUseCase: 'writing'
    };

    const result = runAudit(input);
    expect(result.totalMonthlySavings).toBe(0);
    expect(result.isOptimal).toBe(true);
  });

  it('should not double-count savings when consolidating non-optimal tools', () => {
    const input: AuditInput = {
      tools: [
        { toolName: 'Cursor', planName: 'Business', monthlySpend: 80, seats: 2 }, // Savings: 40
        { toolName: 'GitHub Copilot', planName: 'Business', monthlySpend: 19, seats: 1 } // Savings: 9
      ],
      teamSize: 2,
      primaryUseCase: 'coding'
    };

    const result = runAudit(input);
    // Real logic: 
    // 1. Cursor Downgrade: Save $40. Cost remains $40.
    // 2. Copilot Switch: Save $9. Cost remains $10.
    // 3. Consolidate: Drop Copilot entirely. Save the remaining $10.
    // Total savings should be $40 (Cursor) + $19 (Copilot total) = $59.
    
    expect(result.totalMonthlySavings).toBe(59);
  });
});

import { describe, it, expect } from 'vitest';
import { validationNode } from '../nodes/validation.node';
import { createInitialGraphState } from '../state/GraphState';

describe('validationNode', () => {
  it('should normalize valid tickers to uppercase', async () => {
    const state = createInitialGraphState('aapl') as any;
    const update = await validationNode(state);
    expect(update.companyName).toBe('AAPL');
  });

  it('should accept tickers with dots or dashes', async () => {
    const state = createInitialGraphState('brk.b') as any;
    const update = await validationNode(state);
    expect(update.companyName).toBe('BRK.B');
  });

  it('should fail on empty tickers', async () => {
    const state = createInitialGraphState('') as any;
    const update = await validationNode(state);
    expect(update.nodeStatus?.validate_input).toBe('failed');
    expect(update.errors?.validate_input).toContain('required');
  });

  it('should fail on tickers containing invalid characters', async () => {
    const state = createInitialGraphState('AAPL$') as any;
    const update = await validationNode(state);
    expect(update.nodeStatus?.validate_input).toBe('failed');
    expect(update.errors?.validate_input).toContain('symbol format');
  });
});

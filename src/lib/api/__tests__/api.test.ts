import { describe, it, expect } from 'vitest';
import { sendSuccess, sendError } from '../response';
import { validateRequest } from '../request';
import { z } from 'zod';

describe('API Helpers', () => {
  describe('sendSuccess', () => {
    it('should format a successful JSON response envelope', async () => {
      const response = sendSuccess({ foo: 'bar' }, 'Success msg', 200, 150);
      const body = await response.json();

      expect(body.success).toBe(true);
      expect(body.message).toBe('Success msg');
      expect(body.executionTime).toBe(150);
      expect(body.data).toEqual({ foo: 'bar' });
      expect(body.timestamp).toBeDefined();
    });
  });

  describe('sendError', () => {
    it('should format a failed JSON response envelope', async () => {
      const response = sendError('Validation error', 'VALIDATION_ERROR', 400, { field: 'name' });
      const body = await response.json();

      expect(body.success).toBe(false);
      expect(body.error).toBe('Validation error');
      expect(body.errorCode).toBe('VALIDATION_ERROR');
      expect(body.details).toEqual({ field: 'name' });
      expect(body.timestamp).toBeDefined();
    });
  });

  describe('validateRequest', () => {
    const testSchema = z.object({
      company: z.string().min(1),
      limit: z.number().optional(),
    });

    it('should validate and return valid payloads', () => {
      const valid = { company: 'AAPL', limit: 10 };
      const parsed = validateRequest(testSchema, valid);
      expect(parsed).toEqual(valid);
    });

    it('should throw an ApiError containing error details on failure', () => {
      const invalid = { company: '', limit: 'ten' };
      expect(() => validateRequest(testSchema, invalid)).toThrow();
    });
  });
});

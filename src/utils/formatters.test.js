import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, formatPercentage } from './formatters';

describe('formatters', () => {
  describe('formatCurrency', () => {
    it('should format USD correctly', () => {
      expect(formatCurrency(1000, 'USD')).toBe('$1,000');
    });

    it('should format USD correctly', () => {
      expect(formatCurrency(1000, 'USD')).toBe('$1,000');
    });

    it('should handle zero value', () => {
      expect(formatCurrency(0, 'USD')).toBe('$0');
    });

    // Note: JS toLocaleString() might vary by environment, 
    // but in Node/JSDOM it usually uses commas for en-US.
  });

  describe('formatPercentage', () => {
    it('should add + for positive values', () => {
      expect(formatPercentage(15.5)).toBe('+15.5%');
    });

    it('should handle negative values (though unlikely in this context)', () => {
      expect(formatPercentage(-5)).toBe('-5%');
    });

    it('should handle zero', () => {
      expect(formatPercentage(0)).toBe('0%');
    });
  });

  describe('formatDate', () => {
    it('should format date string correctly', () => {
      const date = '2025-12-29';
      expect(formatDate(date)).toMatch(/Dec 29, 2025/);
    });
  });
});

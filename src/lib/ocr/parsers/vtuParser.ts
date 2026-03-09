/**
 * VTU Parser
 * Lightweight parser variant for VTU-style result text.
 */

import { ParseStrategyResult, ParserOptions } from './baseParser';
import { GenericParser } from './genericParser';

export class VtuParser extends GenericParser {
  constructor(options: ParserOptions = {}) {
    super(options);
  }

  getName(): string {
    return 'vtu';
  }

  canParse(text: string): boolean {
    return /\bvtu\b|visvesvaraya|belagavi|scheme/i.test(text) || super.canParse(text);
  }

  parse(text: string): ParseStrategyResult {
    const base = super.parse(text);
    return {
      ...base,
      strategy: 'vtu',
    };
  }
}

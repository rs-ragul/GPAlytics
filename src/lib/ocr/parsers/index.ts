/**
 * Parser Index
 * Export all university parsers
 */

export { BaseParser, ParserRegistry } from './baseParser';
export type { ParserOptions, ParseStrategyResult } from './baseParser';

export { GenericParser } from './genericParser';

export { AnnaParser } from './annaParser';
export { VtuParser } from './vtuParser';

// Default parser registry
import { ParserRegistry } from './baseParser';
import { GenericParser } from './genericParser';
import { AnnaParser } from './annaParser';
import { VtuParser } from './vtuParser';

export function createParserRegistry(): ParserRegistry {
  const registry = new ParserRegistry();
  
  // Register all parsers
  registry.register('generic', new GenericParser());
  registry.register('anna_university', new AnnaParser());
  registry.register('vtu', new VtuParser());
  
  return registry;
}

// Default registry instance
export const defaultRegistry = createParserRegistry();


/**
 * Base Parser Interface
 * Defines the contract for university-specific parsers
 */

import type { ParsedSubject } from '../subjectParser';

export interface ParserOptions {
  strictMode?: boolean;
  removeCodes?: boolean;
  filterNoise?: boolean;
}

export interface ParseStrategyResult {
  subjects: ParsedSubject[];
  confidence: number;
  warnings: string[];
  strategy: string;
}

/**
 * Base parser class that all university parsers should extend
 */
export abstract class BaseParser {
  protected options: ParserOptions;

  constructor(options: ParserOptions = {}) {
    this.options = {
      strictMode: false,
      removeCodes: true,
      filterNoise: true,
      ...options
    };
  }

  /**
   * Parse raw OCR text to extract subjects and grades
   * Each parser should implement its own parsing logic
   */
  abstract parse(text: string): ParseStrategyResult;

  /**
   * Get the parser name/identifier
   */
  abstract getName(): string;

  /**
   * Check if this parser can handle the given text
   * Used for auto-detection of university format
   */
  abstract canParse(text: string): boolean;

  /**
   * Preprocess text before parsing
   */
  protected preprocess(text: string): string {
    return text
      .replace(/\r\n/g, '\n')
      .split('\n')
      .map((line) => line.replace(/[ \t]+/g, ' ').trim())
      .filter((line) => line.length > 0)
      .join('\n');
  }

  /**
   * Extract grade from a line using common patterns
   */
  protected extractGrade(line: string): string | null {
    const gradePattern = /\b(O|A\+|A|B\+|B|C\+|C|WH|WD|UA|RA)\b/i;
    const match = line.match(gradePattern);
    return match ? match[1].toUpperCase() : null;
  }

  /**
   * Get default options
   */
  protected getOptions(): ParserOptions {
    return { ...this.options };
  }
}

/**
 * Parser registry for managing multiple parsers
 */
export class ParserRegistry {
  private parsers: Map<string, BaseParser> = new Map();

  /**
   * Register a parser
   */
  register(name: string, parser: BaseParser): void {
    this.parsers.set(name, parser);
  }

  /**
   * Get a parser by name
   */
  get(name: string): BaseParser | undefined {
    return this.parsers.get(name);
  }

  /**
   * Get all registered parser names
   */
  getNames(): string[] {
    return Array.from(this.parsers.keys());
  }

  /**
   * Auto-detect the best parser for given text
   */
  autoDetect(text: string): BaseParser | null {
    for (const parser of this.parsers.values()) {
      if (parser.canParse(text)) {
        return parser;
      }
    }
    return null;
  }
}


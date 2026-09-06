import { findAozoraRuby } from './notations.js';

/**
 * Removes aozora ruby annotations (요미) from text, keeping base characters.
 * Non-matching brackets are preserved as-is.
 *
 * Examples:
 * - stripRuby('漢字《かんじ》') → '漢字'
 * - stripRuby('｜東京《とうきょう》') → '東京'
 * - stripRuby('今日は面接《めんせつ》の日') → '今日は面接の日'
 * - stripRuby('漢字《》') → '漢字《》' (empty reading — not matched)
 */
export function stripRuby(text: string): string {
  const matches = findAozoraRuby(text);

  if (matches.length === 0) {
    return text;
  }

  // Build result by iterating through text and replacing matched portions
  let result = '';
  let lastIndex = 0;

  for (const match of matches) {
    // Append text before the match
    result += text.slice(lastIndex, match.index);
    // Append the base (replaces the entire matched notation including ｜ and 《要み》)
    result += match.base;
    // Move past this match
    lastIndex = match.index + match.length;
  }

  // Append remaining text after last match
  result += text.slice(lastIndex);

  return result;
}

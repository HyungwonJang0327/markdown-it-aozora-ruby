import type { MarkdownIt } from 'markdown-it';
import { aozoraRubyRule } from './rule.js';

export default function aozoraRuby(md: MarkdownIt): void {
  md.core.ruler.push('aozora_ruby', aozoraRubyRule);
}

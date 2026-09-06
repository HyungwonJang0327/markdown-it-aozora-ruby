import type { MarkdownIt } from 'markdown-it';
import { aozoraRubyRule } from './rule.js';
import { registerRubyRenderers } from './render.js';
import { stripRuby } from './strip.js';

export default function aozoraRuby(md: MarkdownIt): void {
  md.core.ruler.push('aozora_ruby', aozoraRubyRule);
  registerRubyRenderers(md);
}

export { stripRuby };

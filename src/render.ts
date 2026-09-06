import type { MarkdownIt } from 'markdown-it';

export function registerRubyRenderers(md: MarkdownIt): void {
  md.renderer.rules.ruby_open = () => '<ruby>';
  md.renderer.rules.ruby_close = () => '</ruby>';
  md.renderer.rules.ruby_rt_open = () => '<rt>';
  md.renderer.rules.ruby_rt_close = () => '</rt>';
}

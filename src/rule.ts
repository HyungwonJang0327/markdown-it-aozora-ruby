import type { StateCore, Token } from 'markdown-it';
import { findAozoraRuby } from './notations.js';

export function aozoraRubyRule(state: StateCore): void {
  const TokenCtor = state.Token;

  for (const token of state.tokens) {
    if (token.type !== 'inline' || !token.children) continue;

    const newChildren: Token[] = [];
    let changed = false;

    for (const child of token.children) {
      if (child.type !== 'text') {
        newChildren.push(child);
        continue;
      }

      const matches = findAozoraRuby(child.content);
      if (matches.length === 0) {
        newChildren.push(child);
        continue;
      }

      changed = true;
      const level = child.level;
      let pos = 0;

      for (const match of matches) {
        if (match.index > pos) {
          const pre = new TokenCtor('text', '', 0);
          pre.content = child.content.slice(pos, match.index);
          pre.level = level;
          newChildren.push(pre);
        }

        const rubyOpen = new TokenCtor('ruby_open', 'ruby', 1);
        rubyOpen.level = level;
        newChildren.push(rubyOpen);

        const baseToken = new TokenCtor('text', '', 0);
        baseToken.content = match.base;
        baseToken.level = level + 1;
        newChildren.push(baseToken);

        const rtOpen = new TokenCtor('ruby_rt_open', 'rt', 1);
        rtOpen.level = level + 1;
        newChildren.push(rtOpen);

        const readingToken = new TokenCtor('text', '', 0);
        readingToken.content = match.reading;
        readingToken.level = level + 2;
        newChildren.push(readingToken);

        const rtClose = new TokenCtor('ruby_rt_close', 'rt', -1);
        rtClose.level = level + 1;
        newChildren.push(rtClose);

        const rubyClose = new TokenCtor('ruby_close', 'ruby', -1);
        rubyClose.level = level;
        newChildren.push(rubyClose);

        pos = match.index + match.length;
      }

      if (pos < child.content.length) {
        const post = new TokenCtor('text', '', 0);
        post.content = child.content.slice(pos);
        post.level = level;
        newChildren.push(post);
      }
    }

    if (changed) {
      token.children = newChildren;
    }
  }
}

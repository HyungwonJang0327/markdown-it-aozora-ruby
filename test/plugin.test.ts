import MarkdownIt from 'markdown-it';
import type { MarkdownIt as MarkdownItType, Token } from 'markdown-it';
import { describe, expect, it, beforeEach } from 'vitest';
import aozoraRuby from '../src/index.js';

function getInlineChildren(md: MarkdownItType, src: string): Token[] {
  const tokens = md.parse(src, {});
  const inlineToken = tokens.find((t: Token) => t.type === 'inline');
  return inlineToken?.children ?? [];
}

describe('aozoraRuby plugin — token-level tests', () => {
  let md: MarkdownItType;

  beforeEach(() => {
    md = new MarkdownIt();
    md.use(aozoraRuby);
  });

  it('단순 한자+요미 — ruby 시퀀스 6토큰', () => {
    const children = getInlineChildren(md, '漢字《かんじ》');
    expect(children).toHaveLength(6);
    expect(children[0]?.type).toBe('ruby_open');
    expect(children[1]?.type).toBe('text');
    expect(children[1]?.content).toBe('漢字');
    expect(children[2]?.type).toBe('ruby_rt_open');
    expect(children[3]?.type).toBe('text');
    expect(children[3]?.content).toBe('かんじ');
    expect(children[4]?.type).toBe('ruby_rt_close');
    expect(children[5]?.type).toBe('ruby_close');
  });

  it('ruby_open 토큰의 tag와 nesting 확인', () => {
    const children = getInlineChildren(md, '漢字《かんじ》');
    const rubyOpen = children[0]!;
    expect(rubyOpen.tag).toBe('ruby');
    expect(rubyOpen.nesting).toBe(1);
    const rubyClose = children[5]!;
    expect(rubyClose.tag).toBe('ruby');
    expect(rubyClose.nesting).toBe(-1);
    const rtOpen = children[2]!;
    expect(rtOpen.tag).toBe('rt');
    expect(rtOpen.nesting).toBe(1);
    const rtClose = children[4]!;
    expect(rtClose.tag).toBe('rt');
    expect(rtClose.nesting).toBe(-1);
  });

  it('전후 텍스트 보존 — これは漢字《かんじ》です', () => {
    const children = getInlineChildren(md, 'これは漢字《かんじ》です');
    // text(これは), ruby_open, text(漢字), ruby_rt_open, text(かんじ), ruby_rt_close, ruby_close, text(です)
    expect(children).toHaveLength(8);
    expect(children[0]?.type).toBe('text');
    expect(children[0]?.content).toBe('これは');
    expect(children[1]?.type).toBe('ruby_open');
    expect(children[2]?.type).toBe('text');
    expect(children[2]?.content).toBe('漢字');
    expect(children[3]?.type).toBe('ruby_rt_open');
    expect(children[4]?.type).toBe('text');
    expect(children[4]?.content).toBe('かんじ');
    expect(children[5]?.type).toBe('ruby_rt_close');
    expect(children[6]?.type).toBe('ruby_close');
    expect(children[7]?.type).toBe('text');
    expect(children[7]?.content).toBe('です');
  });

  it('한 텍스트에 복수 매치', () => {
    const children = getInlineChildren(md, '漢字《かんじ》と読書《どくしょ》');
    // ruby 시퀀스 x2 + text(と) in between
    // [ruby_open, text(漢字), ruby_rt_open, text(かんじ), ruby_rt_close, ruby_close,
    //  text(と),
    //  ruby_open, text(読書), ruby_rt_open, text(どくしょ), ruby_rt_close, ruby_close]
    expect(children).toHaveLength(13);
    expect(children[0]?.type).toBe('ruby_open');
    expect(children[1]?.content).toBe('漢字');
    expect(children[2]?.type).toBe('ruby_rt_open');
    expect(children[3]?.content).toBe('かんじ');
    expect(children[4]?.type).toBe('ruby_rt_close');
    expect(children[6]?.type).toBe('text');
    expect(children[6]?.content).toBe('と');
    expect(children[7]?.type).toBe('ruby_open');
    expect(children[8]?.content).toBe('読書');
    expect(children[10]?.content).toBe('どくしょ');
    expect(children[11]?.type).toBe('ruby_rt_close');
    expect(children[12]?.type).toBe('ruby_close');
  });

  it('명시 베이스 ｜ベース《よみ》 — base에 ｜ 미포함', () => {
    const children = getInlineChildren(md, '｜ベース《よみ》');
    expect(children).toHaveLength(6);
    expect(children[1]?.type).toBe('text');
    expect(children[1]?.content).toBe('ベース');
    expect(children[3]?.content).toBe('よみ');
  });

  it('매치 없는 텍스트 — children 그대로', () => {
    const children = getInlineChildren(md, 'こんにちは');
    expect(children).toHaveLength(1);
    expect(children[0]?.type).toBe('text');
    expect(children[0]?.content).toBe('こんにちは');
  });

  it('코드 스팬 안의 《》 — code_inline 유지, ruby 토큰 없음', () => {
    const children = getInlineChildren(md, '`漢字《かんじ》`');
    const rubyTokens = children.filter((t) =>
      t.type.startsWith('ruby_')
    );
    expect(rubyTokens).toHaveLength(0);
    const codeToken = children.find((t) => t.type === 'code_inline');
    expect(codeToken).toBeDefined();
  });

  it('html_inline 토큰이 생성되지 않음', () => {
    const children = getInlineChildren(md, '漢字《かんじ》');
    const htmlTokens = children.filter((t) => t.type === 'html_inline');
    expect(htmlTokens).toHaveLength(0);
  });

  it('전각 파이프 명시 베이스 — 중간 텍스트 보존', () => {
    const children = getInlineChildren(md, 'abc｜東京《とうきょう》def');
    expect(children).toHaveLength(8);
    expect(children[0]?.type).toBe('text');
    expect(children[0]?.content).toBe('abc');
    expect(children[1]?.type).toBe('ruby_open');
    expect(children[2]?.content).toBe('東京');
    expect(children[3]?.type).toBe('ruby_rt_open');
    expect(children[4]?.content).toBe('とうきょう');
    expect(children[7]?.type).toBe('text');
    expect(children[7]?.content).toBe('def');
  });
});

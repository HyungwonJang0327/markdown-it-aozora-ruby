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

describe('aozoraRuby plugin — render-level tests', () => {
  let md: MarkdownItType;

  beforeEach(() => {
    md = new MarkdownIt();
    md.use(aozoraRuby);
  });

  it('単純な漢字+要み — <ruby>タグにレンダリング', () => {
    const result = md.render('漢字《かんじ》');
    expect(result).toBe('<p><ruby>漢字<rt>かんじ</rt></ruby></p>\n');
  });

  it('明示ベース ｜東京《とうきょう》', () => {
    const result = md.render('｜東京《とうきょう》');
    expect(result).toBe('<p><ruby>東京<rt>とうきょう</rt></ruby></p>\n');
  });

  it('前後テキストの保存 — これは漢字《かんじ》です', () => {
    const result = md.render('これは漢字《かんじ》です');
    expect(result).toBe('<p>これは<ruby>漢字<rt>かんじ</rt></ruby>です</p>\n');
  });

  it('XSS対策 — 要みに<script>タグを含む', () => {
    const result = md.render('漢字《<script>alert(1)</script>》');
    expect(result).not.toContain('<script>');
    expect(result).toContain('&lt;script&gt;');
  });

  it('XSS対策 — ベースに<b>を含む', () => {
    const result = md.render('｜<b>x</b>《よみ》');
    expect(result).not.toContain('<b>x</b>');
    expect(result).toContain('&lt;b&gt;');
  });

  it('コードスパン内の《》は変換しない', () => {
    const result = md.render('`漢字《かんじ》`');
    expect(result).toContain('<code>');
    expect(result).not.toContain('<ruby>');
    expect(result).toContain('漢字《かんじ》');
  });
});

describe('aozoraRuby plugin — 회귀 테스트', () => {
  let md: MarkdownItType;

  beforeEach(() => {
    md = new MarkdownIt();
    md.use(aozoraRuby);
  });

  it('펜스 코드 블록 안의 《》는 변환하지 않는다', () => {
    const result = md.render('```\n漢字《かんじ》\n```');
    expect(result).toContain('漢字《かんじ》');
    expect(result).not.toContain('<ruby>');
    expect(result).toContain('<pre><code>');
  });

  it('링크 텍스트 안의 루비가 <a> 안에 렌더링된다', () => {
    const result = md.render('[漢字《かんじ》](https://example.com)');
    expect(result).toBe(
      '<p><a href="https://example.com"><ruby>漢字<rt>かんじ</rt></ruby></a></p>\n'
    );
  });

  it('강조 안의 루비 — **強調《きょうちょう》** → <strong> 안에 <ruby>', () => {
    const result = md.render('**強調《きょうちょう》**');
    expect(result).toBe(
      '<p><strong><ruby>強調<rt>きょうちょう</rt></ruby></strong></p>\n'
    );
  });
});

describe('aozoraRuby plugin — Justdown 포팅 케이스', () => {
  let md: MarkdownItType;

  beforeEach(() => {
    md = new MarkdownIt();
    md.use(aozoraRuby);
  });

  // Justdown: '반각 | 도 베이스 경계로 동작한다'
  it('반각 | 베이스 경계 — |お茶《おちゃ》', () => {
    const result = md.render('|お茶《おちゃ》');
    expect(result).toBe('<p><ruby>お茶<rt>おちゃ</rt></ruby></p>\n');
  });

  // Justdown: '인용부호 「」『』는 변환되지 않고 그대로 남는다'
  it('인용부호 「」『』는 그대로 유지된다', () => {
    const result = md.render('「面接《めんせつ》」と『本』');
    expect(result).toBe(
      '<p>「<ruby>面接<rt>めんせつ</rt></ruby>」と『本』</p>\n'
    );
  });

  // Justdown: '한 문장에 여러 후리가나를 모두 변환한다'
  it('한 문장에 여러 루비를 모두 변환한다', () => {
    const result = md.render('面接《めんせつ》の準備《じゅんび》');
    expect(result).toBe(
      '<p><ruby>面接<rt>めんせつ</rt></ruby>の<ruby>準備<rt>じゅんび</rt></ruby></p>\n'
    );
  });

  // Justdown: 'HTML ruby 태그 직접 입력을 그대로 통과시킨다'
  // Justdown은 html:true 설정 사용 — raw 부분은 그대로, 아오조라 표기만 변환됨을 확인
  it('html:true 시 raw <ruby>와 아오조라 표기가 혼합된 경우 각각 올바르게 처리된다', () => {
    const mdHtml = new MarkdownIt({ html: true });
    mdHtml.use(aozoraRuby);
    // raw <ruby>는 그대로 통과, 읽書《どくしょ》는 플러그인이 변환
    const result = mdHtml.render('<ruby>漢字<rt>かんじ</rt></ruby>と読書《どくしょ》');
    expect(result).toBe(
      '<p><ruby>漢字<rt>かんじ</rt></ruby>と<ruby>読書<rt>どくしょ</rt></ruby></p>\n'
    );
  });
});

# markdown-it-aozora-ruby

> Aozora Bunko-style ruby (furigana) notation for [markdown-it](https://github.com/markdown-it/markdown-it) — renders `漢字《かんじ》` as <ruby>漢字<rt>かんじ</rt></ruby>.

[日本語](./README.ja.md) | [한국어](./README.ko.md)

<!-- TODO: npm version / CI badges after first release -->

## Install

```bash
npm install markdown-it-aozora-ruby
```

`markdown-it` (>= 13) is a peer dependency. Zero runtime dependencies.

## Usage in 30 seconds

```ts
import MarkdownIt from 'markdown-it';
import aozoraRuby from 'markdown-it-aozora-ruby';

const md = new MarkdownIt().use(aozoraRuby);

md.render('吾輩《わがはい》は猫である');
// => <p><ruby>吾輩<rt>わがはい</rt></ruby>は猫である</p>

md.render('｜青空文庫《あおぞらぶんこ》');
// => <p><ruby>青空文庫<rt>あおぞらぶんこ</rt></ruby></p>
```

## API

| Export | Signature | Description |
|---|---|---|
| default | `aozoraRuby(md: MarkdownIt): void` | The plugin. No options. |
| `stripRuby` | `stripRuby(text: string): string` | Removes readings, keeps base text — for tables of contents, search indexes. |

## Notation

| Input | Output | Note |
|---|---|---|
| `漢字《かんじ》` | <ruby>漢字<rt>かんじ</rt></ruby> | Preceding Han run is the base |
| `｜東京《とうきょう》` | <ruby>東京<rt>とうきょう</rt></ruby> | `｜` (or `\|`) marks base start explicitly |
| `` `漢字《かんじ》` `` | unchanged | Code spans/blocks are never transformed |

## Background

<!-- TODO: aozora bunko notation history, extracted from Justdown -->

## Design principles

- **Core ruler, not inline ruler** — Aozora bases precede the `《` marker, which inline rules cannot reach back for. Transforming text tokens after inline parsing also keeps code spans untouched for free.
- **Dedicated tokens, no raw HTML** — emits `ruby_*` tokens with renderer rules, so sanitizers and AST tools stay compatible.
- **`\p{Script=Han}`** — covers CJK Extension B and beyond (e.g. 𠮟), unlike BMP-only character ranges.

## License

MIT

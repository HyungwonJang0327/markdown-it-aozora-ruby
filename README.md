# markdown-it-aozora-ruby

> Aozora Bunko-style ruby (furigana) notation for [markdown-it](https://github.com/markdown-it/markdown-it) — renders `漢字《かんじ》` as <ruby>漢字<rt>かんじ</rt></ruby>.

[日本語](https://github.com/HyungwonJang0327/markdown-it-aozora-ruby/blob/main/README.ja.md) | [한국어](https://github.com/HyungwonJang0327/markdown-it-aozora-ruby/blob/main/README.ko.md)

[![npm version](https://img.shields.io/npm/v/markdown-it-aozora-ruby.svg)](https://www.npmjs.com/package/markdown-it-aozora-ruby)
[![CI](https://github.com/HyungwonJang0327/markdown-it-aozora-ruby/actions/workflows/ci.yml/badge.svg)](https://github.com/HyungwonJang0327/markdown-it-aozora-ruby/actions/workflows/ci.yml)
[![license: MIT](https://img.shields.io/npm/l/markdown-it-aozora-ruby.svg)](https://github.com/HyungwonJang0327/markdown-it-aozora-ruby/blob/main/LICENSE)

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

```ts
import { stripRuby } from 'markdown-it-aozora-ruby';

stripRuby('吾輩《わがはい》は猫である');
// => '吾輩は猫である'
```

## Notation

| Input | Output | Note |
|---|---|---|
| `漢字《かんじ》` | <ruby>漢字<rt>かんじ</rt></ruby> | Preceding Han run is the base |
| `｜東京《とうきょう》` | <ruby>東京<rt>とうきょう</rt></ruby> | `｜` (or `\|`) marks base start explicitly |
| `𠮟《しか》る` | <ruby>𠮟<rt>しか</rt></ruby>る | Kanji beyond the BMP work too |
| `漢字《》` | unchanged | Empty readings are not transformed |
| `` `漢字《かんじ》` `` | unchanged | Code spans/blocks are never transformed |

## Background

[Aozora Bunko](https://www.aozora.gr.jp/) (青空文庫, "Blue Sky Library") is a Japanese digital library of public-domain literature. Its plain-text format established a de facto convention for writing ruby (furigana): the reading goes in double angle brackets `《》` immediately after the base text, and `｜` marks where the base starts when it is not a simple run of kanji. Because the notation stays perfectly readable as plain text, it is widely used outside the library too — in fiction manuscripts, self-publishing platforms, and note-taking apps.

Existing markdown-it ruby plugins define their own bracket syntaxes and don't understand the Aozora convention. This package extracts a parser proven in the Justdown note-taking app into a standalone plugin: zero runtime dependencies, dedicated tokens instead of raw HTML, and full Unicode Han support.

## Design principles

- **Core ruler, not inline ruler** — Aozora bases precede the `《` marker, which inline rules cannot reach back for. Transforming text tokens after inline parsing also keeps code spans untouched for free.
- **Dedicated tokens, no raw HTML** — emits `ruby_*` tokens with renderer rules, so sanitizers and AST tools stay compatible.
- **`\p{Script=Han}`** — covers CJK Extension B and beyond (e.g. 𠮟), unlike BMP-only character ranges.

## License

MIT

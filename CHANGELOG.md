# markdown-it-aozora-ruby

## 1.0.1

### Patch Changes

- Docs: use absolute GitHub URLs for README language/license links so they work on the npm package page (relative links 404 there).

## 1.0.0

### Major Changes

- First release. markdown-it plugin that renders Aozora Bunko style ruby notation as HTML `<ruby>` tags.

  - `漢字《かんじ》` (preceding Han run as base) and `｜ベース《よみ》` / `|ベース《よみ》` (explicit base) notations
  - Full Unicode Han support via `\p{Script=Han}` — kanji beyond the BMP (e.g. 𠮟) work
  - Code spans and fenced code blocks are never transformed
  - Emits dedicated `ruby_*` tokens (no raw HTML) — base and reading are escaped, sanitizer/AST friendly
  - `stripRuby()` named export: removes readings for tables of contents and search indexes
  - Zero runtime dependencies; `markdown-it >= 13` as peer dependency; ESM + CJS + type definitions

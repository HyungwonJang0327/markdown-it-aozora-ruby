# markdown-it-aozora-ruby

> [markdown-it](https://github.com/markdown-it/markdown-it) 用の青空文庫式ルビ（ふりがな）記法プラグイン — `漢字《かんじ》` を <ruby>漢字<rt>かんじ</rt></ruby> としてレンダリングします。

[English](https://github.com/HyungwonJang0327/markdown-it-aozora-ruby/blob/main/README.md) | [한국어](https://github.com/HyungwonJang0327/markdown-it-aozora-ruby/blob/main/README.ko.md)

[![npm version](https://img.shields.io/npm/v/markdown-it-aozora-ruby.svg)](https://www.npmjs.com/package/markdown-it-aozora-ruby)
[![CI](https://github.com/HyungwonJang0327/markdown-it-aozora-ruby/actions/workflows/ci.yml/badge.svg)](https://github.com/HyungwonJang0327/markdown-it-aozora-ruby/actions/workflows/ci.yml)
[![license: MIT](https://img.shields.io/npm/l/markdown-it-aozora-ruby.svg)](https://github.com/HyungwonJang0327/markdown-it-aozora-ruby/blob/main/LICENSE)

## インストール

```bash
npm install markdown-it-aozora-ruby
```

`markdown-it`（>= 13）は peer dependency です。ランタイム依存はゼロ。

## 30秒で使い方

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

| Export | シグネチャ | 説明 |
|---|---|---|
| default | `aozoraRuby(md: MarkdownIt): void` | プラグイン本体。オプションなし。 |
| `stripRuby` | `stripRuby(text: string): string` | 読みを取り除き、ベーステキストだけを残します — 目次や検索インデックス向け。 |

```ts
import { stripRuby } from 'markdown-it-aozora-ruby';

stripRuby('吾輩《わがはい》は猫である');
// => '吾輩は猫である'
```

## 記法

| 入力 | 出力 | 備考 |
|---|---|---|
| `漢字《かんじ》` | <ruby>漢字<rt>かんじ</rt></ruby> | 直前の漢字の連続がベースになります |
| `｜東京《とうきょう》` | <ruby>東京<rt>とうきょう</rt></ruby> | `｜`（または `\|`）でベースの開始を明示します |
| `𠮟《しか》る` | <ruby>𠮟<rt>しか</rt></ruby>る | BMP 外の漢字にも対応 |
| `漢字《》` | 変換されません | 空の読みは変換対象外 |
| `` `漢字《かんじ》` `` | 変換されません | コードスパン／コードブロック内は変換しません |

## 背景

[青空文庫](https://www.aozora.gr.jp/)は、パブリックドメインの文学作品を集めた日本の電子図書館です。そのプレーンテキスト形式は、ルビ（ふりがな）表記の事実上の標準を確立しました。読みはベーステキストの直後に二重山括弧 `《》` で書き、ベースが単純な漢字の連続でない場合は `｜` でベースの開始位置を示します。プレーンテキストのまま完全に読める記法のため、青空文庫の外でも広く使われています — 小説の原稿、セルフパブリッシングのプラットフォーム、ノートアプリなど。

既存の markdown-it ルビ系プラグインは独自の括弧記法を定義しており、青空文庫の記法を解釈できません。このパッケージは、ノートアプリ Justdown で実証済みのパーサーを独立したプラグインとして切り出したものです。ランタイム依存ゼロ、raw HTML ではなく専用トークンを使用し、Unicode の Han を完全にサポートします。

## 設計方針

- **inline ruler ではなく core ruler** — 青空文庫記法のベースは `《` マーカーの*前*にあり、inline ルールでは遡って取得できません。inline 解析後に text トークンを変換する方式により、コードスパンが自動的に保護されます。
- **raw HTML ではなく専用トークン** — レンダラールール付きの `ruby_*` トークンを出力するため、サニタイザーや AST ツールと互換性を保ちます。
- **`\p{Script=Han}`** — BMP 限定の文字範囲と異なり、CJK 拡張 B 以降（例: 𠮟）もカバーします。

## ライセンス

MIT

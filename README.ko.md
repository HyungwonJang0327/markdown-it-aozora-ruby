# markdown-it-aozora-ruby

> [markdown-it](https://github.com/markdown-it/markdown-it)용 아오조라 문고식 루비(후리가나) 표기 플러그인 — `漢字《かんじ》`를 <ruby>漢字<rt>かんじ</rt></ruby>로 렌더링합니다.

[English](./README.md) | [日本語](./README.ja.md)

<!-- TODO: npm version / CI badges after first release -->

## 설치

```bash
npm install markdown-it-aozora-ruby
```

`markdown-it`(>= 13)은 peer dependency입니다. 런타임 의존성은 0개.

## 30초 사용법

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

| Export | 시그니처 | 설명 |
|---|---|---|
| default | `aozoraRuby(md: MarkdownIt): void` | 플러그인 본체. 옵션 없음. |
| `stripRuby` | `stripRuby(text: string): string` | 요미를 제거하고 베이스 텍스트만 남깁니다 — 목차·검색 인덱스용. |

```ts
import { stripRuby } from 'markdown-it-aozora-ruby';

stripRuby('吾輩《わがはい》は猫である');
// => '吾輩は猫である'
```

## 표기법

| 입력 | 출력 | 비고 |
|---|---|---|
| `漢字《かんじ》` | <ruby>漢字<rt>かんじ</rt></ruby> | 직전의 연속된 한자가 베이스가 됩니다 |
| `｜東京《とうきょう》` | <ruby>東京<rt>とうきょう</rt></ruby> | `｜`(또는 `\|`)로 베이스 시작을 명시합니다 |
| `𠮟《しか》る` | <ruby>𠮟<rt>しか</rt></ruby>る | BMP 밖 한자도 지원 |
| `漢字《》` | 변환 안 됨 | 빈 요미는 변환하지 않습니다 |
| `` `漢字《かんじ》` `` | 변환 안 됨 | 코드 스팬/코드 블록 안은 변환하지 않습니다 |

## 배경

[아오조라 문고](https://www.aozora.gr.jp/)(青空文庫)는 퍼블릭 도메인 문학 작품을 모은 일본의 전자 도서관입니다. 그 플레인 텍스트 형식이 루비(후리가나) 표기의 사실상 표준을 만들었습니다: 요미(읽기)는 베이스 텍스트 바로 뒤 이중 꺾쇠 `《》` 안에 쓰고, 베이스가 단순한 한자 연속이 아닐 때는 `｜`로 베이스 시작 위치를 표시합니다. 플레인 텍스트 그대로 완벽하게 읽히는 표기법이라 아오조라 문고 밖에서도 널리 쓰입니다 — 소설 원고, 셀프 퍼블리싱 플랫폼, 노트 앱 등.

기존 markdown-it 루비 플러그인들은 저마다의 괄호 문법을 정의하며 아오조라 표기를 해석하지 못합니다. 이 패키지는 노트 앱 Justdown에서 검증된 파서를 독립 플러그인으로 분리한 것입니다: 런타임 의존성 0, raw HTML 대신 전용 토큰 사용, Unicode Han 완전 지원.

## 설계 원칙

- **inline ruler가 아닌 core ruler** — 아오조라 표기의 베이스는 `《` 마커 *앞*에 있어 inline 룰로는 거슬러 올라가 잡을 수 없습니다. inline 파싱 후 text 토큰을 변환하는 방식 덕분에 코드 스팬이 자동으로 보호됩니다.
- **raw HTML이 아닌 전용 토큰** — 렌더러 룰이 붙은 `ruby_*` 토큰을 출력하므로 새니타이저·AST 도구와 호환됩니다.
- **`\p{Script=Han}`** — BMP 한정 문자 범위와 달리 CJK 확장 B 이후(예: 𠮟)까지 커버합니다.

## 라이선스

MIT

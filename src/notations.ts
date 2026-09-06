export interface RubyMatch {
  index: number;   // 원문에서 매치 시작 (｜ 포함)
  length: number;  // 매치 전체 길이 (｜ 및 《요미》 포함)
  base: string;    // 베이스 텍스트 (｜ 제외)
  reading: string; // 요미 (《》 안)
}

// 명시 베이스: [｜|] + 베이스 + 《요미》
// 암시 베이스: 한자 run ([\p{Script=Han}々〆ヶ]+) + 《요미》
// 요미는 빈 문자열 불가 ([^《》\n]+ — 최소 1자)
const AOZORA_RE = /(?:[｜|]([^《》｜|\n]+)|([\p{Script=Han}々〆ヶ]+))《([^《》\n]+)》/gu;

export function findAozoraRuby(text: string): RubyMatch[] {
  AOZORA_RE.lastIndex = 0;
  const results: RubyMatch[] = [];
  let m: RegExpExecArray | null;
  while ((m = AOZORA_RE.exec(text)) !== null) {
    const base = m[1] ?? m[2] ?? '';
    const reading = m[3] ?? '';
    results.push({
      index: m.index,
      length: m[0].length,
      base,
      reading,
    });
  }
  return results;
}

import { describe, expect, it } from 'vitest';
import { findAozoraRuby } from '../src/notations.js';

describe('findAozoraRuby', () => {
  describe('암시 베이스 — 한자 연속 run', () => {
    it('단순 한자+요미', () => {
      const result = findAozoraRuby('漢字《かんじ》');
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        index: 0,
        length: '漢字《かんじ》'.length,
        base: '漢字',
        reading: 'かんじ',
      });
    });

    it('텍스트 중간에 위치한 매치', () => {
      const result = findAozoraRuby('今日は漢字《かんじ》を書く');
      expect(result).toHaveLength(1);
      expect(result[0]?.base).toBe('漢字');
      expect(result[0]?.reading).toBe('かんじ');
      expect(result[0]?.index).toBe('今日は'.length);
    });

    it('복수 매치', () => {
      const result = findAozoraRuby('漢字《かんじ》と読書《どくしょ》');
      expect(result).toHaveLength(2);
      expect(result[0]?.base).toBe('漢字');
      expect(result[1]?.base).toBe('読書');
    });
  });

  describe('명시 베이스 — 전각 ｜', () => {
    it('전각 파이프로 한자 명시', () => {
      const result = findAozoraRuby('｜東京《とうきょう》');
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        index: 0,
        length: '｜東京《とうきょう》'.length,
        base: '東京',
        reading: 'とうきょう',
      });
    });

    it('base에 ｜ 자체를 포함하지 않음', () => {
      const result = findAozoraRuby('｜東京《とうきょう》');
      expect(result[0]?.base).toBe('東京');
    });

    it('전각 ｜로 비한자 포함 베이스 — 히라가나 포함', () => {
      const result = findAozoraRuby('｜お茶《おちゃ》');
      expect(result).toHaveLength(1);
      expect(result[0]?.base).toBe('お茶');
      expect(result[0]?.reading).toBe('おちゃ');
    });

    it('전각 ｜로 한자 포함 베이스', () => {
      const result = findAozoraRuby('｜東京都《とうきょうと》');
      expect(result).toHaveLength(1);
      expect(result[0]?.base).toBe('東京都');
    });
  });

  describe('명시 베이스 — 반각 |', () => {
    it('반각 파이프로 명시', () => {
      const result = findAozoraRuby('|東京《とうきょう》');
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        index: 0,
        length: '|東京《とうきょう》'.length,
        base: '東京',
        reading: 'とうきょう',
      });
    });

    it('반각 | 로 히라가나 포함 베이스', () => {
      const result = findAozoraRuby('|東京都《とうきょうと》');
      expect(result).toHaveLength(1);
      expect(result[0]?.base).toBe('東京都');
    });
  });

  describe('BMP 밖 한자 (Supplementary CJK)', () => {
    it('𠮟 단독 — 암시 베이스', () => {
      const result = findAozoraRuby('𠮟《しか》');
      expect(result).toHaveLength(1);
      expect(result[0]?.base).toBe('𠮟');
      expect(result[0]?.reading).toBe('しか');
    });

    it('𠮟《しか》る — 후행 텍스트 있을 때 index/length 정확성', () => {
      // 𠮟는 surrogate pair (U+20B9F) 이므로 .length = 2
      const text = '𠮟《しか》る';
      const result = findAozoraRuby(text);
      expect(result).toHaveLength(1);
      const m = result[0]!;
      expect(m.base).toBe('𠮟');
      expect(m.reading).toBe('しか');
      // index는 0 (매치 시작이 text의 처음)
      expect(m.index).toBe(0);
      // length는 매치 전체 (𠮟 2 chars + 《 1 + しか 2 + 》 1 = 6)
      expect(m.length).toBe('𠮟《しか》'.length);
      // text에서 슬라이스해서 매치 부분 확인
      expect(text.slice(m.index, m.index + m.length)).toBe('𠮟《しか》');
    });

    it('𠮟る《しかる》 — る가 비한자이므로 미매치 (암시 베이스 없음)', () => {
      // 《 직전이 る(비한자)이므로 암시 베이스 없음, 명시 베이스도 없음
      const result = findAozoraRuby('𠮟る《しかる》');
      expect(result).toHaveLength(0);
    });

    it('｜𠮟る《しかる》 — 명시 베이스로 매치', () => {
      const result = findAozoraRuby('｜𠮟る《しかる》');
      expect(result).toHaveLength(1);
      expect(result[0]?.base).toBe('𠮟る');
      expect(result[0]?.reading).toBe('しかる');
    });
  });

  describe('특수 문자 — ヶ', () => {
    it('ヶ를 포함한 한자 run — 암시 베이스', () => {
      // ヶ는 Script=Katakana이지만 한자 run에 포함
      const result = findAozoraRuby('一ヶ月《いっかげつ》');
      expect(result).toHaveLength(1);
      expect(result[0]?.base).toBe('一ヶ月');
      expect(result[0]?.reading).toBe('いっかげつ');
    });

    it('々 반복 부호', () => {
      const result = findAozoraRuby('人々《ひとびと》');
      expect(result).toHaveLength(1);
      expect(result[0]?.base).toBe('人々');
      expect(result[0]?.reading).toBe('ひとびと');
    });

    it('〆 기호', () => {
      const result = findAozoraRuby('〆切《しめきり》');
      expect(result).toHaveLength(1);
      expect(result[0]?.base).toBe('〆切');
    });
  });

  describe('매치 안 함 케이스', () => {
    it('빈 요미 《》는 변환 안 함', () => {
      const result = findAozoraRuby('漢字《》');
      expect(result).toHaveLength(0);
    });

    it('｜만 있고 《》 없으면 원문 유지', () => {
      const result = findAozoraRuby('｜東京');
      expect(result).toHaveLength(0);
    });

    it('빈 문자열', () => {
      const result = findAozoraRuby('');
      expect(result).toHaveLength(0);
    });

    it('일반 텍스트', () => {
      const result = findAozoraRuby('Hello world');
      expect(result).toHaveLength(0);
    });

    it('《》만 있고 앞에 한자 없음', () => {
      const result = findAozoraRuby('abc《かんじ》');
      expect(result).toHaveLength(0);
    });
  });

  describe('RubyMatch index/length 정확성', () => {
    it('index는 매치 전체의 시작 (｜ 포함)', () => {
      const text = 'abc｜東京《とうきょう》def';
      const result = findAozoraRuby(text);
      expect(result).toHaveLength(1);
      const m = result[0]!;
      expect(m.index).toBe('abc'.length);
      expect(text.slice(m.index, m.index + m.length)).toBe('｜東京《とうきょう》');
    });

    it('length는 매치 전체 길이', () => {
      const text = '漢字《かんじ》';
      const result = findAozoraRuby(text);
      expect(result[0]?.length).toBe(text.length);
    });

    it('명시 베이스의 index는 ｜ 포함한 위치', () => {
      const text = '｜東京《とうきょう》';
      const result = findAozoraRuby(text);
      expect(result[0]?.index).toBe(0);
      expect(result[0]?.length).toBe(text.length);
    });
  });

  describe('throw 없음 — 항상 안전하게 반환', () => {
    it('빈 문자열에서 throw 안 함', () => {
      expect(() => findAozoraRuby('')).not.toThrow();
    });

    it('정상 텍스트에서 throw 안 함', () => {
      expect(() => findAozoraRuby('普通のテキスト')).not.toThrow();
    });

    it('짝 안 맞는 《만 있는 경우 throw 안 함', () => {
      expect(() => findAozoraRuby('テキスト《かんじ')).not.toThrow();
      expect(() => findAozoraRuby('漢字《しか')).not.toThrow();
    });

    it('짝 안 맞는 》만 있는 경우 throw 안 함', () => {
      expect(() => findAozoraRuby('テキスト》かんじ')).not.toThrow();
    });

    it('｜ 단독 (《》 없음) 에서 throw 안 함', () => {
      expect(() => findAozoraRuby('｜テキスト')).not.toThrow();
    });

    it('개행 포함된 텍스트에서 throw 안 함', () => {
      expect(() => findAozoraRuby('漢字《かんじ\n》')).not.toThrow();
      expect(() => findAozoraRuby('｜テキ\nスト《テキスト》')).not.toThrow();
      // 개행은 요미/베이스에 허용되지 않으므로 미매치 — \n 배제 불변식
      expect(findAozoraRuby('漢字《かんじ\n》')).toEqual([]);
      expect(findAozoraRuby('｜テキ\nスト《テキスト》')).toEqual([]);
    });

    it('매치 실패한 다양한 입력에서 빈 배열 반환', () => {
      expect(findAozoraRuby('《かんじ')).toEqual([]);
      expect(findAozoraRuby('》かんじ')).toEqual([]);
      expect(findAozoraRuby('｜')).toEqual([]);
    });
  });

  describe('성능 — 조기 반환 가드', () => {
    it('《 없는 한자 5만 자 입력이 1초 이내에 빈 배열 반환', () => {
      // 가드 전에는 닫히지 않는 베이스 run을 정규식이 O(n²)로 스캔해 4초+ 소요
      const text = '漢'.repeat(50_000);
      const start = performance.now();
      const result = findAozoraRuby(text);
      const elapsed = performance.now() - start;
      expect(result).toEqual([]);
      expect(elapsed).toBeLessThan(1000);
    });
  });
});

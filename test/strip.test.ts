import { describe, expect, it } from 'vitest';
import { stripRuby } from '../src/index.js';

describe('stripRuby — 요미 제거 유틸', () => {
  it('완료 조건: 명시 베이스 with ｜', () => {
    expect(stripRuby('｜東京《とうきょう》')).toBe('東京');
  });

  it('암시 베이스: 한자 연속만', () => {
    expect(stripRuby('漢字《かんじ》')).toBe('漢字');
  });

  it('전후 텍스트 보존', () => {
    expect(stripRuby('今日は面接《めんせつ》の日')).toBe('今日は面接の日');
  });

  it('복수 매치', () => {
    expect(stripRuby('面接《めんせつ》の準備《じゅんび》')).toBe('面接の準備');
  });

  it('매치 없음 — 일반 텍스트', () => {
    expect(stripRuby('Hello World')).toBe('Hello World');
  });

  it('매치 없음 — 빈 문자열', () => {
    expect(stripRuby('')).toBe('');
  });

  it('매치 없음 — 빈 요미는 매치되지 않음', () => {
    expect(stripRuby('漢字《》')).toBe('漢字《》');
  });

  it('매치 없음 — 짝 없는 ｜', () => {
    expect(stripRuby('｜')).toBe('｜');
  });

  it('BMP 밖 한자: 𠮟《しか》る', () => {
    expect(stripRuby('𠮟《しか》る')).toBe('𠮟る');
  });

  it('Justdown 포팅 1: 면접·준비 2개 매치', () => {
    expect(stripRuby('面接《めんせつ》の準備《じゅんび》')).toBe('面接の準備');
  });

  it('Justdown 포팅 2: 명시 베이스 제거', () => {
    expect(stripRuby('｜お茶《おちゃ》を飲む')).toBe('お茶を飲む');
  });

  it('named export 확인 — index.ts에서 import 가능', () => {
    // stripRuby가 function이고 callable임을 검증
    expect(typeof stripRuby).toBe('function');
    expect(stripRuby('|test《テスト》')).toBe('test');
  });
});

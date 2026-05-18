import { describe, it, expect } from 'vitest';
import { braillePatterns } from '../data/braille-patterns';

describe('braillePatterns data', () => {
  it('has exactly 5 entries', () => {
    expect(braillePatterns).toHaveLength(5);
  });

  it('positions are sequential starting at 1', () => {
    braillePatterns.forEach((p, i) => {
      expect(p.position).toBe(i + 1);
    });
  });

  it('is sorted alphabetically by name', () => {
    const names = braillePatterns.map(p => p.name);
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });

  it('every entry has required fields: name, audioUrl, position', () => {
    braillePatterns.forEach(p => {
      expect(p.name).toBeTruthy();
      expect(p.audioUrl).toBeTruthy();
      expect(typeof p.position).toBe('number');
    });
  });

  it('all audioUrls are YouTube links', () => {
    braillePatterns.forEach(p => {
      expect(p.audioUrl).toMatch(/youtu\.be|youtube\.com/);
    });
  });

  it('all pictureUrls use public-root-relative paths starting with /pattern-images/', () => {
    braillePatterns.forEach(p => {
      if (p.pictureUrl) {
        expect(p.pictureUrl).toMatch(/^\/pattern-images\//);
      }
    });
  });
});

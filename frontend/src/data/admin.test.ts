import { describe, expect, it } from 'vitest';
import { slugify } from '../data/admin';

describe('slugify', () => {
  it('lowercases and hyphenates spaces', () => {
    expect(slugify('Men')).toBe('men');
    expect(slugify('T Shirts')).toBe('t-shirts');
  });

  it('strips punctuation and collapses repeated separators', () => {
    expect(slugify("Women's Wear!!")).toBe('women-s-wear');
    expect(slugify('  Loungewear   & Co.  ')).toBe('loungewear-co');
  });

  it('trims leading and trailing hyphens', () => {
    expect(slugify('-- Kids --')).toBe('kids');
  });

  it('handles an already-clean slug unchanged', () => {
    expect(slugify('mini-dresses')).toBe('mini-dresses');
  });

  it('returns an empty string for input with no letters or numbers', () => {
    expect(slugify('!!!')).toBe('');
  });
});

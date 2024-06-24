import { test, expect } from 'vitest';

import { AnsiSgrParser } from './ansiParser.js';

test('scroll', async () => {
  expect(AnsiSgrParser.isScroll('[<64;1;1M')).toBe(true);
  expect(AnsiSgrParser.isScroll('[<65;1;1M')).toBe(true);

  // little m not supported
  expect(AnsiSgrParser.isScroll('[<65;1;1m')).toBe(false);
  expect(AnsiSgrParser.isScroll('[<64;1;1m')).toBe(false);

  expect(AnsiSgrParser.getScroll('[<65;1;1M')).toHaveProperty(
    'direction',
    'scrolldown',
  );
  expect(AnsiSgrParser.getScroll('[<64;1;1M')).toHaveProperty(
    'direction',
    'scrollup',
  );
  expect(AnsiSgrParser.getScroll('[<65;1;1M')).toHaveProperty('x', 1);
  expect(AnsiSgrParser.getScroll('[<65;1;1M')).toHaveProperty('y', 1);
  expect(AnsiSgrParser.getScroll('[<65;4000;42M')).toHaveProperty('x', 4000);
  expect(AnsiSgrParser.getScroll('[<65;4000;42M')).toHaveProperty('y', 42);
});

test('drag', async () => {
  expect(AnsiSgrParser.isDrag('[<32;1;1M')).toBe(true);
  // we don't care about the m or M
  expect(AnsiSgrParser.isDrag('[<32;1;1m')).toBe(true);

  expect(AnsiSgrParser.getDrag('[<32;1;1M')).toHaveProperty('x', 1);
  expect(AnsiSgrParser.getDrag('[<32;1;1M')).toHaveProperty('y', 1);
  expect(AnsiSgrParser.getDrag('[<32;4000;42M')).toHaveProperty('x', 4000);
  expect(AnsiSgrParser.getDrag('[<32;4000;42M')).toHaveProperty('y', 42);
});

test('move', async () => {
  expect(AnsiSgrParser.isMove('[<35;1;1M')).toBe(true);
  expect(AnsiSgrParser.isMove('[<35;1;1m')).toBe(false);

  expect(AnsiSgrParser.getMove('[<35;1;1M')).toHaveProperty('x', 1);
  expect(AnsiSgrParser.getMove('[<35;1;1M')).toHaveProperty('y', 1);
  expect(AnsiSgrParser.getMove('[<35;4000;42M')).toHaveProperty('x', 4000);
  expect(AnsiSgrParser.getMove('[<35;4000;42M')).toHaveProperty('y', 42);
});

test('click', async () => {
  expect(AnsiSgrParser.isClick('[<0;1;1M')).toBe(true);
  expect(AnsiSgrParser.isClick('[<0;1;1m')).toBe(true);

  expect(AnsiSgrParser.getClick('[<0;1;1M')).toHaveProperty('x', 1);
  expect(AnsiSgrParser.getClick('[<0;1;1M')).toHaveProperty('y', 1);
  expect(AnsiSgrParser.getClick('[<0;4000;42M')).toHaveProperty('x', 4000);
  expect(AnsiSgrParser.getClick('[<0;4000;42M')).toHaveProperty('y', 42);
});

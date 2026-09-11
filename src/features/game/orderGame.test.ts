import { describe, expect, it } from 'vitest';
import { isCorrectOrder, moveLine, programLines } from './orderGameLogic';

describe('order game engine', () => {
  it('moves a line up without mutating input', () => {
    const input = ['main', 'using'];

    expect(moveLine(input, 1, -1)).toEqual(['using', 'main']);
    expect(input).toEqual(['main', 'using']);
  });

  it('keeps lines in place when a requested move leaves the list', () => {
    expect(moveLine(['using', 'main'], 0, -1)).toEqual(['using', 'main']);
    expect(moveLine(['using', 'main'], 1, 1)).toEqual(['using', 'main']);
  });

  it('accepts only the exact program line IDs in their intended order', () => {
    expect(isCorrectOrder(programLines.map((line) => line.id))).toBe(true);
    expect(isCorrectOrder([...programLines].reverse().map((line) => line.id))).toBe(false);
  });
});

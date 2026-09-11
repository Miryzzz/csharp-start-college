import { describe, expect, it } from 'vitest';
import { scoreQuiz } from './quizEngine';

const sampleQuestions = [
  { id: 'q1', correctId: 'b' },
  { id: 'q2', correctId: 'a' },
] as const;

describe('quiz engine', () => {
  it('scores one answer per question', () => {
    expect(scoreQuiz({ q1: 'b', q2: 'a' }, sampleQuestions)).toEqual({ correct: 2, total: 2 });
  });

  it('counts missing and incorrect answers as incorrect', () => {
    expect(scoreQuiz({ q1: 'a' }, sampleQuestions)).toEqual({ correct: 0, total: 2 });
  });
});

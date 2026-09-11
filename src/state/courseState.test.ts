import { afterEach, describe, expect, it } from 'vitest';
import {
  courseReducer,
  initialCourseState,
  selectProgress,
} from './courseState';
import type { TopicId } from '../content/course';
import { loadCourseState, saveCourseState } from './storage';

describe('course state', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('marks each topic once and calculates stable progress', () => {
    const once = courseReducer(initialCourseState, { type: 'VISIT_TOPIC', id: 'variables' });
    const twice = courseReducer(once, { type: 'VISIT_TOPIC', id: 'variables' });

    expect(twice.visitedTopics).toEqual(['variables']);
    expect(selectProgress(twice)).toBe(selectProgress(once));
    expect(selectProgress(twice)).toBe(8);
  });

  it('weights completed course activities as 40, 25, and 35 percent', () => {
    const completedTopicIds: TopicId[] = ['variables', 'io', 'conditions', 'loops', 'methods'];
    const topicsComplete = completedTopicIds.reduce(
      (state, id) => courseReducer(state, { type: 'VISIT_TOPIC', id }),
      initialCourseState,
    );
    const gameComplete = courseReducer(topicsComplete, { type: 'COMPLETE_GAME' });
    const quizComplete = courseReducer(gameComplete, { type: 'COMPLETE_QUIZ' });

    expect(selectProgress(topicsComplete)).toBe(40);
    expect(selectProgress(gameComplete)).toBe(65);
    expect(selectProgress(quizComplete)).toBe(100);
  });

  it('records answers and resets the learner state', () => {
    const answered = courseReducer(initialCourseState, {
      type: 'ANSWER_QUIZ',
      questionId: 'types',
      answer: 2,
    });
    const changedTheme = courseReducer(answered, { type: 'SET_THEME', theme: 'light' });

    expect(changedTheme).toMatchObject({ theme: 'light', quizAnswers: { types: 2 } });
    expect(courseReducer(changedTheme, { type: 'RESET' })).toEqual(initialCourseState);
  });
});

describe('course storage', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('falls back when persisted JSON is invalid', () => {
    localStorage.setItem('csharp-start-state', '{broken');

    expect(loadCourseState()).toEqual(initialCourseState);
  });

  it('restores a saved course state', () => {
    const state = courseReducer(initialCourseState, { type: 'COMPLETE_GAME' });
    saveCourseState(state);

    expect(loadCourseState()).toEqual(state);
  });

  it('does not let duplicate persisted topic IDs inflate progress', () => {
    localStorage.setItem('csharp-start-state', JSON.stringify({
      ...initialCourseState,
      visitedTopics: ['variables', 'variables'],
    }));

    expect(selectProgress(loadCourseState())).toBe(8);
  });
});

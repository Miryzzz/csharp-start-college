import { topicIds, type TopicId } from '../content/course';
import { initialCourseState, type CourseState, type Theme } from './courseState';

const storageKey = 'csharp-start-state';

function isTheme(value: unknown): value is Theme {
  return value === 'dark' || value === 'light';
}

function isCourseState(value: unknown): value is CourseState {
  if (!value || typeof value !== 'object') return false;

  const candidate = value as Partial<CourseState>;
  return isTheme(candidate.theme)
    && Array.isArray(candidate.visitedTopics)
    && candidate.visitedTopics.every((id): id is TopicId => topicIds.includes(id as TopicId))
    && typeof candidate.labComplete === 'boolean'
    && typeof candidate.gameComplete === 'boolean'
    && typeof candidate.quizAnswers === 'object'
    && candidate.quizAnswers !== null
    && Object.values(candidate.quizAnswers).every((answer) => typeof answer === 'number')
    && typeof candidate.quizComplete === 'boolean';
}

export function loadCourseState(): CourseState {
  try {
    const savedState = localStorage.getItem(storageKey);
    if (!savedState) return initialCourseState;

    const parsedState: unknown = JSON.parse(savedState);
    return isCourseState(parsedState) ? parsedState : initialCourseState;
  } catch {
    return initialCourseState;
  }
}

export function saveCourseState(state: CourseState): void {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch {
    // The lesson remains usable when storage is disabled or full.
  }
}

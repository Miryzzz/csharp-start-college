import { topicIds, type TopicId } from '../content/course';

export type Theme = 'dark' | 'light';

export interface CourseState {
  theme: Theme;
  visitedTopics: TopicId[];
  labComplete: boolean;
  gameComplete: boolean;
  quizAnswers: Record<string, number>;
  quizComplete: boolean;
}

export type CourseAction =
  | { type: 'SET_THEME'; theme: Theme }
  | { type: 'VISIT_TOPIC'; id: TopicId }
  | { type: 'COMPLETE_LAB' }
  | { type: 'COMPLETE_GAME' }
  | { type: 'ANSWER_QUIZ'; questionId: string; answer: number }
  | { type: 'COMPLETE_QUIZ' }
  | { type: 'RESET' };

export const initialCourseState: CourseState = {
  theme: 'dark',
  visitedTopics: [],
  labComplete: false,
  gameComplete: false,
  quizAnswers: {},
  quizComplete: false,
};

export function courseReducer(state: CourseState, action: CourseAction): CourseState {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.theme };
    case 'VISIT_TOPIC':
      return state.visitedTopics.includes(action.id)
        ? state
        : { ...state, visitedTopics: [...state.visitedTopics, action.id] };
    case 'COMPLETE_LAB':
      return { ...state, labComplete: true };
    case 'COMPLETE_GAME':
      return { ...state, gameComplete: true };
    case 'ANSWER_QUIZ':
      return { ...state, quizAnswers: { ...state.quizAnswers, [action.questionId]: action.answer } };
    case 'COMPLETE_QUIZ':
      return { ...state, quizComplete: true };
    case 'RESET':
      return initialCourseState;
  }
}

export function selectProgress(state: CourseState): number {
  const visitedCount = new Set(state.visitedTopics.filter((id) => topicIds.includes(id))).size;
  const topicProgress = (visitedCount / topicIds.length) * 40;
  const activityProgress = (state.labComplete ? 20 : 0)
    + (state.gameComplete ? 15 : 0)
    + (state.quizComplete ? 25 : 0);

  return Math.round(Math.min(100, topicProgress + activityProgress));
}

export interface ScoredQuestion<T extends string | number = string | number> {
  id: string;
  correctId: T;
}

export function scoreQuiz<T extends string | number>(
  answers: Partial<Record<string, T>>,
  questions: readonly ScoredQuestion<T>[],
): { correct: number; total: number } {
  return {
    correct: questions.filter((question) => answers[question.id] === question.correctId).length,
    total: questions.length,
  };
}

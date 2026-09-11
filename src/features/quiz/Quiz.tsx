import { CheckCircle2, ChevronRight, RotateCcw, XCircle } from 'lucide-react';
import { useState } from 'react';
import { quizQuestions } from './questions';
import { scoreQuiz } from './quizEngine';

interface QuizProps {
  answers: Record<string, number>;
  onAnswer: (questionId: string, answer: number) => void;
  onComplete: () => void;
}

function firstUnansweredIndex(answers: Record<string, number>): number {
  const index = quizQuestions.findIndex((question) => answers[question.id] === undefined);
  return index === -1 ? quizQuestions.length - 1 : index;
}

export function Quiz({ answers, onAnswer, onComplete }: QuizProps) {
  const [currentIndex, setCurrentIndex] = useState(() => firstUnansweredIndex(answers));
  const [showResults, setShowResults] = useState(false);
  const [restartAnswers, setRestartAnswers] = useState<Record<string, number> | null>(null);
  const activeAnswers = restartAnswers ?? answers;
  const question = quizQuestions[currentIndex];
  const selectedAnswer = activeAnswers[question.id];
  const answered = selectedAnswer !== undefined;
  const correct = selectedAnswer === question.correctId;
  const result = scoreQuiz(activeAnswers, quizQuestions);

  const answerQuestion = (answer: number) => {
    if (answered) return;
    if (restartAnswers) setRestartAnswers({ ...restartAnswers, [question.id]: answer });
    onAnswer(question.id, answer);
  };

  const next = () => {
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex((index) => index + 1);
      return;
    }
    setShowResults(true);
    onComplete();
  };

  const restart = () => {
    setRestartAnswers({});
    setCurrentIndex(0);
    setShowResults(false);
  };

  if (showResults) {
    return (
      <article className="quiz glass-card" aria-labelledby="quiz-title">
        <p className="eyebrow">Проверка знаний</p>
        <h2 id="quiz-title">Ваш результат: {result.correct} из {result.total}</h2>
        <p className="quiz-result-copy">{result.correct === result.total ? 'Отлично! Вы уверенно ориентируетесь в первых шагах C#.' : 'Хорошая попытка. Прочитайте пояснения и при желании ответьте на вопросы ещё раз.'}</p>
        <button className="button button-secondary" onClick={restart} type="button"><RotateCcw aria-hidden="true" size={17} /> Пройти тест ещё раз</button>
      </article>
    );
  }

  return (
    <article className="quiz glass-card" aria-labelledby="quiz-title">
      <div className="quiz-heading">
        <p className="eyebrow">Проверка знаний</p>
        <p className="quiz-counter">Вопрос {currentIndex + 1} из {quizQuestions.length} · {question.topic}</p>
        <h2 id="quiz-title">{question.prompt}</h2>
      </div>
      <div className="quiz-options" role="radiogroup" aria-label={question.prompt}>
        {question.options.map((option) => {
          const selected = selectedAnswer === option.id;
          return <button aria-checked={selected} className={`quiz-option${selected ? ' quiz-option-selected' : ''}`} disabled={answered} key={option.id} onClick={() => answerQuestion(option.id)} role="radio" type="button"><span aria-hidden="true">{String.fromCharCode(65 + option.id)}</span>{option.label}</button>;
        })}
      </div>
      <div className={`quiz-feedback${answered ? (correct ? ' quiz-feedback-success' : ' quiz-feedback-error') : ''}`} aria-live="polite" role="status">
        {answered && <>{correct ? <CheckCircle2 aria-hidden="true" size={19} /> : <XCircle aria-hidden="true" size={19} />}<span><strong>{correct ? 'Верно.' : 'Пока неверно.'}</strong> {question.explanation}</span></>}
      </div>
      <button className="button button-primary" disabled={!answered} onClick={next} type="button">{currentIndex === quizQuestions.length - 1 ? 'Показать результат' : 'Следующий вопрос'} <ChevronRight aria-hidden="true" size={17} /></button>
    </article>
  );
}

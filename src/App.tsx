import { ArrowDown, ArrowRight, Sparkles } from 'lucide-react';
import { useCallback, useEffect, useReducer, useState } from 'react';
import { Completion } from './components/Completion';
import { Header } from './components/Header';
import { PracticeCard } from './components/PracticeCard';
import { ProgrammingFlow } from './components/ProgrammingFlow';
import { TopicExplorer } from './components/TopicExplorer';
import type { TopicId } from './content/course';
import { OrderGame } from './features/game/OrderGame';
import { CodeLab } from './features/lab/CodeLab';
import { Quiz } from './features/quiz/Quiz';
import { FindError } from './features/rules/FindError';
import { RulesGrid } from './features/rules/RulesGrid';
import { courseReducer, selectProgress } from './state/courseState';
import { loadCourseState, saveCourseState } from './state/storage';

export function App() {
  const [courseState, dispatch] = useReducer(courseReducer, undefined, loadCourseState);
  const [activityReset, setActivityReset] = useState(0);
  const progress = selectProgress(courseState);
  const visitTopic = useCallback((id: TopicId) => dispatch({ type: 'VISIT_TOPIC', id }), []);
  const resetCourse = () => {
    dispatch({ type: 'RESET' });
    setActivityReset((version) => version + 1);
  };

  useEffect(() => {
    document.documentElement.dataset.theme = courseState.theme;
    saveCourseState(courseState);
  }, [courseState]);

  return (
    <main>
      <Header progress={progress} theme={courseState.theme} onSetTheme={(theme) => dispatch({ type: 'SET_THEME', theme })} />

      <section className="hero section-shell" id="top" aria-labelledby="course-title">
        <div className="hero-copy">
          <p className="eyebrow"><Sparkles aria-hidden="true" size={16} /> Интерактивный старт</p>
          <h1 id="course-title">Погружение в C#</h1>
          <p className="hero-lead">
            Сделайте первые уверенные шаги в программировании: поймите логику кода,
            попробуйте C# и соберите свою первую программу.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#programming">
              Начать урок <ArrowRight aria-hidden="true" size={18} />
            </a>
            <a className="button button-secondary" href="#programming">
              Посмотреть программу <ArrowDown aria-hidden="true" size={18} />
            </a>
          </div>
        </div>

        <div className="code-window glass-card" aria-label="Пример программы на C#">
          <div className="code-window-bar">
            <span className="window-dots" aria-hidden="true"><i /><i /><i /></span>
            <span>FirstProgram.cs</span>
          </div>
          <pre><code><span className="code-keyword">using</span> System;

<span className="code-keyword">class</span> <span className="code-type">Program</span>
{'{'}
  <span className="code-keyword">static void</span> <span className="code-method">Main</span>()
  {'{'}
    Console.<span className="code-method">WriteLine</span>(<span className="code-string">&quot;Привет, C#!&quot;</span>);
  {'}'}
{'}'}</code></pre>
          <p className="code-output"><span aria-hidden="true">›</span> Привет, C#!</p>
        </div>
      </section>

      <ProgrammingFlow />
      <TopicExplorer onVisit={visitTopic} />

      <section className="lab-section section-shell" id="lab" aria-label="Лаборатория кода">
        <CodeLab onComplete={() => dispatch({ type: 'COMPLETE_LAB' })} />
      </section>

      <section className="rules-section section-shell" id="rules" aria-labelledby="rules-title">
        <div className="section-intro">
          <p className="eyebrow">Читаемый код</p>
          <h2 id="rules-title">Правила хорошего кода</h2>
          <p>Хороший код понятен не только компьютеру, но и человеку, который откроет его завтра.</p>
        </div>
        <RulesGrid />
        <FindError />
      </section>

      <section className="activity-section section-shell" id="game" aria-label="Мини-игра по порядку программы">
        <OrderGame key={`game-${activityReset}`} onComplete={() => dispatch({ type: 'COMPLETE_GAME' })} />
      </section>

      <section className="activity-section section-shell" id="quiz" aria-label="Проверка знаний">
        <Quiz
          key={`quiz-${activityReset}`}
          answers={courseState.quizAnswers}
          onAnswer={(questionId, answer) => dispatch({ type: 'ANSWER_QUIZ', questionId, answer })}
          onComplete={() => dispatch({ type: 'COMPLETE_QUIZ' })}
        />
      </section>

      <div className="activity-section section-shell"><PracticeCard /></div>
      <div className="completion-section section-shell"><Completion progress={progress} onReset={resetCourse} /></div>
    </main>
  );
}

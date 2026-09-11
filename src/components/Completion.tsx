import { RotateCcw, Trophy } from 'lucide-react';
import { useState } from 'react';

interface CompletionProps { progress: number; onReset: () => void; }

export function Completion({ progress, onReset }: CompletionProps) {
  const [confirming, setConfirming] = useState(false);
  const complete = progress === 100;
  return (
    <section className="completion glass-card" id="completion" aria-labelledby="completion-title">
      <p className="eyebrow"><Trophy aria-hidden="true" size={16} /> Финал маршрута</p>
      <h2 id="completion-title">{complete ? 'Курс пройден!' : 'Ваш маршрут продолжается'}</h2>
      <p className="completion-progress" aria-live="polite">Текущий прогресс: <strong>{progress}%</strong></p>
      <p className="completion-copy">{complete ? 'Все темы и активности завершены. Вы уже собрали крепкую основу для следующих программ на C#.' : 'Продолжайте открывать темы и выполнять активности — каждое завершённое задание приближает вас к финалу.'}</p>
      {!confirming ? <button className="button button-secondary" onClick={() => setConfirming(true)} type="button"><RotateCcw aria-hidden="true" size={17} /> Начать заново</button> : (
        <div className="reset-confirmation" role="status"><p>Сбросить весь прогресс, ответы и завершённые задания?</p><div className="activity-actions">
          <button className="button button-primary" onClick={() => { setConfirming(false); onReset(); }} type="button">Да, сбросить прогресс</button><button className="button button-secondary" onClick={() => setConfirming(false)} type="button">Отмена</button>
        </div></div>
      )}
    </section>
  );
}

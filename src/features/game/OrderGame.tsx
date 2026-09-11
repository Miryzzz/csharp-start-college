import { Check, GripVertical, Lightbulb, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { isCorrectOrder, programLines } from './orderGameLogic';

interface OrderGameProps {
  onComplete: () => void;
}

const emptySlots = () => Array.from({ length: programLines.length }, () => null as string | null);

export function OrderGame({ onComplete }: OrderGameProps) {
  const [slots, setSlots] = useState<Array<string | null>>(emptySlots);
  const [feedback, setFeedback] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [selectedLine, setSelectedLine] = useState<string | null>(null);
  const [draggedLine, setDraggedLine] = useState<string | null>(null);
  const linesById = new Map(programLines.map((line) => [line.id, line]));

  const placeLine = (lineId: string, slotIndex: number) => {
    setSlots((current) => {
      const next = [...current];
      const previousIndex = next.indexOf(lineId);
      if (previousIndex >= 0) next[previousIndex] = null;
      next[slotIndex] = lineId;
      return next;
    });
    setSelectedLine(null);
    setFeedback('');
    setShowHint(false);
  };

  const handleSlotClick = (slotIndex: number) => {
    if (selectedLine) {
      placeLine(selectedLine, slotIndex);
      return;
    }
    setSlots((current) => current.map((lineId, index) => index === slotIndex ? null : lineId));
    setFeedback('');
  };

  const checkOrder = () => {
    if (slots.some((lineId) => lineId === null)) {
      setFeedback('Заполните все слоты кусочками кода, затем проверьте программу.');
      return;
    }
    if (isCorrectOrder(slots as string[])) {
      setFeedback('Готово! Программа собрана в правильном порядке.');
      if (!completed) {
        setCompleted(true);
        onComplete();
      }
      return;
    }
    setFeedback('Порядок пока не совпадает. Вспомните: подключение System идёт перед классом, а скобки закрываются в обратном порядке.');
  };

  const reset = () => {
    setSlots(emptySlots());
    setFeedback('Слоты очищены. Соберите программу заново.');
    setShowHint(false);
    setCompleted(false);
    setSelectedLine(null);
    setDraggedLine(null);
  };

  return (
    <article className="order-game glass-card" aria-labelledby="game-title">
      <div className="activity-heading">
        <p className="eyebrow">Мини-игра</p>
        <h2 id="game-title">Соберите программу</h2>
        <p>Перетащите кусочки кода в пустые слоты или выберите кусочек и нажмите нужный слот.</p>
      </div>

      <div className="program-pieces" aria-label="Кусочки кода">
        {programLines.map((line) => (
          <button
            aria-pressed={selectedLine === line.id}
            className={`program-piece${selectedLine === line.id ? ' program-piece-selected' : ''}`}
            draggable
            key={line.id}
            onClick={() => setSelectedLine((current) => current === line.id ? null : line.id)}
            onDragEnd={() => setDraggedLine(null)}
            onDragStart={() => setDraggedLine(line.id)}
            type="button"
          >
            <GripVertical aria-hidden="true" size={16} />
            <code>{line.code}</code>
          </button>
        ))}
      </div>

      <ol className="program-order" aria-label="Слоты программы">
        {slots.map((lineId, index) => {
          const line = lineId ? linesById.get(lineId) : undefined;
          return (
            <li
              className={`program-line program-slot${line ? ' program-slot-filled' : ''}${selectedLine ? ' program-slot-target' : ''}`}
              key={index}
              onClick={() => handleSlotClick(index)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                if (draggedLine) placeLine(draggedLine, index);
              }}
              role="button"
              tabIndex={0}
              aria-label={line ? `Слот ${index + 1}: ${line.code}` : `Пустой слот ${index + 1}`}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  handleSlotClick(index);
                }
              }}
            >
              <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              {line ? <code>{line.code}</code> : <em>Пустой слот — выберите кусочек кода</em>}
            </li>
          );
        })}
      </ol>

      <div className="activity-actions">
        <button className="button button-primary" onClick={checkOrder} type="button"><Check aria-hidden="true" size={17} /> Проверить порядок</button>
        <button className="button button-secondary" onClick={() => setShowHint((shown) => !shown)} type="button"><Lightbulb aria-hidden="true" size={17} /> {showHint ? 'Скрыть подсказку' : 'Показать подсказку'}</button>
        <button className="button button-secondary" onClick={reset} type="button"><RotateCcw aria-hidden="true" size={17} /> Сбросить</button>
      </div>
      {showHint && <p className="activity-hint">Подсказка: сначала подключите System, затем объявите класс и метод Main. Открывающие и закрывающие скобки должны образовывать пары.</p>}
      <p className={`activity-feedback${completed ? ' activity-feedback-success' : ''}`} aria-live="polite" role="status">{feedback || 'Выберите кусочек кода или перетащите его в нужный слот.'}</p>
    </article>
  );
}

import { useState } from 'react';

const lines = [
  {
    code: 'string name = "Аня"',
    explanation: 'Здесь пропущена точка с запятой. Она завершает команду в C#.',
  },
  {
    code: 'Console.WriteLine($"Привет, {name}!");',
    explanation: 'Эта строка написана правильно: команда закрыта скобкой и точкой с запятой.',
  },
  {
    code: 'string 2name = "Аня";',
    explanation: 'Имя переменной не может начинаться с цифры. Например, используйте name2.',
  },
];

export function FindError() {
  const [selected, setSelected] = useState<number | null>(null);
  const selectedLine = selected === null ? null : lines[selected];

  return (
    <section className="find-error glass-card" aria-labelledby="find-error-title">
      <p className="eyebrow">Мини-упражнение</p>
      <h3 id="find-error-title">Найдите ошибку в строке</h3>
      <p>Нажмите на строку и прочитайте объяснение правила.</p>
      <div className="error-lines" aria-label="Строки кода для проверки">
        {lines.map((line, index) => (
          <button
            aria-pressed={selected === index}
            className="error-line"
            key={line.code}
            onClick={() => setSelected(index)}
            type="button"
          >
            <span aria-hidden="true">{index + 1}</span>{line.code}
          </button>
        ))}
      </div>
      <p className="error-explanation" aria-live="polite" role="status">
        {selectedLine ? selectedLine.explanation : 'Выберите одну из трёх строк.'}
      </p>
    </section>
  );
}

import { CheckCircle2, PencilLine, TerminalSquare } from 'lucide-react';

export function PracticeCard() {
  return (
    <section className="practice-card glass-card" id="practice" aria-labelledby="practice-title">
      <div className="activity-heading">
        <p className="eyebrow"><PencilLine aria-hidden="true" size={16} /> Практическое задание</p>
        <h2 id="practice-title">Напишите программу приветствия</h2>
        <p>Создайте консольную программу, которая спрашивает имя пользователя и выводит персональное приветствие.</p>
      </div>
      <div className="practice-layout">
        <div><h3>Проверьте готовность</h3><ul className="readiness-list">
          <li><CheckCircle2 aria-hidden="true" size={18} /> Создана переменная <code>name</code> типа <code>string</code>.</li>
          <li><CheckCircle2 aria-hidden="true" size={18} /> Имя считывается через <code>Console.ReadLine()</code>.</li>
          <li><CheckCircle2 aria-hidden="true" size={18} /> В приветствии используется введённое имя.</li>
        </ul></div>
        <div className="expected-output"><p><TerminalSquare aria-hidden="true" size={16} /> Ожидаемый вывод</p><code>Как тебя зовут? Аня<br />Привет, Аня!</code></div>
      </div>
    </section>
  );
}

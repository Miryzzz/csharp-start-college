import { ArrowRight } from 'lucide-react';

const stages = [
  ['Идея', 'Вы формулируете задачу, которую хотите решить.'],
  ['Код', 'Записываете понятные компьютеру команды на C#.'],
  ['Компилятор', 'Он проверяет и переводит код в исполняемую программу.'],
  ['Результат', 'Программа выполняет задачу и показывает ответ.'],
] as const;

export function ProgrammingFlow() {
  return (
    <section className="programming-section section-shell" id="programming" aria-labelledby="programming-title">
      <div className="section-intro">
        <p className="eyebrow">01 · Что такое программирование</p>
        <h2 id="programming-title">Превращаем идею в результат</h2>
        <p>Программирование — это способ точно объяснить компьютеру последовательность действий.</p>
      </div>
      <ol className="programming-flow">
        {stages.map(([title, description], index) => (
          <li className="flow-stage glass-card" key={title}>
            <span className="flow-number">0{index + 1}</span>
            <h3>{title}</h3>
            <p>{description}</p>
            {index < stages.length - 1 && <ArrowRight className="flow-arrow" aria-hidden="true" size={20} />}
          </li>
        ))}
      </ol>
    </section>
  );
}

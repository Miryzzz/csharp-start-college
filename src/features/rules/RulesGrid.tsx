import { AlignLeft, Braces, FileText, ListTree, Pilcrow } from 'lucide-react';

const rules = [
  { icon: ListTree, title: 'Понятные имена', text: 'Называйте переменные так, чтобы было ясно, что в них хранится: name, score, total.' },
  { icon: AlignLeft, title: 'Отступы', text: 'Одинаковые отступы помогают увидеть, какие строки относятся к одному блоку.' },
  { icon: FileText, title: 'Комментарии', text: 'Короткий комментарий объясняет сложное решение, а не повторяет очевидный код.' },
  { icon: Pilcrow, title: 'Точки с запятой', text: 'В C# точка с запятой завершает простую команду.' },
  { icon: Braces, title: 'Фигурные скобки', text: 'Скобки { } объединяют команды условия, цикла или метода в один блок.' },
];

export function RulesGrid() {
  return (
    <section className="rules-grid" aria-label="Правила хорошего кода">
      {rules.map(({ icon: Icon, title, text }) => (
        <article className="rule-card glass-card" key={title}>
          <Icon aria-hidden="true" size={21} />
          <h3>{title}</h3>
          <p>{text}</p>
        </article>
      ))}
    </section>
  );
}

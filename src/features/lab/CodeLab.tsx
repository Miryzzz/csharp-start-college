import { LoaderCircle, Play, RotateCcw, TerminalSquare } from 'lucide-react';
import { useState } from 'react';
import { runCsharp, type LabResult } from './labEngine';

export const starterCode = 'using System;\n\nclass Program\n{\n  static void Main()\n  {\n    Console.WriteLine("Привет, C#!");\n  }\n}';

interface CodeLabProps {
  onComplete: () => void;
}

export function CodeLab({ onComplete }: CodeLabProps) {
  const [source, setSource] = useState(starterCode);
  const [stdin, setStdin] = useState('');
  const [result, setResult] = useState<LabResult | null>(null);
  const [running, setRunning] = useState(false);

  const runCode = async () => {
    setRunning(true);
    const nextResult = await runCsharp(source, fetch, stdin);
    setResult(nextResult);
    setRunning(false);
    if (nextResult.ok) onComplete();
  };

  const resetCode = () => {
    setSource(starterCode);
    setStdin('');
    setResult(null);
  };

  return (
    <section className="code-lab glass-card" aria-labelledby="lab-title">
      <div className="lab-heading">
        <p className="eyebrow"><TerminalSquare aria-hidden="true" size={16} /> Настоящий C# runtime</p>
        <h2 id="lab-title">Лаборатория кода</h2>
        <p>Пишите любой C# код и запускайте его в изолированном облачном компиляторе.</p>
      </div>

      <label className="sr-only" htmlFor="lab-editor">Редактор кода</label>
      <textarea
        className="lab-editor"
        id="lab-editor"
        value={source}
        onChange={(event) => setSource(event.target.value)}
        maxLength={20000}
        spellCheck={false}
      />

      <label className="lab-input-label" htmlFor="lab-stdin">Ввод программы <span>(необязательно)</span></label>
      <textarea
        className="lab-stdin"
        id="lab-stdin"
        value={stdin}
        onChange={(event) => setStdin(event.target.value)}
        maxLength={5000}
        placeholder="Данные для Console.ReadLine()"
        spellCheck={false}
      />

      <div className="lab-actions">
        <button className="button button-primary" type="button" onClick={runCode} disabled={running}>
          {running ? <LoaderCircle aria-hidden="true" className="spin" size={17} /> : <Play aria-hidden="true" size={17} />} {running ? 'Компиляция…' : 'Запустить код'}
        </button>
        <button className="button button-secondary" type="button" onClick={resetCode}>
          <RotateCcw aria-hidden="true" size={17} /> Сбросить код
        </button>
      </div>

      <div className={`lab-console${result?.ok ? ' lab-console-success' : ''}${result && !result.ok ? ' lab-console-error' : ''}`} aria-live="polite" role="status">
        <span aria-hidden="true">›</span>
        {result ? (result.ok ? (result.output || 'Программа завершилась без вывода.') : result.error) : 'Консоль ждёт запуска программы.'}
      </div>
    </section>
  );
}

export interface ProgramLine {
  id: string;
  code: string;
}

export const programLines: readonly ProgramLine[] = [
  { id: 'using-system', code: 'using System;' },
  { id: 'class-program', code: 'class Program' },
  { id: 'class-open', code: '{' },
  { id: 'main-method', code: '  static void Main()' },
  { id: 'main-open', code: '  {' },
  { id: 'greeting-line', code: '    Console.WriteLine("Привет, C#!");' },
  { id: 'main-close', code: '  }' },
  { id: 'class-close', code: '}' },
] as const;

const correctLineIds = programLines.map((line) => line.id);

export function moveLine<T>(lines: readonly T[], index: number, direction: -1 | 1): T[] {
  const targetIndex = index + direction;
  if (index < 0 || index >= lines.length || targetIndex < 0 || targetIndex >= lines.length) {
    return [...lines];
  }

  const moved = [...lines];
  [moved[index], moved[targetIndex]] = [moved[targetIndex], moved[index]];
  return moved;
}

export function isCorrectOrder(lines: readonly string[]): boolean {
  return lines.length === correctLineIds.length
    && lines.every((id, index) => id === correctLineIds[index]);
}

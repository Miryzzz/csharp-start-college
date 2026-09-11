import { fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach } from 'vitest';
import { App } from './App';

afterEach(() => {
  localStorage.clear();
});

function completeOrderGame() {
  const slots = within(screen.getByRole('list', { name: /слоты программы/i })).getAllByRole('button', { name: /слот/i });
  const occurrences = new Map<string, number>();
  ['using System;', 'class Program', '{', 'static void Main()', '{', 'Console.WriteLine("Привет, C#!");', '}', '}'].forEach((code, index) => {
    const occurrence = occurrences.get(code) ?? 0;
    occurrences.set(code, occurrence + 1);
    fireEvent.click(screen.getAllByRole('button', { name: code })[occurrence]);
    fireEvent.click(slots[index]);
  });
  fireEvent.click(screen.getByRole('button', { name: /проверить порядок/i }));
}

it('renders the course title and start action', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: /погружение в c#/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /начать урок/i })).toHaveAttribute(
    'href',
    '#programming',
  );
});

it('includes the code-quality exercise and removes the code laboratory', () => {
  render(<App />);

  expect(screen.queryByRole('heading', { name: /лаборатория кода/i })).toBeNull();
  expect(screen.getByRole('heading', { name: /найдите ошибку/i })).toBeInTheDocument();
});

it('resets child activities after confirmed global reset and lets the game complete again', () => {
  render(<App />);

  completeOrderGame();
  expect(screen.getByLabelText(/прогресс курса: 33%/i)).toBeInTheDocument();

  fireEvent.click(screen.getByRole('radio', { name: /всегда рисует интерфейс/i }));
  expect(screen.getByText(/пока неверно/i).closest('.quiz-feedback')).toHaveClass('quiz-feedback-error');
  fireEvent.click(screen.getByRole('button', { name: /следующий вопрос/i }));
  expect(screen.getByRole('heading', { name: /для чего нужна переменная/i })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /начать заново/i }));
  fireEvent.click(screen.getByRole('button', { name: /да, сбросить прогресс/i }));

  const gameLines = within(screen.getByRole('list', { name: /слоты программы/i })).getAllByRole('button', { name: /слот/i });
  expect(gameLines[0]).toHaveTextContent(/пустой слот/i);
  expect(screen.getByRole('heading', { name: /что делает программа/i })).toBeInTheDocument();
  expect(screen.getByRole('radio', { name: /всегда рисует интерфейс/i })).toBeEnabled();
  expect(screen.getByLabelText(/прогресс курса: 0%/i)).toBeInTheDocument();

  completeOrderGame();
  expect(screen.getByLabelText(/прогресс курса: 25%/i)).toBeInTheDocument();
});

import { fireEvent, render, screen, within } from '@testing-library/react';
import { vi } from 'vitest';
import { OrderGame } from './OrderGame';

it('starts with empty slots and supports click-to-place code pieces', () => {
  render(<OrderGame onComplete={vi.fn()} />);

  const slots = within(screen.getByRole('list', { name: /слоты программы/i })).getAllByRole('button', { name: /пустой слот/i });
  expect(slots).toHaveLength(8);
  expect(slots[0]).toHaveTextContent(/пустой слот/i);
  expect(screen.queryByRole('button', { name: /переместить строку/i })).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /using system/i }));
  fireEvent.click(slots[0]);

  expect(slots[0]).toHaveTextContent('using System;');
});

it('places a dragged code piece into the chosen slot', () => {
  render(<OrderGame onComplete={vi.fn()} />);
  const slots = within(screen.getByRole('list', { name: /слоты программы/i })).getAllByRole('button', { name: /пустой слот/i });
  const piece = screen.getByRole('button', { name: /class program/i });

  fireEvent.dragStart(piece);
  fireEvent.drop(slots[1]);

  expect(slots[1]).toHaveTextContent('class Program');
});

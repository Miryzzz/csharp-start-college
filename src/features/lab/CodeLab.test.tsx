import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import { CodeLab, starterCode } from './CodeLab';

afterEach(() => vi.unstubAllGlobals());

it('runs arbitrary C# and announces the compiler output', async () => {
  const onComplete = vi.fn();
  vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ ok: true, output: '42' }), { status: 200 })));
  render(<CodeLab onComplete={onComplete} />);

  const editor = screen.getByRole('textbox', { name: /редактор кода/i });
  fireEvent.change(editor, { target: { value: 'Console.WriteLine(42);' } });
  fireEvent.click(screen.getByRole('button', { name: /запустить код/i }));

  await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('42'));
  expect(onComplete).toHaveBeenCalledOnce();
});

it('shows compiler diagnostics for invalid code', async () => {
  vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ ok: false, error: 'error CS1002: ; expected' }), { status: 200 })));
  render(<CodeLab onComplete={() => undefined} />);
  fireEvent.click(screen.getByRole('button', { name: /запустить код/i }));

  await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/CS1002/));
});

it('restores the starter code when reset is pressed', () => {
  render(<CodeLab onComplete={() => undefined} />);
  const editor = screen.getByRole('textbox', { name: /редактор кода/i });

  fireEvent.change(editor, { target: { value: 'System.IO.File.Delete("x")' } });
  fireEvent.click(screen.getByRole('button', { name: /сбросить код/i }));

  expect(editor).toHaveValue(starterCode);
});

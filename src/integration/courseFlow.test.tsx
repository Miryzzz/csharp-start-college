import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { App } from '../App';

function clearStoredCourse() {
  localStorage.clear();
}

beforeEach(clearStoredCourse);
afterEach(() => {
  clearStoredCourse();
  vi.unstubAllGlobals();
});

it('updates progress after completing the laboratory', async () => {
  vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ ok: true, output: 'Привет, C#!' }), { status: 200 })));
  render(<App />);

  const progress = screen.getByLabelText(/прогресс курса/i);
  const before = progress.getAttribute('aria-valuenow');
  expect(before).not.toBeNull();

  fireEvent.click(screen.getByRole('button', { name: /запустить/i }));

  const lab = screen.getByRole('heading', { name: /лаборатория кода/i }).closest('section');
  expect(lab).not.toBeNull();
  await waitFor(() => expect(within(lab!).getByRole('status')).toHaveTextContent(/привет,/i));
  await waitFor(() => expect(progress).not.toHaveAttribute('aria-valuenow', before ?? ''));
});

import { render, screen } from '@testing-library/react';
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

it('renders the course without the removed code laboratory', () => {
  render(<App />);

  expect(screen.queryByRole('heading', { name: /лаборатория кода/i })).toBeNull();
  expect(screen.getByRole('heading', { name: /соберите программу/i })).toBeInTheDocument();
});

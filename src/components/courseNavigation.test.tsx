import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Header } from './Header';
import { TopicExplorer } from './TopicExplorer';

describe('course navigation', () => {
  it('opens the mobile menu with accessible navigation links', () => {
    render(<Header progress={8} theme="dark" onSetTheme={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /открыть меню/i }));

    const menu = screen.getByRole('navigation', { name: /навигация по курсу/i });
    expect(menu).toBeVisible();
    expect(within(menu).getByRole('link', { name: /основы c#/i })).toHaveAttribute('href', '#basics');
  });

  it('opens a topic with the keyboard and records the visit', () => {
    const onVisit = vi.fn();
    render(<TopicExplorer onVisit={onVisit} />);

    const variables = screen.getByRole('tab', { name: /переменные/i });
    variables.focus();
    fireEvent.keyDown(variables, { key: 'ArrowRight' });
    fireEvent.keyDown(screen.getByRole('tab', { name: /ввод и вывод/i }), { key: 'Enter' });

    expect(screen.getByRole('tab', { name: /ввод и вывод/i })).toHaveAttribute('aria-selected', 'true');
    expect(onVisit).toHaveBeenLastCalledWith('io');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Console.WriteLine');
  });
});

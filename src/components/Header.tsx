import { Code2, Menu, Moon, Sun, X } from 'lucide-react';
import { useState } from 'react';
import type { Theme } from '../state/courseState';
import { ProgressRing } from './ProgressRing';

interface HeaderProps {
  progress: number;
  theme: Theme;
  onSetTheme: (theme: Theme) => void;
}

const navigationLinks = [
  { href: '#programming', label: 'Программа' },
  { href: '#basics', label: 'Основы C#' },
  { href: '#practice', label: 'Практика' },
];

export function Header({ progress, theme, onSetTheme }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="C# START — в начало страницы">
        <Code2 aria-hidden="true" size={22} />
        <span>C# START</span>
      </a>

      <nav className="desktop-nav" aria-label="Основная навигация">
        {navigationLinks.map((link) => <a href={link.href} key={link.href}>{link.label}</a>)}
      </nav>

      <div className="header-actions">
        <ProgressRing progress={progress} />
        <button
          className="icon-button theme-button"
          type="button"
          onClick={() => onSetTheme(nextTheme)}
          aria-label={nextTheme === 'light' ? 'Включить светлую тему' : 'Включить тёмную тему'}
        >
          {theme === 'dark' ? <Sun aria-hidden="true" size={18} /> : <Moon aria-hidden="true" size={18} />}
        </button>
        <button
          className="icon-button menu-button"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
        </button>
      </div>

      {menuOpen && (
        <nav className="mobile-nav glass-card" id="mobile-navigation" aria-label="Навигация по курсу">
          {navigationLinks.map((link) => (
            <a href={link.href} key={link.href} onClick={closeMenu}>{link.label}</a>
          ))}
        </nav>
      )}
    </header>
  );
}

import { fireEvent, render, screen } from '@testing-library/react';
import { FindError } from './FindError';

it('explains the selected code-quality error', () => {
  render(<FindError />);

  fireEvent.click(screen.getByRole('button', { name: /string name = "аня"/i }));

  expect(screen.getByRole('status')).toHaveTextContent(/точк.*запят/i);
});

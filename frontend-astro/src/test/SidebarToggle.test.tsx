import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import SidebarToggle from '../components/SidebarToggle';

describe('SidebarToggle', () => {
  it('renders a button with aria-label', () => {
    const { getByRole } = render(<SidebarToggle />);
    const button = getByRole('button', { name: /toggle navigation menu/i });
    expect(button).toBeInTheDocument();
  });

  it('starts with aria-expanded="false"', () => {
    const { getByRole } = render(<SidebarToggle />);
    const button = getByRole('button');
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('toggles aria-expanded on click', () => {
    const { getByRole } = render(<SidebarToggle />);
    const button = getByRole('button');
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('button has type="button" to prevent form submission', () => {
    const { getByRole } = render(<SidebarToggle />);
    expect(getByRole('button')).toHaveAttribute('type', 'button');
  });
});

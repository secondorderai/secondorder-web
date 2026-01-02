import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button, buttonVariants } from './button';

describe('Button', () => {
  it('should render button with default variant', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
  });

  it('should render button with children text', () => {
    render(<Button>Test Button</Button>);
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('should apply default variant classes', () => {
    render(<Button>Default</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-ink');
    expect(button.className).toContain('text-bone');
  });

  it('should apply outline variant classes', () => {
    render(<Button variant="outline">Outline</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('border');
    expect(button.className).toContain('border-ink/30');
  });

  it('should apply small size classes', () => {
    render(<Button size="sm">Small</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('h-9');
    expect(button.className).toContain('px-4');
  });

  it('should apply default size classes', () => {
    render(<Button size="default">Default Size</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('h-11');
    expect(button.className).toContain('px-6');
  });

  it('should apply large size classes', () => {
    render(<Button size="lg">Large</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('h-12');
    expect(button.className).toContain('px-8');
  });

  it('should handle onClick event', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);
    const button = screen.getByRole('button');

    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not trigger onClick when disabled', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <Button onClick={handleClick} disabled>
        Disabled
      </Button>
    );
    const button = screen.getByRole('button');

    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should apply disabled styles when disabled', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button.className).toContain('disabled:opacity-50');
  });

  it('should accept custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('custom-class');
  });

  it('should merge custom className with variant classes', () => {
    render(
      <Button variant="outline" className="custom-class">
        Merged
      </Button>
    );
    const button = screen.getByRole('button');
    expect(button.className).toContain('custom-class');
    expect(button.className).toContain('border');
  });

  it('should forward ref to button element', () => {
    const ref = vi.fn();
    render(<Button ref={ref}>Ref Button</Button>);
    expect(ref).toHaveBeenCalled();
  });

  it('should pass through additional HTML button attributes', () => {
    render(
      <Button type="submit" name="test-button" data-testid="custom-button">
        Submit
      </Button>
    );
    const button = screen.getByTestId('custom-button');
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveAttribute('name', 'test-button');
  });

  it('should have proper accessibility attributes', () => {
    render(<Button aria-label="Accessible Button">Click</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Accessible Button');
  });

  it('should apply focus styles', () => {
    render(<Button>Focus</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('focus-visible:outline-none');
    expect(button.className).toContain('focus-visible:ring-2');
  });

  it('should handle keyboard interaction (Enter)', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Keyboard</Button>);
    const button = screen.getByRole('button');

    button.focus();
    await user.keyboard('{Enter}');
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should handle keyboard interaction (Space)', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Keyboard</Button>);
    const button = screen.getByRole('button');

    button.focus();
    await user.keyboard(' ');
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

describe('buttonVariants', () => {
  it('should generate correct classes for default variant', () => {
    const classes = buttonVariants({ variant: 'default' });
    expect(classes).toContain('bg-ink');
    expect(classes).toContain('text-bone');
  });

  it('should generate correct classes for outline variant', () => {
    const classes = buttonVariants({ variant: 'outline' });
    expect(classes).toContain('border');
    expect(classes).toContain('border-ink/30');
  });

  it('should generate correct classes for small size', () => {
    const classes = buttonVariants({ size: 'sm' });
    expect(classes).toContain('h-9');
    expect(classes).toContain('px-4');
  });

  it('should generate correct classes for large size', () => {
    const classes = buttonVariants({ size: 'lg' });
    expect(classes).toContain('h-12');
    expect(classes).toContain('px-8');
  });

  it('should apply default variants when none specified', () => {
    const classes = buttonVariants();
    expect(classes).toContain('bg-ink');
    expect(classes).toContain('h-11');
  });
});

import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    const result = cn('class1', 'class2');
    expect(result).toBe('class1 class2');
  });

  it('should handle conditional classes', () => {
    const result = cn('base', false && 'hidden', 'visible');
    expect(result).toBe('base visible');
  });

  it('should merge Tailwind classes without conflicts', () => {
    // tailwind-merge should dedupe conflicting classes
    const result = cn('px-4', 'px-6');
    expect(result).toBe('px-6');
  });

  it('should handle array of classes', () => {
    const result = cn(['class1', 'class2']);
    expect(result).toBe('class1 class2');
  });

  it('should handle object with boolean values', () => {
    const result = cn({
      active: true,
      disabled: false,
      visible: true,
    });
    expect(result).toBe('active visible');
  });

  it('should handle undefined and null values', () => {
    const result = cn('base', undefined, null, 'valid');
    expect(result).toBe('base valid');
  });

  it('should handle empty inputs', () => {
    const result = cn();
    expect(result).toBe('');
  });

  it('should handle complex Tailwind class merging', () => {
    const result = cn('text-sm', 'text-lg', 'font-bold');
    expect(result).toBe('text-lg font-bold');
  });

  it('should handle nested arrays and objects', () => {
    const result = cn(['base', { active: true }], 'extra');
    expect(result).toBe('base active extra');
  });

  it('should merge background colors correctly', () => {
    const result = cn('bg-red-500', 'bg-blue-500');
    expect(result).toBe('bg-blue-500');
  });

  it('should merge padding classes correctly', () => {
    const result = cn('p-4', 'px-6');
    // tailwind-merge keeps the later class, it doesn't split p-4
    expect(result).toBe('p-4 px-6');
  });

  it('should handle margin classes', () => {
    const result = cn('m-2', 'mx-4');
    // tailwind-merge keeps the later class, it doesn't split m-2
    expect(result).toBe('m-2 mx-4');
  });

  it('should preserve unique classes while merging conflicts', () => {
    const result = cn('rounded-lg', 'shadow-md', 'rounded-xl');
    expect(result).toBe('shadow-md rounded-xl');
  });

  it('should handle arbitrary values in Tailwind', () => {
    const result = cn('w-[100px]', 'h-[200px]');
    expect(result).toBe('w-[100px] h-[200px]');
  });

  it('should handle responsive modifiers', () => {
    const result = cn('text-sm', 'md:text-lg', 'lg:text-xl');
    expect(result).toBe('text-sm md:text-lg lg:text-xl');
  });

  it('should merge same responsive modifiers correctly', () => {
    const result = cn('md:text-sm', 'md:text-lg');
    expect(result).toBe('md:text-lg');
  });

  it('should handle pseudo-class modifiers', () => {
    const result = cn('hover:bg-blue-500', 'focus:ring-2');
    expect(result).toBe('hover:bg-blue-500 focus:ring-2');
  });

  it('should merge conflicting pseudo-class modifiers', () => {
    const result = cn('hover:bg-red-500', 'hover:bg-blue-500');
    expect(result).toBe('hover:bg-blue-500');
  });

  it('should handle whitespace in class strings', () => {
    const result = cn('  class1  ', '  class2  ');
    expect(result).toBe('class1 class2');
  });

  it('should handle real-world button variant scenario', () => {
    const result = cn(
      'inline-flex items-center justify-center',
      'bg-ink text-bone',
      'h-11 px-6',
      'custom-class'
    );
    expect(result).toBe(
      'inline-flex items-center justify-center bg-ink text-bone h-11 px-6 custom-class'
    );
  });
});

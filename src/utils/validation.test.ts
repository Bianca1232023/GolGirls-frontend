import { describe, expect, it } from 'vitest';
import { isValidEmail, isValidPassword, passwordsMatch } from './validation';

describe('validation', () => {
  it('valida e-mail', () => {
    expect(isValidEmail('a@b.co')).toBe(true);
    expect(isValidEmail('invalid')).toBe(false);
  });

  it('valida senha mínima', () => {
    expect(isValidPassword('12345678')).toBe(true);
    expect(isValidPassword('short')).toBe(false);
  });

  it('confere senhas iguais', () => {
    expect(passwordsMatch('abc', 'abc')).toBe(true);
    expect(passwordsMatch('abc', 'abd')).toBe(false);
  });
});

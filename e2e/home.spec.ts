import { expect, test } from '@playwright/test';

test.describe('GoLGirls — UI E2E', () => {
  test('página inicial exibe título e cards de acesso', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Bem-vinda ao GolGirls/i })).toBeVisible();
    await expect(page.getByText('Aluna', { exact: true })).toBeVisible();
    await expect(page.getByText('Professor')).toBeVisible();
    await expect(page.getByText('Admin')).toBeVisible();
  });

  test('link de privacidade LGPD está visível', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: /Política de Privacidade \(LGPD\)/i })).toBeVisible();
  });

  test('aceitar consentimento LGPD remove o banner', async ({ page }) => {
    await page.goto('/');
    const btn = page.getByRole('button', { name: /Entendi e concordo/i });
    if (await btn.isVisible()) {
      await btn.click();
      await expect(btn).not.toBeVisible();
    }
  });

  test('navega para login admin', async ({ page }) => {
    await page.goto('/');
    const consent = page.getByRole('button', { name: /Entendi e concordo/i });
    if (await consent.isVisible()) await consent.click();
    await page.getByRole('button', { name: 'Entrar' }).nth(2).click();
    await expect(page.getByText(/Painel do Administrativo/i)).toBeVisible();
  });
});

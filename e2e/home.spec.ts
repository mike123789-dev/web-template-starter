import { expect, test } from '@playwright/test';

test('home list renders', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'New project' })).toBeVisible();

  const firstProject = page.locator('a[aria-label^="Open project"]').first();
  await expect(firstProject).toBeVisible();
});


import { expect, test } from '@playwright/test';

test('home list renders', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'New project' })).toBeVisible();

  const firstProject = page.locator('a[aria-label^="Open project"]').first();
  await expect(firstProject).toBeVisible();
});

test('new project flow redirects to list with success notice', async ({ page }) => {
  await page.goto('/projects/new');

  await page.getByLabel('Name').fill('Payments Refactor');
  await page.getByLabel('Owner').fill('Mina Lee');
  await page.getByLabel('Status').selectOption('active');
  await page.getByLabel('Description').fill('Stabilize payment retries and reporting.');

  await page.getByRole('button', { name: 'Create' }).click();

  await expect(page).toHaveURL(/\/\?created=1$/);
  await expect(page.getByText('Project created (mock). Redirected back to the list.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
});

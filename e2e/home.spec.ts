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

test('filter/sort query and invalid fallback work consistently', async ({ page }) => {
  await page.goto('/?status=active&sort=name');

  const labels = await page
    .locator('a[aria-label^="Open project"]')
    .evaluateAll((elements) => elements.map((element) => element.getAttribute('aria-label')));

  expect(labels).toEqual([
    'Open project Mobile onboarding',
    'Open project Observability baseline',
    'Open project Website refresh',
  ]);
  await expect(page.getByText('Billing cleanup')).toHaveCount(0);
  await expect(page.getByText('Design tokens')).toHaveCount(0);

  await page.goto('/?status=invalid&sort=invalid');
  await expect(page).toHaveURL('/?status=invalid&sort=invalid');
  await expect(page.locator('a[aria-label^="Open project"]')).toHaveCount(6);
});

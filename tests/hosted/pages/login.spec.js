import { test, expect } from '@playwright/test';

const primaryDomain = `https://wsgjoshuadev2023-american.myshopify.com/`;
const pageUrl = `${primaryDomain}pages/ws-account-login`;
test.describe.configure({ mode: 'serial' });

/** @type {import('@playwright/test').Page} */
let page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
});

test.afterAll(async () => {
  await page.close();
});

test('runs first', async () => {
  await page.goto(primaryDomain);

  await page.getByLabel('Enter store password').fill('password');
  await page.getByRole('button', { name: 'Enter' }).click();
  await page.goto(pageUrl);
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle('Wholesale Login');
});

test('user can sign in', async () => {
  // Enter User name
  await page.locator('#customer_email').fill('ny-us@joshualucas.dev');

  // Enter Password
  await page.getByPlaceholder('Password').fill('password');

  // click login
  await page.getByRole('button', { name: 'Sign In' }).dblclick();
  await page.waitForURL(
    'https://wsgjoshuadev2023-american.myshopify.com/a/wsg/wholesale/account'
  );
  await expect(page).toHaveURL(
    'https://wsgjoshuadev2023-american.myshopify.com/a/wsg/wholesale/account'
  );
});

test('user can log out', async () => {
  await page.getByText('Logout').click();

  await page.waitForURL(primaryDomain);

  await expect(page).toHaveURL(primaryDomain);
});

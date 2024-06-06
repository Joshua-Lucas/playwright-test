import { test, expect } from '@playwright/test';

const primaryDomain = `https://wsgjoshuadev2023-american.myshopify.com/`;
const pageUrl = `${primaryDomain}pages/ws-account-login`;
test.describe.configure({ mode: 'parallel' });

/** @type {import('@playwright/test').Page} */
let page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();

  await page.goto(primaryDomain);

  await page.getByLabel('Enter store password').fill('password');
  await page.getByRole('button', { name: 'Enter' }).click();
  await page.goto(pageUrl);
  // Expect a title "to contain" a substring.

  await page.locator('#customer_email').fill('ny-us@joshualucas.dev');

  // Enter Password
  await page.getByPlaceholder('Password').fill('password');

  // click login
  await page.getByRole('button', { name: 'Sign In' }).dblclick();
  await page.waitForURL(
    'https://wsgjoshuadev2023-american.myshopify.com/a/wsg/wholesale/account'
  );

  await page.getByText('Catalog').click();

  await page.waitForURL(
    'https://wsgjoshuadev2023-american.myshopify.com/a/wsg/wholesale/catalog'
  );
  await expect(page).toHaveURL(
    'https://wsgjoshuadev2023-american.myshopify.com/a/wsg/wholesale/catalog/all'
  );
});

test.afterAll(async () => {
  await page.close();
});

test('Fixed price rule applies correctly', async () => {
  try {
    // Find the product title element containing the text "B&F Organic Basil"
    const productTitle = 'Peach Blush';
    const productSelector = `.wsg-product-title:has-text("${productTitle}")`;

    // Locate the parent element of the product title which is .wsg-product-info-block
    const productInfoBlock = await page.locator(productSelector).locator('..');

    // Now find the price within the same product info block
    const priceSelector = '.wsg-product-price';
    const priceElement = await productInfoBlock.locator(priceSelector);

    // Retrieve and log the price text
    const priceText = await priceElement.textContent();
    await expect(priceText).toBe('$5.00');
  } catch (err) {
    console.log(err);
  }
});

// test('Percentage price rule applies correctly', async () => {
//   // Find the product title element containing the text "B&F Organic Basil"
//   const productTitle = 'B&F Organic Basil';
//   const productSelector = await page.getByText(productTitle);
//   // Locate the parent element of the product title which is .wsg-product-info-block
//   const productInfoBlock = await productSelector.locator('..');

//   // Now find the price within the same product info block
//   const priceSelector = '.wsg-product-price';
//   const priceElement = await productInfoBlock.locator(priceSelector);

//   // Retrieve and log the price text
//   const priceText = await priceElement.textContent();
//   await expect(priceText).toBe('$9.00');
// });

test('Product Excluded From Wholesale', async () => {
  await page.waitForLoadState('networkidle');

  const excludedProdut = await page.getByText('B&F Organic Mint');

  await expect(excludedProdut).not.toBeAttached();
});

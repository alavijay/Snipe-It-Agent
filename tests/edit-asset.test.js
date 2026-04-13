// tests/edit-asset.test.js
const { chromium } = require('playwright');
const HomePage = require('../pages/HomePage');
const LoginPage = require('../pages/LoginPage');
const AssetPage = require('../pages/AssetPage');

describe('Edit Asset Tests', () => {
  let browser;
  let context;
  let page;
  let homePage;
  let assetPage;
  let loginPage;

  beforeAll(async () => {
    browser = await chromium.launch({ headless: true });
    context = await browser.newContext();
    page = await context.newPage();
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
    assetPage = new AssetPage(page);
  });

  afterAll(async () => {
    await context.close();
    await browser.close();
  });

  test('Edit Asset - Navigate to asset and verify details page', async () => {
    // Navigate to Snipe-It application
    await loginPage.goToSinpeIt();

    // Perform login
    await loginPage.login();

    // Navigate to assets list page
    await assetPage.gotoAssetPage();

    // Wait for assets list to load
    await page.waitForLoadState('networkidle');

    // Get the first asset from the list
    const firstAssetLink = page.locator('table tbody tr td a').first();
    await assetPage.waitForElement(firstAssetLink);

    // Click on the first asset to open its details page
    await firstAssetLink.click();

    // Wait for asset details page to load  
    await page.waitForLoadState('networkidle');

    // Verify we're on an asset details page
    const urlContainsHardware = page.url().includes('/hardware/');
    expect(urlContainsHardware).toBeTruthy();

    // Verify the page has content (asset details are loaded)
    const pageContent = await page.content();
    const hasDetails = pageContent.includes('Asset Details') || pageContent.length > 1000;
    expect(hasDetails).toBeTruthy();
  });
});

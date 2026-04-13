const { chromium, devices } = require('playwright');
const LoginPage = require('../pages/LoginPage');
const HomePage = require('../pages/HomePage');

describe('Seed - Application Setup', () => {
  let browser;
  let context;
  let page;
  let loginPage;
  let homePage;

  beforeAll(async () => {
    browser = await chromium.launch({ headless: false });
    context = await browser.newContext();
    page = await context.newPage();
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
  });

  afterAll(async () => {
    await context.close();
    await browser.close();
  });

  test('Setup: Navigate and Login to Snipe-It', async () => {
    // Navigate to application
    await loginPage.goToSinpeIt();

    // Perform login
    await loginPage.login();

    // Wait for home page to load
    await page.waitForLoadState('networkidle');
    
    // Verify user is logged in
    expect(await page.title()).toContain('Snipe');
  });
});
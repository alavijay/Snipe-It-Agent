const { chromium, devices } = require('playwright');
const HomePage = require('../pages/HomePage');
const LoginPage = require('../pages/LoginPage');
const AssetPage = require('../pages/AssetPage');


const configurations = [
  {
    name: 'Desktop',
    options: {}, // default desktop
    traceFile: 'trace-desktop.zip',
    videoDir: 'videos/desktop/',
  },
  // {
  //   name: 'Mobile (iPhone 13)',
  //   options: devices['iPhone 13'],
  //   traceFile: 'trace-mobile.zip',     ///////// enable it if you want to run tests on mobile view
  //   videoDir: 'videos/mobile/',
  // },
];

for (const config of configurations) {
  describe(`${config.name} Home Page Tests`, () => {
    let browser;
    let context;
    let page;
    let homePage;
    let assetPage;
    let loginPage;

    beforeAll(async () => {
      browser = await chromium.launch({ headless: false });

      context = await browser.newContext({
        ...config.options,
        recordVideo: { dir: config.videoDir },
      });

      await context.tracing.start({ screenshots: true, snapshots: true });

      page = await context.newPage();
      homePage = new HomePage(page);
      loginPage = new LoginPage(page);
      assetPage = new AssetPage(page);

    });

    afterAll(async () => {
      await context.tracing.stop({ path: config.traceFile });
      await context.close();
      await browser.close();
    });

    test('Make a booking', async () => {

      // navigate to snipe it
      await loginPage.goToSinpeIt();
      await loginPage.login();

      // wait for home page to load and navigate to create asset
      await homePage.gotoCreateAsset();

      // create a new asset
      await assetPage.submitAssetDetails();

      //  search for the asset
      await assetPage.gotoAssetPage();
      // await assetPage.findAsset();

      // // verify asset details
      // await assetPage.verifyAssetDetails();

      // //verify asset History
      // await assetPage.verifyAssetHistory();
      
    });
  });
}

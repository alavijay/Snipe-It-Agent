require('dotenv').config();
const url = process.env.URL;
const BasePage = require('./BasePage');
let assetTagValue;

class AssetPage extends BasePage{
  constructor(page) {
    super(page);
    this.createNew = page.getByText('Create New');
    this.assetNav = page.getByRole('navigation').getByText('Asset', { exact: true });
    this.submitButton = page.locator('#submit_button');
    this.companySelect = page.getByRole('combobox', { name: 'Select Company' });
    this.firstOption = page.locator('.select2-results__option').nth(0);
    this.assetTagInput = page.getByRole('textbox', { name: 'Asset Tag', exact: true });
    this.serialInput = page.getByRole('textbox', { name: 'Serial' });
    this.selectModel = page.getByText('Select a Model');
    this.selectStatus = page.getByLabel('Select Status');
    this.searchBox = page.getByRole('searchbox');
    this.selectMacbook = page.getByText('Laptops - Macbook Pro 13"');
    this.readyToDeploy = page.getByRole('option', { name: 'Ready to Deploy' });
    this.selectUserSpan = page.getByRole('combobox', { name: 'Select a User' }).locator('span').nth(2);
    this.successMessage = page.locator('#success-notification');
    this.searchAsset = page.getByRole('textbox', { name: 'Search Assets' });
    this.assetsButton = page.locator('a').filter({ hasText: 'Assets' }).first();
    this.assetStatus = page.getByText('Ready to Deploy Deployed');
    this.historyTab = page.getByRole('link', { name: 'History' });
    this.adminRole = page.getByRole('cell', { name: 'Admin User' }).first();
    this.checkout = page.getByRole('cell', { name: 'checkout' });
  }

  async submitAssetDetails() {
    await this.waitForElement(this.submitButton);
    await this.companySelect.click();
    await this.waitForElement(this.firstOption);
    await this.firstOption.click();
    await this.assetTagInput.fill(await this.randomAssetTag());
    assetTagValue = await this.assetTagInput.inputValue();
    console.log(assetTagValue);
    await this.serialInput.fill('Test12345' + Math.floor(Math.random() * 900) + 100);
    await this.selectModel.click();
    await this.searchBox.fill('macbook');
    await this.selectMacbook.click();
    await this.selectStatus.click();
    await this.readyToDeploy.click();
    await this.selectUserSpan.click();
    await this.waitForElement(this.firstOption);
    await this.firstOption.click();
    await this.submitButton.click();
    await this.waitForElement(this.successMessage); // Wait for the success message to appear
  }

  async findAsset() {
    await this.searchBox.fill(assetTagValue);
    await this.page.keyboard.press('Enter'); 
    await this.selectAsset(assetTagValue).click();
  }

  async gotoAssetPage() {
    await this.assetsButton.click();
    await this.page.waitForURL('https://demo.snipeitapp.com/hardware');
  }

  async verifyAssetDetails() {
    await this.waitForElement(this.selectAsset(assetTagValue));
    expect(await this.selectAsset(assetTagValue).isVisible()).toBeTruthy();
    expect(await this.assetStatus.isVisible()).toBeTruthy();
  }

  selectAsset(assetTag) {
    return this.page.getByRole('link', { name: assetTag });
  }  

  async verifyAssetHistory() {
    await this,this.waitForElement(this.historyTab);
    await this.historyTab.click();
    await this.page.waitForURL('**/hardware/**');
    await this.waitForElement(this.adminRole);
    expect(await this.adminRole.isVisible()).toBeTruthy();
    expect(await this.checkout.isVisible()).toBeTruthy();
  }


  async selectDate(page, daysFromToday) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysFromToday);

    const ariaLabel = targetDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    await page.locator(`[aria-label="${ariaLabel}"]`).click();
  }



}

module.exports = AssetPage;

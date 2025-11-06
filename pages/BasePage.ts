import { Page, Locator } from '@playwright/test';

// Type for click options from Playwright
type ClickOptions = Parameters<Locator['click']>[0];

export class BasePage {
  readonly page: Page;
  readonly logo: Locator;
  readonly searchBox: Locator;
  readonly searchButton: Locator;
  readonly registerLink: Locator;
  readonly loginLink: Locator;
  readonly logoutLink: Locator;
  readonly myAccountLink: Locator;

  // Category menu
  readonly computersMenu: Locator;
  readonly electronicsMenu: Locator;
  readonly apparelMenu: Locator;
  readonly digitalDownloadsMenu: Locator;
  readonly booksMenu: Locator;
  readonly jewelryMenu: Locator;
  readonly giftCardsMenu: Locator;

  constructor(page: Page) {
    this.page = page;

    // Header elements
    this.logo = page.locator('.header-logo a');
    this.searchBox = page.locator('#small-searchterms');
    this.searchButton = page.locator('button.search-box-button');
    this.registerLink = page.locator('a.ico-register');
    this.loginLink = page.locator('a.ico-login');
    this.logoutLink = page.locator('a.ico-logout');
    this.myAccountLink = page.locator('a.ico-account');

    // Category menu items
    this.computersMenu = page.locator('a[href="/computers"]').first();
    this.electronicsMenu = page.locator('a[href="/electronics"]').first();
    this.apparelMenu = page.locator('a[href="/apparel"]').first();
    this.digitalDownloadsMenu = page.locator('a[href="/digital-downloads"]').first();
    this.booksMenu = page.locator('a[href="/books"]').first();
    this.jewelryMenu = page.locator('a[href="/jewelry"]').first();
    this.giftCardsMenu = page.locator('a[href="/gift-cards"]').first();
  }

  async navigate(url: string = '/') {
    await this.page.goto(url);
  }

  async searchProduct(keyword: string) {
    await this.searchBox.fill(keyword);
    await this.click(this.searchButton);
  }

  async clickRegister() {
    await this.click(this.registerLink);
  }

  async clickLogin() {
    await this.click(this.loginLink);
  }

  async clickLogout() {
    await this.click(this.logoutLink);
  }

  async isUserLoggedIn(): Promise<boolean> {
    return await this.logoutLink.isVisible();
  }

  async navigateToCategory(category: string) {
    const categoryMap: { [key: string]: Locator } = {
      computers: this.computersMenu,
      electronics: this.electronicsMenu,
      apparel: this.apparelMenu,
      'digital downloads': this.digitalDownloadsMenu,
      books: this.booksMenu,
      jewelry: this.jewelryMenu,
      'gift cards': this.giftCardsMenu,
    };

    const categoryLocator = categoryMap[category.toLowerCase()];
    if (categoryLocator) {
      await this.click(categoryLocator);
    }
  }

  /**
   * Safe click - waits for element to be visible and enabled before clicking
   * Supports all Playwright click options
   */
  async safeClick(locator: Locator, options?: ClickOptions & { timeout?: number }) {
    const timeout = options?.timeout ?? 10000;
    await locator.waitFor({ state: 'visible', timeout });
    await locator.scrollIntoViewIfNeeded();
    
    // Remove timeout from options before passing to click
    const { timeout: _timeout, ...clickOptions } = options ?? {};
    await locator.click(clickOptions);
  }

  /**
   * Shorthand for safeClick - use this instead of locator.click()
   * Usage: 
   *   await this.click(this.myButton)
   *   await this.click(this.myButton, { force: true })
   *   await this.click(this.myButton, { button: 'right', timeout: 5000 })
   */
  async click(locator: Locator, options?: ClickOptions & { timeout?: number }) {
    await this.safeClick(locator, options);
  }

  /**
   * Safe select option - selects option and triggers with Enter key
   */
  async safeSelectOption(locator: Locator, option: string, timeout: number = 10000) {
    await locator.waitFor({ state: 'visible', timeout });
    await locator.selectOption({ label: option });
    await this.page.keyboard.press('Enter');
  }

  /**
   * Wait for element to be ready (visible and stable)
   */
  async waitForElement(locator: Locator, timeout: number = 10000) {
    await locator.waitFor({ state: 'visible', timeout });
    await locator.waitFor({ state: 'attached', timeout });
  }

  /**
   * Wait for AJAX request to complete (for product lists/filters)
   */
  async waitForAjaxComplete() {
    const busyIndicator = this.page.locator('.ajax-products-busy');
    // Wait for busy indicator to appear (if it does)
    await busyIndicator.waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});
    // Wait for it to disappear
    await busyIndicator.waitFor({ state: 'hidden', timeout: 15000 });
  }
}

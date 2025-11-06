import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly welcomeTitle: Locator;
  readonly slider: Locator;
  readonly featuredProductsSection: Locator;
  readonly featuredProducts: Locator;
  readonly categoryBlocks: Locator;
  readonly newsSection: Locator;
  readonly pollSection: Locator;

  constructor(page: Page) {
    super(page);

    this.welcomeTitle = page.locator('.topic-block-title h2');
    this.slider = page.locator('.nivo-slider');
    this.featuredProductsSection = page.locator('.product-grid');
    this.featuredProducts = page.locator('.product-item');
    this.categoryBlocks = page.locator('.home-page-category-grid');
    this.newsSection = page.locator('.news-items');
    this.pollSection = page.locator('.poll-block');
  }

  async navigateToHome() {
    await this.navigate('/');
  }

  async clickFeaturedProduct(productIndex: number) {
    const productLink = this.featuredProducts.nth(productIndex).locator('.product-title a');
    await this.click(productLink);
  }

  async getFeaturedProductsCount(): Promise<number> {
    return await this.featuredProducts.count();
  }

  async isHomePageLoaded(): Promise<boolean> {
    return await this.welcomeTitle.isVisible();
  }
}

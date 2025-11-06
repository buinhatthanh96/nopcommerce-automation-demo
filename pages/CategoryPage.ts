import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CategoryPage extends BasePage {
  readonly pageTitle: Locator;
  readonly breadcrumb: Locator;
  readonly subcategories: Locator;
  readonly products: Locator;
  readonly sortByDropdown: Locator;
  readonly displayDropdown: Locator;
  readonly viewModeGrid: Locator;
  readonly viewModeList: Locator;

  // Filter sidebar
  readonly filterByAttributes: Locator;
  readonly manufacturerFilter: Locator;
  readonly priceRangeSlider: Locator;

  constructor(page: Page) {
    super(page);

    this.pageTitle = page.locator('.page-title h1');
    this.breadcrumb = page.locator('.breadcrumb');
    this.subcategories = page.locator('.sub-category-item');
    this.products = page.locator('.product-item');
    this.sortByDropdown = page.locator('#products-orderby');
    this.displayDropdown = page.locator('#products-pagesize');
    this.viewModeGrid = page.locator('a[title="Grid"]');
    this.viewModeList = page.locator('a[title="List"]');

    // Filter sidebar
    this.filterByAttributes = page.locator('.filter-by-attributes');
    this.manufacturerFilter = page.locator('.product-manufacturer-filter');
    this.priceRangeSlider = page.locator('.price-range-filter');
  }

  async navigateToSubcategory(subcategoryName: string) {
    const subcategoryLink = this.page.locator(`.sub-category-item h2 a:has-text("${subcategoryName}")`);
    await this.click(subcategoryLink);
  }

  async sortBy(sortOption: string) {
    await this.safeSelectOption(this.sortByDropdown, sortOption);
    await this.waitForAjaxComplete();
  }

  async filterByManufacturer(manufacturer: string) {
    const manufacturerLabel = this.manufacturerFilter.locator(`label:has-text("${manufacturer}")`);
    await this.click(manufacturerLabel);
    await this.waitForAjaxComplete();
  }

  async filterByAttribute(attributeName: string, attributeValue: string) {
    const attributeSection = this.page.locator(
      `.filter-by-attributes:has-text("${attributeName}")`
    );
    const attributeLink = attributeSection.locator(`a:has-text("${attributeValue}")`);
    await this.click(attributeLink);
  }

  async getProductsCount(): Promise<number> {
    return await this.products.count();
  }

  async getSubcategoriesCount(): Promise<number> {
    return await this.subcategories.count();
  }

  async getBreadcrumbText(): Promise<string> {
    return (await this.breadcrumb.textContent()) || '';
  }

  async getProductNames(): Promise<string[]> {
    const products = await this.products.all();
    const names: string[] = [];

    for (const product of products) {
      const name = await product.locator('.product-title a').textContent();
      if (name) names.push(name.trim());
    }

    return names;
  }

  async getProductPrices(): Promise<number[]> {
    const products = await this.products.all();
    const prices: number[] = [];

    for (const product of products) {
      const priceText = await product.locator('.actual-price').textContent();
      if (priceText) {
        const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
        prices.push(price);
      }
    }

    return prices;
  }
}

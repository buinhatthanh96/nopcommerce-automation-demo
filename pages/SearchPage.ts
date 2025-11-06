import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SearchPage extends BasePage {
  readonly pageTitle: Locator;
  readonly searchKeywordInput: Locator;
  readonly advancedSearchCheckbox: Locator;
  readonly categoryDropdown: Locator;
  readonly automaticallySearchSubcategoriesCheckbox: Locator;
  readonly manufacturerDropdown: Locator;
  readonly searchInDescriptionsCheckbox: Locator;
  readonly searchInTagsCheckbox: Locator;
  readonly searchButton: Locator;
  readonly searchResults: Locator;
  readonly noResultsMessage: Locator;
  readonly sortByDropdown: Locator;
  readonly displayDropdown: Locator;
  readonly itemsPerPageDropdown: Locator;
  readonly viewModeGrid: Locator;
  readonly viewModeList: Locator;

  // Filter sidebar
  readonly priceRangeFilter: Locator;
  readonly priceRangeSlider: Locator;
  readonly priceRangeFromLabel: Locator;
  readonly priceRangeToLabel: Locator;
  readonly categoryFilters: Locator;
  readonly manufacturerFilters: Locator;

  constructor(page: Page) {
    super(page);

    this.pageTitle = page.locator('.page-title h1');
    this.searchKeywordInput = page.locator('#q');
    this.advancedSearchCheckbox = page.locator('#advs');
    this.categoryDropdown = page.locator('#cid');
    this.automaticallySearchSubcategoriesCheckbox = page.locator('#isc');
    this.manufacturerDropdown = page.locator('#mid');
    this.searchInDescriptionsCheckbox = page.locator('#sid');
    this.searchInTagsCheckbox = page.locator('#pti');
    this.searchButton = page.locator('button.search-button');
    this.searchResults = page.locator('.product-item');
    this.noResultsMessage = page.locator('.no-result');
    this.sortByDropdown = page.locator('#products-orderby');
    this.displayDropdown = page.locator('#products-pagesize');
    this.itemsPerPageDropdown = page.locator('#products-pagesize');
    this.viewModeGrid = page.locator('a[title="Grid"]');
    this.viewModeList = page.locator('a[title="List"]');

    // Filter sidebar
    this.priceRangeFilter = page.locator('.price-range-filter');
    this.priceRangeSlider = page.locator('#price-range-slider');
    this.priceRangeFromLabel = page.locator('.selected-price-range .from');
    this.priceRangeToLabel = page.locator('.selected-price-range .to');
    this.categoryFilters = page.locator('.category-filters ul li');
    this.manufacturerFilters = page.locator('.manufacturer-filter ul li');
  }

  async performBasicSearch(keyword: string) {
    await this.searchKeywordInput.fill(keyword);
    await this.click(this.searchButton);
  }

  async performAdvancedSearch(options: {
    keyword: string;
    category?: string;
    subcategories?: boolean;
    manufacturer?: string;
    searchInDescriptions?: boolean;
    searchInTags?: boolean;
  }) {
    await this.searchKeywordInput.fill(options.keyword);
    await this.advancedSearchCheckbox.check();

    if (options.category) {
      await this.categoryDropdown.selectOption({ label: options.category });
    }

    if (options.subcategories !== undefined) {
      if (options.subcategories) {
        await this.automaticallySearchSubcategoriesCheckbox.check();
      } else {
        await this.automaticallySearchSubcategoriesCheckbox.uncheck();
      }
    }

    if (options.manufacturer) {
      await this.manufacturerDropdown.selectOption({ label: options.manufacturer });
    }

    if (options.searchInDescriptions) {
      await this.searchInDescriptionsCheckbox.check();
    }

    if (options.searchInTags) {
      await this.searchInTagsCheckbox.check();
    }

    await this.click(this.searchButton);
  }

  async sortBy(sortOption: string) {
    await this.safeSelectOption(this.sortByDropdown, sortOption);
    await this.waitForAjaxComplete();
  }

  async changeDisplay(displayOption: string) {
    await this.safeSelectOption(this.displayDropdown, displayOption);
    await this.waitForAjaxComplete();
  }

  async getSearchResultsCount(): Promise<number> {
    return await this.searchResults.count();
  }

  async isNoResultsMessageVisible(): Promise<boolean> {
    return await this.noResultsMessage.isVisible();
  }

  async filterByPriceRange(min: string, max: string) {
    // Use jQuery UI slider API to set values
    // @ts-ignore - $ is available in browser context
    await this.page.evaluate(([minVal, maxVal]) => {
      // @ts-ignore - $ is available in browser context
      const slider = $('#price-range-slider');
      if (slider.length) {
        slider.slider('values', [parseInt(minVal), parseInt(maxVal)]);
        slider.trigger('slidechange');
      }
    }, [min, max]);
    
    // Trigger slider handles to ensure UI updates
    const sliderHandles = this.page.locator('.ui-slider-handle');
    await this.click(sliderHandles.first());
    await this.click(sliderHandles.last());
    
    // Wait for AJAX to complete
    await this.waitForAjaxComplete();
  }

  async selectCategoryFilter(category: string) {
    const categoryLink = this.page.locator(`.category-filters a:has-text("${category}")`);
    await this.click(categoryLink);
  }

  async selectManufacturerFilter(manufacturer: string) {
    const manufacturerLink = this.page.locator(`.manufacturer-filter a:has-text("${manufacturer}")`);
    await this.click(manufacturerLink);
  }

  async getProductNames(): Promise<string[]> {
    const products = await this.searchResults.all();
    const names: string[] = [];

    for (const product of products) {
      const name = await product.locator('.product-title a').textContent();
      if (name) names.push(name.trim());
    }

    return names;
  }

  async getProductPrices(): Promise<number[]> {
    const products = await this.searchResults.all();
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

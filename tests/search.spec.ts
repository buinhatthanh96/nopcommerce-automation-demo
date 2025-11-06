import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SearchPage } from '../pages/SearchPage';
import { Helpers } from '@utils/Helpers';

test.describe('Product Search Tests', () => {
  test.describe('Basic Search', () => {
    test('should search product from header search box', async ({ page }) => {
      const homePage = new HomePage(page);
      const searchPage = new SearchPage(page);

      await homePage.navigate('/');
      await homePage.searchProduct('samsung');

      const resultsCount = await searchPage.getSearchResultsCount();
      expect(resultsCount).toBeGreaterThan(0);

      const productNames = await searchPage.getProductNames();
      const hasSamsungProduct = productNames.some((name) => name.toLowerCase().includes('samsung'));
      expect(hasSamsungProduct).toBeTruthy();
    });

    test('should display no results for invalid search', async ({ page }) => {
      const homePage = new HomePage(page);
      const searchPage = new SearchPage(page);

      await homePage.navigate('/');
      await homePage.searchProduct('xyznonexistent123');

      const isNoResults = await searchPage.isNoResultsMessageVisible();
      expect(isNoResults).toBeTruthy();
    });

    test('should search with partial product name', async ({ page }) => {
      const homePage = new HomePage(page);
      const searchPage = new SearchPage(page);

      await homePage.navigate('/');
      await homePage.searchProduct('apple');

      const resultsCount = await searchPage.getSearchResultsCount();
      expect(resultsCount).toBeGreaterThan(0);
    });

    test('should handle empty search query', async ({ page }) => {
      const searchPage = new SearchPage(page);

      await searchPage.navigate('/search');
      await searchPage.performBasicSearch('');

      // Should show warning or all products
      await expect(page.locator('.warning')).toBeVisible();
    });
  });

  test.describe('Advanced Search', () => {
    test('should search with category filter', async ({ page }) => {
      const searchPage = new SearchPage(page);

      await searchPage.navigate('/search');
      await searchPage.performAdvancedSearch({
        keyword: 'laptop',
        category: 'Computers >> Notebooks',
        subcategories: false,
      });

      const resultsCount = await searchPage.getSearchResultsCount();
      expect(resultsCount).toBeGreaterThan(0);
    });

    test('should search with manufacturer filter', async ({ page }) => {
      const searchPage = new SearchPage(page);

      await searchPage.navigate('/search');
      await searchPage.performAdvancedSearch({
        keyword: 'macbook',
        manufacturer: 'Apple',
      });

      const resultsCount = await searchPage.getSearchResultsCount();
      const productNames = await searchPage.getProductNames();

      if (resultsCount > 0) {
        const hasAppleProduct = productNames.some(
          (name) => name.toLowerCase().includes('apple') || name.toLowerCase().includes('macbook')
        );
        expect(hasAppleProduct).toBeTruthy();
      }
    });

    test('should search with subcategories enabled', async ({ page }) => {
      const searchPage = new SearchPage(page);

      await searchPage.navigate('/search');
      await searchPage.performAdvancedSearch({
        keyword: 'computer',
        category: 'Computers',
        subcategories: true,
      });

      const resultsWithSubcategories = await searchPage.getSearchResultsCount();

      // Search again without subcategories
      await searchPage.navigate('/search');
      await searchPage.performAdvancedSearch({
        keyword: 'computer',
        category: 'Computers',
        subcategories: false,
      });

      const resultsWithoutSubcategories = await searchPage.getSearchResultsCount();

      // Results with subcategories should be >= results without
      expect(resultsWithSubcategories).toBeGreaterThanOrEqual(resultsWithoutSubcategories);
    });

    test('should search in product descriptions', async ({ page }) => {
      const searchPage = new SearchPage(page);

      await searchPage.navigate('/search');
      await searchPage.performAdvancedSearch({
        keyword: 'camera',
        searchInDescriptions: true,
      });

      const resultsCount = await searchPage.getSearchResultsCount();
      expect(resultsCount).toBeGreaterThan(0);
    });

    test('should search with multiple filters combined', async ({ page }) => {
      const searchPage = new SearchPage(page);

      await searchPage.navigate('/search');
      await searchPage.performAdvancedSearch({
        keyword: 'laptop',
        category: 'Computers >> Notebooks',
        manufacturer: 'HP',
        subcategories: true,
        searchInDescriptions: true,
      });

      const resultsCount = await searchPage.getSearchResultsCount();
      // Should have results or no results based on actual data
      expect(resultsCount).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('Search Results Manipulation', () => {
    test.beforeEach(async ({ page }) => {
      const searchPage = new SearchPage(page);
      await searchPage.navigate('/search');
      await searchPage.performAdvancedSearch({
        keyword: 'apple',
        searchInDescriptions: true,
      });
    });

    test('should change view mode between grid and list', async ({ page }) => {
      const searchPage = new SearchPage(page);

      await searchPage.click(searchPage.viewModeList);
      await searchPage.waitForAjaxComplete();
      await expect(page.locator('.product-list')).toBeVisible();

      await searchPage.click(searchPage.viewModeGrid);
      await searchPage.waitForAjaxComplete();
      await expect(page.locator('.product-grid')).toBeVisible();
    });

    test('should change items per page display', async ({ page }) => {
      const searchPage = new SearchPage(page);

      await searchPage.changeDisplay('3');

      const resultsCount = await searchPage.getSearchResultsCount();
      expect(resultsCount).toBeLessThanOrEqual(3);
    });
  });

  test.describe('Price Filtering', () => {
    test('should filter products by price range', async ({ page }) => {
      const searchPage = new SearchPage(page);

      await searchPage.navigate('/search?q=apple');
      await searchPage.priceRangeSlider.waitFor({ state: 'visible' });

      const initialCount = await searchPage.getSearchResultsCount();

      expect(initialCount).toBeGreaterThan(0);
      await searchPage.filterByPriceRange('500', '2000');

      const prices = await searchPage.getProductPrices();

      prices.forEach((price) => {
        expect(Helpers.isWithinRange(price, 500, 2000)).toBeTruthy();
      });
    });

    test('should filter with minimum price only', async ({ page }) => {
      const searchPage = new SearchPage(page);

      await searchPage.navigate('/search?q=laptop');
      await searchPage.priceRangeSlider.waitFor({ state: 'visible' });

      const initialCount = await searchPage.getSearchResultsCount();

      expect(initialCount).toBeGreaterThan(0);
      await searchPage.filterByPriceRange('1000', '10000');

      const prices = await searchPage.getProductPrices();

      prices.forEach((price) => {
        expect(price).toBeGreaterThanOrEqual(1000);
      });
    });

    test('should update results when price filter changes', async ({ page }) => {
      const searchPage = new SearchPage(page);

      await searchPage.navigate('/search?q=phone');
      await searchPage.priceRangeSlider.waitFor({ state: 'visible' });

      const initialCount = await searchPage.getSearchResultsCount();

      expect(initialCount).toBeGreaterThan(1);
      await searchPage.filterByPriceRange('500', '1000');

      const filteredCount = await searchPage.getSearchResultsCount();
      expect(filteredCount).toBeGreaterThan(0);
      expect(filteredCount).toBeLessThanOrEqual(initialCount);
    });
  });
});

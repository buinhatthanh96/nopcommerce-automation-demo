import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { CategoryPage } from '../pages/CategoryPage';
import testData from '../fixtures/testData.json';

test.describe('Category Navigation Tests', () => {
  test.describe('Main Category Navigation', () => {
    testData.categories.forEach((category) => {
      test(`should navigate to ${category} category`, async ({ page }) => {
        const homePage = new HomePage(page);
        const categoryPage = new CategoryPage(page);

        await homePage.navigate('/');
        await homePage.navigateToCategory(category);

        await expect(categoryPage.pageTitle).toBeVisible();
        const pageTitle = await categoryPage.pageTitle.textContent();
        expect(pageTitle?.trim()).toBe(category);
      });
    });

    test('should display breadcrumb in category page', async ({ page }) => {
      const homePage = new HomePage(page);
      const categoryPage = new CategoryPage(page);

      await homePage.navigate('/');
      await homePage.navigateToCategory('Computers');

      const breadcrumb = await categoryPage.getBreadcrumbText();
      expect(breadcrumb).toContain('Home');
      expect(breadcrumb).toContain('Computers');
    });
  });

  test.describe('Subcategory Navigation', () => {
    test('should display subcategories in Computers category', async ({ page }) => {
      const categoryPage = new CategoryPage(page);

      await categoryPage.navigate('/computers');

      const subcategoriesCount = await categoryPage.getSubcategoriesCount();
      expect(subcategoriesCount).toBeGreaterThan(0);
    });

    test('should navigate to Desktops subcategory', async ({ page }) => {
      const categoryPage = new CategoryPage(page);

      await categoryPage.navigate('/computers');
      await categoryPage.navigateToSubcategory('Desktops');

      await expect(categoryPage.pageTitle).toContainText('Desktops');

      const breadcrumb = await categoryPage.getBreadcrumbText();
      expect(breadcrumb).toContain('Computers');
      expect(breadcrumb).toContain('Desktops');
    });

    test('should navigate to Notebooks subcategory', async ({ page }) => {
      const categoryPage = new CategoryPage(page);

      await categoryPage.navigate('/computers');
      await categoryPage.navigateToSubcategory('Notebooks');

      await expect(categoryPage.pageTitle).toContainText('Notebooks');
    });

    test('should navigate to Electronics > Camera & photo', async ({ page }) => {
      const categoryPage = new CategoryPage(page);

      await categoryPage.navigate('/electronics');
      await categoryPage.navigateToSubcategory('Camera & photo');

      await expect(categoryPage.pageTitle).toBeVisible();

      const breadcrumb = await categoryPage.getBreadcrumbText();
      expect(breadcrumb).toContain('Electronics');
    });
  });

  test.describe('Category Product Display', () => {
    test('should display products in category', async ({ page }) => {
      const categoryPage = new CategoryPage(page);

      await categoryPage.navigate('/computers');

      // Navigate to a subcategory that has products
      await categoryPage.navigateToSubcategory('Notebooks');

      const productsCount = await categoryPage.getProductsCount();
      expect(productsCount).toBeGreaterThan(0);
    });

    test('should show product details in category listing', async ({ page }) => {
      const categoryPage = new CategoryPage(page);

      await categoryPage.navigate('/computers');
      await categoryPage.navigateToSubcategory('Notebooks');

      const products = await categoryPage.products.all();

      if (products.length > 0) {
        const firstProduct = products[0];
        await expect(firstProduct.locator('.product-title')).toBeVisible();
        await expect(firstProduct.locator('.actual-price')).toBeVisible();
      }
    });

    test('should have add to cart buttons in category', async ({ page }) => {
      const categoryPage = new CategoryPage(page);

      await categoryPage.navigate('/books');
      await page.locator('.product-grid').waitFor({ state: 'visible' });

      const addToCartButtons = page.locator('button:has-text("Add to cart")');
      const buttonsCount = await addToCartButtons.count();

      expect(buttonsCount).toBeGreaterThan(0);
    });
  });

  test.describe('Category View Modes', () => {
    test('should switch between grid and list view', async ({ page }) => {
      const categoryPage = new CategoryPage(page);

      await categoryPage.navigate('/computers');
      await categoryPage.navigateToSubcategory('Notebooks');

      // Check list view
      if (await categoryPage.viewModeList.isVisible()) {
        await categoryPage.click(categoryPage.viewModeList);
        await categoryPage.waitForAjaxComplete();
        await expect(page.locator('.product-list')).toBeVisible();
      }

      // Check grid view
      if (await categoryPage.viewModeGrid.isVisible()) {
        await categoryPage.click(categoryPage.viewModeGrid);
        await categoryPage.waitForAjaxComplete();
        await expect(page.locator('.product-grid')).toBeVisible();
      }
    });
  });

  test.describe('Category Sorting', () => {
    test.beforeEach(async ({ page }) => {
      const categoryPage = new CategoryPage(page);
      await categoryPage.navigate('/computers');
      await categoryPage.navigateToSubcategory('Notebooks');
    });

    test('should sort category products by price', async ({ page }) => {
      const categoryPage = new CategoryPage(page);

      await categoryPage.sortBy('Price: Low to High');

      const prices = await categoryPage.getProductPrices();

      for (let i = 0; i < prices.length - 1; i++) {
        expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
      }
    });

    test('should sort category products by name', async ({ page }) => {
      const categoryPage = new CategoryPage(page);

      await categoryPage.sortBy('Name: A to Z');

      const names = await categoryPage.getProductNames();
      const lowerNames = names.map((n) => n.toLowerCase());

      for (let i = 0; i < lowerNames.length - 1; i++) {
        expect(lowerNames[i] <= lowerNames[i + 1]).toBeTruthy();
      }
    });
  });

  test.describe('Category Filtering', () => {
    test('should show manufacturer filter in category', async ({ page }) => {
      const categoryPage = new CategoryPage(page);

      await categoryPage.navigate('/computers');
      await categoryPage.navigateToSubcategory('Notebooks');

      await expect(categoryPage.manufacturerFilter).toBeVisible();
      const filterItems = categoryPage.manufacturerFilter.locator('li');
      const count = await filterItems.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should filter category products by manufacturer', async ({ page }) => {
      const categoryPage = new CategoryPage(page);

      await categoryPage.navigate('/computers');
      await categoryPage.navigateToSubcategory('Notebooks');

      const initialCount = await categoryPage.getProductsCount();

      const manufacturerLabel = categoryPage.manufacturerFilter.locator('label').first();
      const manufacturerName = await manufacturerLabel.textContent();

      await categoryPage.filterByManufacturer(manufacturerName?.trim() || '');

      const filteredCount = await categoryPage.getProductsCount();
      expect(filteredCount).toBeGreaterThan(0);
      expect(filteredCount).toBeLessThanOrEqual(initialCount);
    });
  });
});

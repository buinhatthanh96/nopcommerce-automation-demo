import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class PasswordRecoveryPage extends BasePage {
  readonly pageTitle: Locator;
  readonly instructionText: Locator;
  readonly emailInput: Locator;
  readonly recoverButton: Locator;
  readonly errorMessage: Locator;
  readonly errorNotification: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);

    this.pageTitle = page.locator('.page-title h1');
    this.instructionText = page.locator('.page-body');
    this.emailInput = page.locator('#Email');
    this.recoverButton = page.locator('button[name="send-email"]');
    this.errorMessage = page.locator('.field-validation-error');
    this.errorNotification = page.locator('.bar-notification.error');
    this.successMessage = page.locator('.bar-notification.success');
  }

  async enterEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async clickRecover() {
    await this.click(this.recoverButton);
  }

  async recoverPassword(email: string) {
    await this.enterEmail(email);
    await this.clickRecover();
  }

  async getErrorMessage(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
    return (await this.errorMessage.textContent()) || '';
  }

  async getSuccessMessage(): Promise<string> {
    await this.successMessage.waitFor({ state: 'visible', timeout: 5000 });
    return (await this.successMessage.textContent()) || '';
  }

  async isSuccessMessageVisible(): Promise<boolean> {
    return await this.successMessage.isVisible();
  }

  async isErrorMessageVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  async getErrorNotification(): Promise<string> {
    await this.errorNotification.waitFor({ state: 'visible', timeout: 5000 });
    const content = this.errorNotification.locator('p.content');
    return (await content.textContent()) || '';
  }

  async isErrorNotificationVisible(): Promise<boolean> {
    return await this.errorNotification.isVisible();
  }
}


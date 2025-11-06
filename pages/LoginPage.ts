import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly pageTitle: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly forgotPasswordLink: Locator;
  readonly loginButton: Locator;
  readonly registerButton: Locator;
  readonly errorMessage: Locator;
  readonly emailErrorMessage: Locator;

  constructor(page: Page) {
    super(page);

    this.pageTitle = page.locator('.page-title h1');
    this.emailInput = page.locator('#Email');
    this.passwordInput = page.locator('#Password');
    this.rememberMeCheckbox = page.locator('#RememberMe');
    this.forgotPasswordLink = page.locator('a[href="/passwordrecovery"]');
    this.loginButton = page.locator('button.login-button');
    this.registerButton = page.locator('button.register-button');
    this.errorMessage = page.locator('.message-error');
    this.emailErrorMessage = page.locator('#Email-error');
  }

  async login(email: string, password: string, rememberMe: boolean = false) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);

    if (rememberMe) {
      await this.rememberMeCheckbox.check();
    }

    await this.click(this.loginButton);
  }

  async clickForgotPassword() {
    await this.click(this.forgotPasswordLink);
  }

  async clickRegisterButton() {
    await this.click(this.registerButton);
  }

  async getErrorMessage(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible' });
    return (await this.errorMessage.textContent()) || '';
  }

  async getEmailErrorMessage(): Promise<string> {
    await this.emailErrorMessage.waitFor({ state: 'visible' });
    return (await this.emailErrorMessage.textContent()) || '';
  }

  async isLoginSuccessful(): Promise<boolean> {
    return await this.logoutLink.isVisible();
  }
}

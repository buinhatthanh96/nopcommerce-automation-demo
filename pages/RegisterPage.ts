import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class RegisterPage extends BasePage {
  readonly pageTitle: Locator;
  readonly genderMaleRadio: Locator;
  readonly genderFemaleRadio: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  // readonly dateOfBirthDay: Locator;
  // readonly dateOfBirthMonth: Locator;
  // readonly dateOfBirthYear: Locator;
  readonly emailInput: Locator;
  readonly companyInput: Locator;
  readonly newsletterCheckbox: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly registerButton: Locator;
  readonly successMessage: Locator;
  readonly continueButton: Locator;
  readonly errorMessage: Locator;
  readonly emailErrorMessage: Locator;

  constructor(page: Page) {
    super(page);

    this.pageTitle = page.locator('.page-title h1');
    this.genderMaleRadio = page.locator('#gender-male');
    this.genderFemaleRadio = page.locator('#gender-female');
    this.firstNameInput = page.locator('#FirstName');
    this.lastNameInput = page.locator('#LastName');
    this.emailInput = page.locator('#Email');
    this.companyInput = page.locator('#Company');
    this.newsletterCheckbox = page.locator('input[id*="NewsLetterSubscriptions"][type="checkbox"]');
    this.passwordInput = page.locator('#Password');
    this.confirmPasswordInput = page.locator('#ConfirmPassword');
    this.registerButton = page.locator('#register-button');
    this.successMessage = page.locator('.result');
    this.continueButton = page.locator('a.register-continue-button');
    this.errorMessage = page.locator('.message-error');
    this.emailErrorMessage = page.locator('#Email-error');
  }

  async fillRegistrationForm(userData: {
    gender?: 'male' | 'female';
    firstName: string;
    lastName: string;
    email: string;
    company?: string;
    newsletter?: boolean;
    password: string;
    confirmPassword: string;
  }) {
    // Select gender if provided
    if (userData.gender === 'male') {
      await this.genderMaleRadio.check();
    } else if (userData.gender === 'female') {
      await this.genderFemaleRadio.check();
    }

    // Fill required fields
    await this.firstNameInput.fill(userData.firstName);
    await this.lastNameInput.fill(userData.lastName);
    await this.emailInput.fill(userData.email);

    // Fill optional company field
    if (userData.company) {
      await this.companyInput.fill(userData.company);
    }

    // Handle newsletter checkbox
    if (userData.newsletter !== undefined) {
      if (userData.newsletter) {
        await this.newsletterCheckbox.check();
      } else {
        await this.newsletterCheckbox.uncheck();
      }
    }

    await this.passwordInput.fill(userData.password);
    await this.confirmPasswordInput.fill(userData.confirmPassword);
  }

  async clickRegisterButton() {
    await this.click(this.registerButton);
  }

  async register(userData: {
    gender?: 'male' | 'female';
    firstName: string;
    lastName: string;
    email: string;
    company?: string;
    newsletter?: boolean;
    password: string;
    confirmPassword: string;
  }) {
    await this.fillRegistrationForm(userData);
    await this.clickRegisterButton();
  }

  async getSuccessMessage(): Promise<string> {
    await this.successMessage.waitFor({ state: 'visible' });
    return (await this.successMessage.textContent()) || '';
  }

  async getErrorMessage(): Promise<string> {
    return (await this.errorMessage.textContent()) || '';
  }

  async continueAfterRegistration() {
    await this.click(this.continueButton);
  }
}

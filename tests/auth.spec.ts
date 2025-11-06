import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { PasswordRecoveryPage } from '../pages/PasswordRecoveryPage';
import { TestDataGenerator } from '../utils/TestDataGenerator';

test.describe('User Authentication Tests', () => {
  test.describe('User Registration', () => {
    test('should register new user with valid data', async ({ page }) => {
      const registerPage = new RegisterPage(page);
      const userData = TestDataGenerator.generateUserData();

      await registerPage.navigate('/');
      await registerPage.clickRegister();
      await registerPage.register({
        ...userData,
        newsletter: true,
      });

      const successMessage = await registerPage.getSuccessMessage();
      expect(successMessage).toContain('Your registration completed');

      await registerPage.continueAfterRegistration();
      const homePage = new HomePage(page);
      expect(await homePage.isUserLoggedIn()).toBeTruthy();
    });

    test('should not register with existing email', async ({ page }) => {
      const registerPage = new RegisterPage(page);
      const userData = TestDataGenerator.generateUserData();

      // Register first time
      await registerPage.navigate('/');
      await registerPage.clickRegister();
      await registerPage.register({
        ...userData,
        newsletter: false,
      });

      await registerPage.continueAfterRegistration();
      await registerPage.clickLogout();

      // Try to register again with same email
      await registerPage.clickRegister();
      await registerPage.register({
        ...userData,
        firstName: 'Different',
        lastName: 'Name',
      });

      const errorMessage = await registerPage.getErrorMessage();
      expect(errorMessage).toContain('already exists');
    });

    test('should not register with mismatched passwords', async ({ page }) => {
      const registerPage = new RegisterPage(page);
      const userData = TestDataGenerator.generateUserData();

      await registerPage.navigate('/');
      await registerPage.clickRegister();
      await registerPage.register({
        ...userData,
        confirmPassword: 'DifferentPassword123!',
      });

      await expect(page.locator('#ConfirmPassword-error')).toBeVisible();
    });

    test('should not register with weak password', async ({ page }) => {
      const registerPage = new RegisterPage(page);
      const userData = TestDataGenerator.generateUserData();

      await registerPage.navigate('/');
      await registerPage.clickRegister();
      await registerPage.register({
        ...userData,
        password: '123',
        confirmPassword: '123',
      });

      await expect(page.locator('#Password-error')).toBeVisible();
    });

    test('should not register with missing required fields', async ({ page }) => {
      const registerPage = new RegisterPage(page);

      await registerPage.navigate('/');
      await registerPage.clickRegister();
      await registerPage.clickRegisterButton();

      await expect(registerPage.firstNameInput).toHaveAttribute('data-val-required', /.+/);
      await expect(registerPage.lastNameInput).toHaveAttribute('data-val-required', /.+/);
      await expect(registerPage.emailInput).toHaveAttribute('data-val-required', /.+/);
    });

    test('should register without optional fields', async ({ page }) => {
      const registerPage = new RegisterPage(page);
      const userData = TestDataGenerator.generateUserData();

      await registerPage.navigate('/');
      await registerPage.clickRegister();
      await registerPage.register({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.confirmPassword,
      });

      const successMessage = await registerPage.getSuccessMessage();
      expect(successMessage).toContain('Your registration completed');
    });
  });

  test.describe('User Login', () => {
    let registeredEmail: string;
    let registeredPassword: string;

    test.beforeEach(async ({ page }) => {
      // Create a user for login tests
      const registerPage = new RegisterPage(page);
      const userData = TestDataGenerator.generateUserData();
      registeredEmail = userData.email;
      registeredPassword = userData.password;

      await registerPage.navigate('/');
      await registerPage.clickRegister();
      await registerPage.register(userData);
      await registerPage.continueAfterRegistration();
      await registerPage.clickLogout();
    });

    test('should login with valid credentials', async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.navigate('/login');
      await loginPage.login(registeredEmail, registeredPassword);

      expect(await loginPage.isLoginSuccessful()).toBeTruthy();
    });

    test('should login with Remember Me checked', async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.navigate('/login');
      await loginPage.login(registeredEmail, registeredPassword, true);

      expect(await loginPage.isLoginSuccessful()).toBeTruthy();

      // Verify cookie is set
      const cookies = await page.context().cookies();
      const authCookie = cookies.find((c) => c.name.includes('Authentication'));
      expect(authCookie).toBeDefined();
    });

    test('should not login with invalid email', async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.navigate('/login');
      await loginPage.login('invalid@example.com', registeredPassword);

      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toContain('Login was unsuccessful');
    });

    test('should not login with invalid password', async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.navigate('/login');
      await loginPage.login(registeredEmail, 'WrongPassword123!');

      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toContain('Login was unsuccessful');
    });

    test('should not login with empty credentials', async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.navigate('/login');
      await loginPage.login('', '');

      const errorMessage = await loginPage.getEmailErrorMessage();
      expect(errorMessage).toContain('Please enter your email');
    });
  });

  test.describe('User Logout', () => {
    test('should logout successfully', async ({ page }) => {
      const registerPage = new RegisterPage(page);
      const loginPage = new LoginPage(page);
      const userData = TestDataGenerator.generateUserData();

      // Register and login
      await registerPage.navigate('/');
      await registerPage.clickRegister();
      await registerPage.register(userData);
      await registerPage.continueAfterRegistration();

      // Verify logged in
      expect(await loginPage.isUserLoggedIn()).toBeTruthy();

      // Logout
      await loginPage.clickLogout();

      // Verify logged out
      await expect(registerPage.loginLink).toBeVisible();
      await expect(registerPage.registerLink).toBeVisible();
    });
  });

  test.describe('Password Recovery', () => {
    test('should navigate to password recovery page from login', async ({ page }) => {
      const loginPage = new LoginPage(page);
      const passwordRecoveryPage = new PasswordRecoveryPage(page);

      await loginPage.navigate('/login');
      await loginPage.clickForgotPassword();

      await expect(passwordRecoveryPage.pageTitle).toHaveText('Password recovery');
      await expect(page).toHaveURL(/.*passwordrecovery.*/);
    });

    test('should show error for empty email', async ({ page }) => {
      const passwordRecoveryPage = new PasswordRecoveryPage(page);

      await passwordRecoveryPage.navigate('/passwordrecovery');
      await passwordRecoveryPage.clickRecover();

      await expect(passwordRecoveryPage.errorMessage).toBeVisible();
      const errorText = await passwordRecoveryPage.getErrorMessage();
      expect(errorText).toEqual('Enter your email');
    });

    test('should show error for invalid email format', async ({ page }) => {
      const passwordRecoveryPage = new PasswordRecoveryPage(page);

      await passwordRecoveryPage.navigate('/passwordrecovery');
      await passwordRecoveryPage.recoverPassword('invalid-email');

      await expect(passwordRecoveryPage.errorMessage).toBeVisible();
      const errorText = await passwordRecoveryPage.getErrorMessage();
      expect(errorText).toEqual('Please enter a valid email address.');
    });

    test('should show error for non-registered email', async ({ page }) => {
      const passwordRecoveryPage = new PasswordRecoveryPage(page);
      const nonExistentEmail = `nonexistent${Date.now()}@test.com`;

      await passwordRecoveryPage.navigate('/passwordrecovery');
      await passwordRecoveryPage.recoverPassword(nonExistentEmail);

      await expect(passwordRecoveryPage.errorNotification).toBeVisible();
      const errorText = await passwordRecoveryPage.getErrorNotification();
      expect(errorText).toEqual('Email not found.');
    });

    test('should send recovery email for registered user', async ({ page }) => {
      const registerPage = new RegisterPage(page);
      const passwordRecoveryPage = new PasswordRecoveryPage(page);
      const userData = TestDataGenerator.generateUserData();

      // First register a user
      await registerPage.navigate('/');
      await registerPage.clickRegister();
      await registerPage.register(userData);
      await registerPage.continueAfterRegistration();
      await registerPage.clickLogout();

      // Try to recover password
      await passwordRecoveryPage.navigate('/passwordrecovery');
      await passwordRecoveryPage.recoverPassword(userData.email);

      // Verify success message
      await expect(passwordRecoveryPage.successMessage).toBeVisible();
      const successText = await passwordRecoveryPage.getSuccessMessage();
      expect(successText).toEqual('Email with instructions has been sent to you.');
    });

    test('should display proper instruction text', async ({ page }) => {
      const passwordRecoveryPage = new PasswordRecoveryPage(page);

      await passwordRecoveryPage.navigate('/passwordrecovery');

      await expect(passwordRecoveryPage.pageTitle).toBeVisible();
      await expect(passwordRecoveryPage.instructionText).toBeVisible();
      
      const instructionText = await passwordRecoveryPage.instructionText.textContent();
      expect(instructionText).toContain('email');
    });
  });
});

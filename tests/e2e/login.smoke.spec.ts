import { test, expect } from '@playwright/test';
import { LoginPage } from 'tests';

test.describe('Login Smoke Tests', () => {

  test('Should display login page with all required elements', {
    tag: ['@TC010', '@smoke', '@login'],
    annotation: {
      type: 'Module',
      description: 'Login Page Elements',
    }
  }, async ({ page }) => {

    await page.goto('/');

    // Verify login page elements are visible
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
    await expect(page.locator('[name="username"]')).toBeVisible();
    await expect(page.locator('[name="password"]')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    await expect(page.getByText('Forgot your password?')).toBeVisible();

    // Verify the credentials hint is displayed
    await expect(page.getByText('Username : Admin')).toBeVisible();
    await expect(page.getByText('Password : admin123')).toBeVisible();
  });


  test('Should successfully login with valid Admin credentials', {
    tag: ['@TC011', '@smoke', '@login'],
    annotation: {
      type: 'Module',
      description: 'Successful Login',
    }
  }, async ({ page }) => {

    await page.goto('/');

    const login = new LoginPage(page);
    await login.UserLogin('Admin', 'admin123');

    // Verify redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard\/index/);
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

    // Verify sidebar navigation is accessible
    await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'PIM' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Leave' })).toBeVisible();

    // Verify user profile is shown
    await expect(page.getByText('test user')).toBeVisible();
  });


  test('Should show error for invalid credentials', {
    tag: ['@TC012', '@smoke', '@login'],
    annotation: {
      type: 'Module',
      description: 'Invalid Credentials Error',
    }
  }, async ({ page }) => {

    await page.goto('/');

    const login = new LoginPage(page);
    await login.UserLogin('Admin', 'wrongpass');

    // Verify error message appears
    await expect(page.getByText('Invalid credentials')).toBeVisible();

    // Verify we stay on the login page (not redirected)
    await expect(page).toHaveURL(/\/auth\/login/);
  });


  test('Should show validation error when fields are empty and submitted', {
    tag: ['@TC013', '@smoke', '@login'],
    annotation: {
      type: 'Module',
      description: 'Empty Fields Validation',
    }
  }, async ({ page }) => {

    await page.goto('/');

    // Click login without entering credentials
    await page.getByRole('button', { name: 'Login' }).click();

    // Verify required field validation messages
    await expect(page.locator('span.oxd-input-field-error-message').first()).toBeVisible();
    await expect(page.getByText('Required').first()).toBeVisible();
  });


  test('Should navigate to Forgot Password page and return to login', {
    tag: ['@TC014', '@smoke', '@login'],
    annotation: {
      type: 'Module',
      description: 'Forgot Password Flow',
    }
  }, async ({ page }) => {

    await page.goto('/');

    // Click forgot password link
    await page.getByText('Forgot your password?').click();

    // Verify navigated to reset password page
    await expect(page).toHaveURL(/\/auth\/requestPasswordResetCode/);
    await expect(page.getByRole('heading', { name: 'Reset Password' })).toBeVisible();

    // Navigate back to login
    await page.getByText('OrangeHRM OS 5.8').scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: 'Cancel' }).click();

    // Verify back on login page
    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  });


  test('Should maintain session state across page reloads after login', {
    tag: ['@TC015', '@smoke', '@login'],
    annotation: {
      type: 'Module',
      description: 'Session Persistence',
    }
  }, async ({ page, context }) => {

    await page.goto('/');

    const login = new LoginPage(page);
    await login.UserLogin('Admin', 'admin123');

    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

    // Reload the page to verify session persists
    await page.reload();
    await expect(page).toHaveURL(/\/dashboard\/index/);
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

});

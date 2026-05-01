import { test, expect } from '@playwright/test';

test('Login to Conduit App', async ({ page }) => {

  // Go to website
  await page.goto('https://conduit.bondaracademy.com/');

  // Click on Sign in link
  await page.click('text=Sign in');

  // Fill email
  await page.fill('input[placeholder="Email"]', 'learnerharisbd@gmail.com');

  // Fill password
  await page.fill('input[placeholder="Password"]', 'H12345bd');

  // Click login button
  await page.click('button:has-text("Sign in")');

  // Assertion - verify user logged in
  await expect(page.locator('a.nav-link >> text=haris')).toBeVisible();

});
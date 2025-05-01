import { test, expect } from '@playwright/test';


test('Admin login', {
    tag: '@orangetest'
}, async ({ page }) => {

    await page.goto('/');
    
    await page.click('[name=username]');
    await page.fill('[name=username]',"Admin");
    await page.fill('[name=password]',"admin123");
    await page.click('button[type=submit]')
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

  
  });


  
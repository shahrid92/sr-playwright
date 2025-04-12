import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login';
import { DashboardPage } from '../pages/dashboard';

test.describe('Smoke Test',()=>{

  const testData = [
    { username: 'Admin', password: 'admin123', expected: true },
    { username: 'Admin', password: 'wrongpass', expected: false }
  ];

  test('Admin login',{
    tag:'@login'
  }, async ({ page }) => {
  
    await page.goto('/',{ waitUntil: 'load' });
  
    const loginPage = new LoginPage(page);
    await loginPage.UserLogin("Admin","admin123");
  
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.checkDashboardTitle();
  });
  
})



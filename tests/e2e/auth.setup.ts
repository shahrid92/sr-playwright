import { test as setup, expect } from '@playwright/test';
import path from 'path';
import { LoginPage, DashboardPage } from 'tests';

type LoginFixtures = {
   loginPage: LoginPage;
   dashboard: DashboardPage;
}

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authentication',async ({page})=>{

    await page.goto('/', { waitUntil: 'load' });

    const loginPage = new LoginPage(page);
    await loginPage.UserLogin("Admin", "admin123");
    
    const dashboard = new DashboardPage(page);

    await page.context().storageState({ path: authFile });

})
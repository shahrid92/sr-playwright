import { test as base } from '@playwright/test';
import {LoginPage} from '../src/pages/login';
import {DashboardPage} from '../src/pages/dashboard';

 type LoginFixtures = {
    loginPage:LoginPage;
    dashboard:DashboardPage;
 }

 export const test = base.extend<LoginFixtures>({
    loginPage: async({page},use) =>{
        
        await page.goto('/',{ waitUntil: 'load' });

         const loginPage = new LoginPage(page); 
         await loginPage.UserLogin("Admin","admin123");

         await use(loginPage);
    },

    dashboard: async({page},use) =>{
        const dashboard = new DashboardPage(page);
        await use(dashboard); 
   }
 });

 export { expect } from '@playwright/test';
import { test as base } from '@playwright/test';
import { LoginPage, DashboardPage } from 'tests';

type LoginFixtures = {
   loginPage: LoginPage;
   dashboard: DashboardPage;
}

export const test = base.extend<LoginFixtures>({
   loginPage: async ({ page }, use) => {

      // Example of network intercept
      await page.route('**/auth/validate', async route => {
         const request = route.request();
         const response = await route.fetch();

         console.log({
            url: request.url(),
            method: request.method(),
            headers: request.headers(),
            postData: request.postData(),
         });

         const body = await response.text();
         console.log(body)

         await route.continue();
      });


      await page.goto('/', { waitUntil: 'load' });

      const loginPage = new LoginPage(page);
      await loginPage.UserLogin("Admin", "admin123");

      await use(loginPage);
   },

   dashboard: async ({ page }, use) => {
      const dashboard = new DashboardPage(page);
      await use(dashboard);
   }
});

export { expect } from '@playwright/test';
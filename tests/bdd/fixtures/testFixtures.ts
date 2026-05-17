import { test as base } from 'playwright-bdd';

import { LoginPage } from '../steps/LoginPage';

type MyFixtures = {
  loginPage: LoginPage;
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});

export const expect = test.expect;
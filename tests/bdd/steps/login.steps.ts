import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/testFixtures';

const { Given, When, Then } = createBdd(test);



Given('user launches login paged', async ({ loginPage }) => {
  await loginPage.homePage();
});

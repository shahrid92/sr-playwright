import { LoginPage, DashboardPage, adminPage } from '@pages';
import { test, expect } from '@fixtures';
import { faker } from '@faker-js/faker';

test.describe('Smoke Test', () => {

  const testData = [
    { username: 'Admin', password: 'admin123', expected: true },
    { username: 'Admin', password: 'wrongpass', expected: false }
  ];

  test('As Admin, Crete new user access', {
    tag: '@TC001',
    annotation: {
      type: 'Module',
      description: 'Create Users',
    }
  }, async ({ page, browser, loginPage, dashboard }) => {

    test.info().annotations.push({
      type: 'browser version',
      description: browser.version(),
    });

    test.setTimeout(120000)

    await page.getByRole('link', { name: 'Admin' }).click();
    await page.getByRole('button', { name: ' Add' }).click();
    await page.locator('form i').first().click();
    await page.getByRole('option', { name: 'ESS' }).click();
    await page.locator('form i').nth(1).click();
    await page.getByRole('option', { name: 'Enabled' }).click();
    await page.getByRole('textbox').nth(2).click();
    await page.getByRole('textbox').nth(2).fill('test1234999');
    await page.getByRole('textbox').nth(3).click();
    await page.getByRole('textbox').nth(3).fill('test123');
    await page.getByRole('textbox').nth(4).click();
    await page.getByRole('textbox').nth(4).fill('test123');
    await page.getByRole('textbox', { name: 'Type for hints...' }).click();
    await page.getByRole('textbox', { name: 'Type for hints...' }).fill('a');
    await page.locator(".oxd-autocomplete-wrapper > [role='listbox'] > div:nth-child(1) > span").click()
    await page.getByRole('button', { name: 'Save' }).click();
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers');

    await expect(page.getByText("System Users")).toBeVisible()


  });


  test('As Admin, search existing employee', {
    tag: '@TC002',
    annotation: {
      type: 'Module',
      description: 'Search existing employee user id',
    }
  }, async ({
    page,
    browser,
    loginPage,
    dashboard
  }) => {

    test.info().annotations.push({
      type: 'browser version',
      description: browser.version(),
    });

    await page.getByRole('link', { name: 'Admin' }).click();

    const ap = new adminPage(page)
    await ap.searchEmployee("Admin", "Admin", "Tijo Georege", "Enabled")



  });

  const TopMenuLists = [
    { topmenu: "User Management", submenu: ["Users"], title: "System Users" },
    { topmenu: "Job", submenu: ["Job Titles", "Pay Grades", "Employment Status", "Job Categories", "Work Shifts"] },
    { topmenu: "Organization", submenu: ["General Information", "Locations", "Structure"] },
    { topmenu: "Qualifications", submenu: ["Skills", "Education", "Licenses", "Languages", "Memberships"] },
    { topmenu: "Nationalities", submenu: [null] },
    { topmenu: "Corporate Branding", submenu: [null] },
    { topmenu: "Configuration", submenu: ["Email Configuration", "Email Subscriptions", "Localization", "Language Packages", "Modules", "Social Media Authentication", "Register OAuth Client", "LDAP Configuration"] },
  ];


  test("Verify Admin top menu navigation page", {
    tag: '@TC003',
    annotation: {
      type: 'Module',
      description: 'Top menu navigation bar',
    }
  }, async ({
    page,
    browser,
    loginPage,
    dashboard }) => {

    test.setTimeout(120000)

    await page.getByRole('link', { name: 'Admin' }).click();

    for (const menu of TopMenuLists) {

      await page.getByRole('listitem').filter({ hasText: menu.topmenu }).click();

      for (const sm of menu.submenu) {

        if (sm != null) {
          await page.getByRole('menuitem', { name: sm }).waitFor({ state: 'visible', timeout: 120000 })
          await expect(page.getByRole('menuitem', { name: sm })).toBeVisible({ timeout: 120000 })
          await expect(page.getByRole('menuitem', { name: sm })).toHaveText(sm)
          await page.getByRole('menuitem', { name: sm }).click();
          await page.getByRole('listitem').filter({ hasText: menu.topmenu }).click();
        }

      }
    }
  });


  test("Verify job titles creations",
    {
      tag: '@TC004',
      annotation: {
        type: 'Module',
        description: 'Top menu navigation bar',
      }
    }, async (
      {
        page,
        browser,
        loginPage,
        dashboard
      }
    ) => {

    const username = "tester" + faker.string.alphanumeric(6);

    test.setTimeout(120000)

    await page.getByRole('link', { name: 'Admin' }).click();
    await page.getByRole('listitem').filter({ hasText: 'Job' }).click();
    await page.getByRole('menuitem', { name: 'Job Titles' }).waitFor({ state: 'visible', timeout: 120000 })
    await page.getByRole('menuitem', { name: 'Job Titles' }).click()

    await page.getByRole('button', { name: ' Add' }).click()
    await page.getByRole('textbox').nth(1).click();
    await page.getByRole('textbox').nth(1).fill(username);
    await page.getByRole('textbox', { name: 'Type description here' }).click();
    await page.getByRole('textbox', { name: 'Type description here' }).fill('tthis test description');
    await page.getByRole('textbox', { name: 'Add note' }).click();
    await page.getByRole('textbox', { name: 'Add note' }).fill('this is note');
    await page.getByRole('button', { name: 'Save' }).click();

    await page.getByText(username).scrollIntoViewIfNeeded();

    await expect(page.getByText(username)).toBeVisible()


  })


  test("Ensure general information able to update", {
    tag: '@TC005',
    annotation: {
      type: 'Description',
      description: 'To validate users able to update general information details',
    }
  }, async (
    {
      page,
      browser,
      loginPage,
      dashboard
    }
  ) => {

    test.setTimeout(120000)

    await page.getByRole('link', { name: 'Admin' }).click();
    await page.getByRole('listitem').filter({ hasText: 'Organization' }).click();
    await page.getByRole('menuitem', { name: 'General Information' }).waitFor({ state: 'visible', timeout: 120000 })


    await page.getByRole('menuitem', { name: 'General Information' }).click();
    await page.locator('label').filter({ hasText: 'Edit' }).locator('span').click();
    await page.locator('textarea').click();
    await page.locator('textarea').fill(faker.string.alphanumeric(16));
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.locator('textarea')).toHaveAttribute("disabled")

  })
  test("Verify skills can be addded",
    {
      tag: '@TC006',
      annotation: {
        type: 'Description',
        description: 'Verify the admin able to add new skills',
      }
    }
    , async ({
      page,
      browser,
      loginPage,
      dashboard
    }) => {

      test.setTimeout(120000)


      await page.getByRole('link', { name: 'Admin' }).click();
      await page.getByRole('listitem').filter({ hasText: 'Qualifications' }).click();
      await page.getByRole('menuitem', { name: 'Skills' }).waitFor({ state: 'visible', timeout: 120000 })
      await page.getByRole('menuitem', { name: 'Skills' }).click();
      await page.getByText("Skills").waitFor({ state: "visible" })
      await page.getByText("Records Found").waitFor({ state: "visible" })

      const programming_lang = "Rust"
      const descp = "Top programming languange right now"

      const skills = page.getByRole("cell", { name: "Rust" })

      await test.step("Delete existing programming languange", async () => {

        if (await skills.count() > 0) {
          await skills.scrollIntoViewIfNeeded();
          await skills.waitFor({ state: 'visible', timeout: 5000 })

          await page.getByRole('row', { name: programming_lang }).getByRole('button').first().click();
          await page.getByRole('button', { name: 'Yes, Delete' }).click();
          await expect(page.getByText('Successfully Deleted')).toBeVisible();

        }

      })

      await page.getByRole('button', { name: ' Add' }).click()
      await page.getByText("Add Skill").waitFor({ state: "visible", timeout: 5000 })
      await page.locator('form input').waitFor({ state: "visible", timeout: 5000 })
      await page.locator('form input').click();
      await page.locator('form input').fill(programming_lang);
      await page.getByRole('textbox', { name: 'Type description here' }).click();
      await page.getByRole('textbox', { name: 'Type description here' }).fill(descp);
      await page.getByRole('button', { name: 'Save' }).click();
      await expect(page.getByText('Successfully Saved')).toBeVisible();
    })
  test("Verify Corporate branding able to upload login banner",
    
     {
      tag: '@TC007',
      annotation: {
        type: 'Description',
        description: 'Ensure able to upload client banner image',
      }
    }
    , async ({
      page,
      browser,
      loginPage,
      dashboard
    }) => {

      test.setTimeout(120000)

      await page.getByRole('link', { name: 'Admin' }).click();
      await page.getByRole('listitem').filter({ hasText: 'Corporate Branding' }).click();
      await page.getByRole('button', { name: 'Reset to Default' }).click();
      await page.getByText('Browse').nth(2).waitFor({state:'visible'})
      await page.getByText('Browse').nth(2).click();
      await page.locator('div').filter({ hasText: /^Login BannerBrowseNo file selected$/ }).getByRole('textbox').setInputFiles('C:\\Users\\shahr\\Shah Workspace\\01 Practice\\sr-playwright\\test-file\\photo\\tst-banner-340-65.png');
      await page.getByRole('button', { name: 'Publish' }).click();
      await expect(page.getByText('Successfully Saved')).toBeVisible();

   })


  test("verify 3 button exists rest to default,preview and publish", {
      tag: '@TC008',
      annotation: {
        type: 'Description',
        description: 'Verify 3 Button exists',
      }
    }, async (
      {
      page,
      browser,
      loginPage,
      dashboard
    }
    ) => {

      test.setTimeout(120000)

      await page.getByRole('link', { name: 'Admin' }).click();
      await page.getByRole('listitem').filter({ hasText: 'Corporate Branding' }).click();

      await page.getByRole('button',{name:"Reset to Default"}).waitFor({state:"visible"})

      await expect(page.getByRole('button',{name:"Reset to Default"})).toBeVisible();
      await expect(page.getByRole('button',{name:"Preview"})).toBeVisible();
      await expect(page.getByRole('button',{name:"Publish"})).toBeVisible();
      


    })

  test("User able to search specific menu via sidebar search ",{
      tag: '@TC009',
      annotation: {
        type: 'Description',
        description: 'To test users able to search specific menu',
      }
    }, async (
      {
      page,
      browser,
      loginPage,
      dashboard
    }
    ) => {

      test.setTimeout(120000)

      await page.getByRole('link', { name: 'Admin' }).click();

      await page.getByRole('textbox', { name: 'Search' }).click();
      await page.getByRole('textbox', { name: 'Search' }).fill('Dashboard')
      await page.getByRole('link', { name: 'Dashboard' }).click()

     })

});



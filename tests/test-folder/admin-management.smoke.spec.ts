import { LoginPage,DashboardPage,adminPage } from '@pages';
import { test, expect } from '@fixtures';

test.describe('Smoke Test',()=>{

  const testData = [
    { username: 'Admin', password: 'admin123', expected: true },
    { username: 'Admin', password: 'wrongpass', expected: false }
  ];

  test('As Admin, Crete new user access',{
    tag:'@TC001',
    annotation: {
      type: 'issue',
      description: 'https://github.com/microsoft/playwright/issues/23180',
    }
  }, async ({ page,browser,loginPage,dashboard}) => {
    
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
      
  });


  test('As Admin, search existing employee', {
      tag:'@TC002',
      annotation: {
        type: 'issue',
        description: 'https://github.com/microsoft/playwright/issues/23180',
    }
  },async ({ 
    page,
    browser,
    loginPage,
    dashboard
  }) =>{

      test.info().annotations.push({
        type: 'browser version',
        description: browser.version(),
      });

      await page.getByRole('link', { name: 'Admin' }).click();

      const ap = new adminPage(page)
      await ap.searchEmployee("Admin","Admin","manda","Enabled")
    


  });

  test("Verify Admin top menu navigation routing",{
    tag:'@TC003',
  },async({ 
    page,
    browser,
    loginPage,
    dashboard})=>{
      await page.getByRole('link', { name: 'Admin' }).click();
      await page.getByRole('listitem').filter({ hasText: 'Job' }).click();
      await expect(page.getByRole('menuitem', { name: 'Pay Grades' })).toHaveText("Pay Grades")
      await page.getByRole('menuitem', { name: 'Pay Grades' }).click();
      await expect(page.locator("h6.orangehrm-main-title")).toHaveText("Pay Grades")
  })
  
  
})



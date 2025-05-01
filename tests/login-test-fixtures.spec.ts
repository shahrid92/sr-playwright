import {test,expect} from '../fixtures/initial-fixtures';

test('Login as Admin Test', 
   {tag:'@login-fix'}
  ,async ({ loginPage,dashboard,page }) => {
    await dashboard.checkDashboardTitle();
});
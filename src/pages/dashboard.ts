import { expect, type Locator, type Page } from '@playwright/test';


export class DashboardPage{
    readonly page:Page;

    constructor(page:Page){
        this.page = page;
    }

    async checkDashboardTitle() {
        await expect(this.page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();    
    }
}
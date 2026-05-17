import { Page, expect,type Locator, type test } from '@playwright/test'

export class LoginPage{

    readonly loginButton: Locator;
        readonly usertTextField: Locator;
        readonly passTextField: Locator;

    constructor(private page: Page) {
        this.usertTextField = page.locator('[name=username]');
        this.passTextField = page.locator('[name=password]');
        this.loginButton = page.locator('button[type=submit]');
    }

    async homePage(){
        await this.page.goto('/',{ waitUntil: 'load' });
        await this.usertTextField.fill("Admin");
        await this.passTextField.fill("admin123");
        await this.loginButton.click();
    }


}
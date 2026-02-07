import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {

    //readonly page: Page;
    readonly loginButton: Locator;
    readonly usertTextField: Locator;
    readonly passTextField: Locator;

    constructor(page: Page){
        this.usertTextField = page.locator('[name=username]');
        this.passTextField = page.locator('[name=password]');
        this.loginButton = page.locator('button[type=submit]');
    }

    async UserLogin(username:string,password:string){
        await this.usertTextField.fill(username);
        await this.passTextField.fill(password);
        await this.loginButton.click();
    }

}
import {test,expect,type Page, type Locator}  from '@playwright/test'
import { exitCode } from 'process';

export class adminPage{

    readonly userTextField: Locator;
    readonly userRoleSelect: Locator;
    readonly userRoleSelection: Locator;
    readonly employeeNameTextField: Locator;
    readonly statusSelection: Locator;
    readonly buttonSearch: Locator;
    readonly page:Page

    constructor(page:Page){
         this.userTextField = page.locator("div.oxd-input-group__label-wrapper + div > input");
         this.userRoleSelection = page.locator("//div[@class='oxd-select-text oxd-select-text--focus']/following-sibling::div[@class='oxd-select-dropdown --positon-bottom']/div[@role='option']/span");
         this.employeeNameTextField = page.locator("//input[@placeholder='Type for hints...']");
         this.statusSelection = page.locator("");
         this.userRoleSelect = page.locator(".oxd-select-text > [tabindex='0']");
         this.buttonSearch = page.locator("div > button[type='submit']")
         this.page = page;
    }

    async searchEmployee(name:string,userRole:string,employeeName:string,status:string){
       
        await this.userTextField.fill(name);
        await this.userRoleSelect.first().click();
        await this.userRoleSelection.getByText(userRole).click();
        await this.buttonSearch.waitFor({state: "visible",timeout:5000})
        await this.employeeNameTextField.fill(employeeName);
        
        const emm_name_autocomplete = this.page.getByRole("option")

        emm_name_autocomplete.waitFor({
            state:"visible",
            timeout:5000
        })

        await expect(
            emm_name_autocomplete
            .filter({hasText:employeeName})
        ).toBeVisible();

        await emm_name_autocomplete.click()

        await expect(
            this.page.getByRole("cell",{name:""})
            .filter({hasText:employeeName})
        ).toBeVisible();

        await this.buttonSearch.click()
    
    }


}
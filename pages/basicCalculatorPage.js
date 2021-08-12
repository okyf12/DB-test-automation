const { expect } = require("@playwright/test");

exports.BasicCalculatorPage = class BasicCalculatorPage {
    constructor(page) {
        this.page = page;
    }

    async goto() {
        await this.page.goto('https://testsheepnz.github.io/BasicCalculator');
    }
    async fillInputsInChoosenCalcBuild(buildOption, val1, val2, operationOption) {
        await this.page.selectOption('#selectBuild', buildOption)
        await this.page.fill('#number1Field', val1);
        await this.page.fill('#number2Field', val2);
        await this.page.selectOption('#selectOperationDropdown', operationOption);
        await this.page.click('#calculateButton');
    }
    async fillInputsInChoosenCalcBuildWithCheck(buildOption, val1, val2, operationOption) {
        try {
            await this.page.selectOption('#selectBuild', buildOption, { timeout: 1000 })
            await this.page.fill('#number1Field', val1, { timeout: 1000 });
            await this.page.fill('#number2Field', val2, { timeout: 1000 });
            await this.page.selectOption('#selectOperationDropdown', operationOption, { timeout: 1000 });
            await this.page.click('#calculateButton', { timeout: 1000 });
        } catch (error) {
            throw new Error(error);
        }
    }
}
const { test, expect } = require('@playwright/test');
const { BasicCalculatorPage } = require('../pages/basicCalculatorPage');

const calculatorOperations = ['0', '1', '2', '3', '4'];
const buildOptions = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

buildOptions.forEach(buildOption => {
    test.describe(`Basic Calculator test suite. Build: ${buildOption}`, () => {

        let page;
        test.beforeAll(async ({ browser }) => {
            page = await browser.newPage();
            startPage = new BasicCalculatorPage(page);
        });
        test.beforeEach(async () => {
            await startPage.goto();
        })

        // Build 1
        calculatorOperations.forEach(operation => {
            if (operation != 4) {
                test.only(`Test error message when letters in input fields are entered operation: ${operation}`, async () => {
                    await startPage.fillInputsInChoosenCalcBuildWithCheck(buildOption, 'abc', 'def', operation);
                    const isErrorVisible = await page.isVisible('#errorMsgField');
                    expect(isErrorVisible).toBe(true);
                });
            }
        });

        // Build 3
        test.only('Test \'Integers only\' checkbox visibility on concatenate operation', async () => {
            await page.selectOption('#selectBuild', buildOption)
            await page.selectOption('#selectOperationDropdown', '4');
            const isErrorVisible = await page.isVisible('#integerSelect');
            expect(isErrorVisible).toBe(false);
        });
        // Build 4
        test('Test \'Integers only\' checkbox (is enabled)', async () => {
            await page.selectOption('#selectBuild', buildOption);
            const isVisibleCheckBox = await page.isVisible('#integerSelect');
            const isClickable = await page.isEnabled('#integerSelect');
            // expect(isVisibleCheckBox).toBe(true);
            expect(isClickable).toBe(true);
        });
        // Build 5
        test('Test if \'Clear\' button is active', async () => {
            await page.selectOption('#selectBuild', buildOption)
            const isClearButtonEnabled = await page.isEnabled('#clearButton');
            expect(isClearButtonEnabled).toBe(true);
        });
        // Build 6
        test.only('Test for division by 0', async () => {
            await startPage.fillInputsInChoosenCalcBuildWithCheck(buildOption, '5', '0', '3');
            const isErrorVisible = await page.isVisible('#errorMsgField');
            expect(isErrorVisible).toBe(true);
        });
        test('Test errro message for division by 0', async () => {
            await startPage.fillInputsInChoosenCalcBuildWithCheck(buildOption, '5', '0', '3');
            const errorMessage = await page.textContent('#errorMsgField', { timeout: 100 });
            expect(errorMessage).toContain('Divide by zero error!');
        });
        // Additional tests
        test('Test 1st number input field (visibilaty)', async () => {
            await page.selectOption('#selectBuild', buildOption);
            const isVisible1stNumInput = await page.isVisible('#number1Field');
            expect(isVisible1stNumInput).toBe(true);
        });
        test('Test 2nd number input field (visibility)', async () => {
            await page.selectOption('#selectBuild', buildOption);
            const isVisible2stNumInput = await page.isVisible('#number2Field');
            expect(isVisible2stNumInput).toBe(true);
        });
        test('Test calculate button (visibility)', async () => {
            await page.selectOption('#selectBuild', buildOption);
            const isVisibleCalclulateButton = await page.isVisible('#calculateButton');
            expect(isVisibleCalclulateButton).toBe(true);
        });
        test('Test Clear button functionality', async () => {
            await startPage.fillInputsInChoosenCalcBuildWithCheck(buildOption, '5', '6', '3');//gal random reiktu padaryt 3
            await page.click('#clearButton');
            const resultValue = await page.inputValue('#numberAnswerField');
            expect(resultValue).toBe('');
        });

        calculatorOperations.forEach(operation => {
            const realNum1 = parseFloat((Math.random() * 100).toFixed(2));
            const realNum2 = parseFloat((Math.random() * 100).toFixed(2));
            let operationName;
            let expectedResult;
            switch (operation) {
                case '0':
                    operationName = 'add';
                    expectedResult = realNum1 + realNum2;
                    break;
                case '1':
                    operationName = 'subtract';
                    expectedResult = realNum1 - realNum2;
                    break;
                case '2':
                    operationName = 'multiply';
                    expectedResult = realNum1 * realNum2;
                    break;
                case '3':
                    operationName = 'devide';
                    expectedResult = realNum1 / realNum2;
                    break;
                case '4':
                    operationName = 'concatenate';
                    expectedResult = realNum1.toString() + realNum2.toString();
                    break;
            }
            test(`Test ${operationName} operation with real numbers`, async () => {
                await startPage.fillInputsInChoosenCalcBuildWithCheck(buildOption, realNum1.toString(), realNum2.toString(), operation);
                const resultValue = await page.inputValue('#numberAnswerField');
                //console.log(`First number:${realNum1}\nSecond number ${realNum2}\nResult: ${resultValue}\nExpected result: ${expectedResult}`); //Uncomment to see details about test(Ctrl+/)
                expect(resultValue).toBe(expectedResult.toString());
            });
            test.only(`Test ${operationName} operation answer with with real numbers when 'integer only' clicked`, async () => {
                await startPage.fillInputsInChoosenCalcBuildWithCheck(buildOption, realNum1.toString(), realNum2.toString(), operation);
                if (operationName !== 'concatenate') {
                    if (!await page.isChecked('#integerSelect'))
                        await page.click('#integerSelect');
                    expectedResult = Math.trunc(expectedResult).toString();
                }
                const resultValue = await page.inputValue('#numberAnswerField');
                // console.log(`First number:${realNum1}\nSecond number ${realNum2}\nResult: ${resultValue}\nExpected result: ${expectedResult}`);  //Uncomment to see details about test(Ctrl+/)
                expect(resultValue).toBe(expectedResult);
            });
        });
        calculatorOperations.forEach(operation => {
            const integerNum1 = Math.floor(Math.random() * 100);
            const integerNum2 = Math.floor(Math.random() * 100);
            let operationName;
            let expectedResult;
            switch (operation) {
                case '0':
                    operationName = 'add';
                    expectedResult = integerNum1 + integerNum2;
                    break;
                case '1':
                    operationName = 'subtract';
                    expectedResult = integerNum1 - integerNum2;
                    break;
                case '2':
                    operationName = 'multiply';
                    expectedResult = integerNum1 * integerNum2;
                    break;
                case '3':
                    operationName = 'devide';
                    expectedResult = integerNum1 / integerNum2;
                    break;
                case '4':
                    operationName = 'concatenate';
                    expectedResult = integerNum1.toString() + integerNum2.toString();
                    break;
            }
            test.only(`Test ${operationName} operation with ineger numbers`, async () => {
                await startPage.fillInputsInChoosenCalcBuildWithCheck(buildOption, integerNum1.toString(), integerNum2.toString(), operation);
                const resultValue = await page.inputValue('#numberAnswerField');
                // console.log(`First number:${integerNum1}\nSecond number ${integerNum2}\nResult: ${resultValue}\nExpected result: ${expectedResult}`); //Uncomment to see details about test(Ctrl+/)
                expect(resultValue).toBe(expectedResult.toString());
            });
            test(`Test ${operationName} operation answer with with integer numbers when 'integer only' clicked`, async () => {
                await startPage.fillInputsInChoosenCalcBuildWithCheck(buildOption, integerNum1.toString(), integerNum2.toString(), operation);
                if (operationName !== 'concatenate') {
                    if (!await page.isChecked('#integerSelect'))
                        await page.click('#integerSelect');
                    expectedResult = Math.trunc(expectedResult).toString();
                }
                const resultValue = await page.inputValue('#numberAnswerField');
                // console.log(`First number:${integerNum1}\nSecond number ${integerNum2}\nResult: ${resultValue}\nExpected result: ${expectedResult}`);  //Uncomment to see details about test(Ctrl+/)
                expect(resultValue).toBe(expectedResult);
            });
        });
    });
});
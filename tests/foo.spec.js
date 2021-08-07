const { test, expect } = require('@playwright/test');
const { DuckStartPage } = require('../pages/duckStartPage');

test.describe('Duck duck test suit', () => {
    let page;

    test.beforeAll(async({browser})=>{
        page =await browser.newPage();
        startPage=new DuckStartPage(page);
    });
    test.beforeEach(async()=>{
        await startPage.goto();
    });

    test('Checks that duckduckGo page can be opened', async () => {
        const isLogoVisible = await page.isVisible('#logo_homepage_link');
        expect(isLogoVisible).toBe(true);
    });
    test('Checks that results page opens and results are correct', async () => {
        await startPage.initiateSearch('Test');
        const resultText = await page.textContent('#r1-0');
        expect(resultText).toContain('test');
    });
    test('panda', async () => {
        await page.waitForSelector("#search_form_input_homepage");
        await page.fill('#search_form_input_homepage', "intitle:panda");
        await page.click("#search_button_homepage", { force: true });
        await page.waitForNavigation();
        const results = await page.evaluate(() => Array.from(document.querySelectorAll('.result__title'), element => element.textContent));
        console.log(results);
        results.forEach(result => {
            expect(result.toLowerCase()).toContain("panda");
        });
    });
    const passwordsLengths = ['8', '16', '64']; // arba masyva parasyt toki: [8,16,64]
    passwordsLengths.forEach(passwordLength => {
        test(`Generate ${passwordLength} chracters long password`, async () => {
            await page.waitForSelector("#search_form_input_homepage");
            await page.fill('#search_form_input_homepage', ("password " + passwordLength));
            await page.click("#search_button_homepage");
            const generatedPassword = await page.textContent(".c-base__title");
            expect(generatedPassword.length).toEqual(+passwordLength) //+ pavercia string i skaiciuka
        });
    });
    //atvirkstinis variantas
    // const passwordsLengths1 = ['7', '65'];
    // passwordsLengths1.forEach(passwordLength => {
    //     test(`Dosen't generate ${passwordLength} chracters long password`, async () => {
    //         await page.waitForSelector("#search_form_input_homepage");
    //         await page.fill('#search_form_input_homepage', ("password " + passwordLength));
    //         await page.click("#search_button_homepage");
    //         const isPasswordContentVisible = await page.isVisible(".c-base__title");
    //         expect(isPasswordContentVisible).toBe(false)
    //     });
    // });
});
// test('Inspector demo', async () => {
//     

//     // Fill [placeholder="Search the web without being tracked"]
//     await page.fill('[placeholder="Search the web without being tracked"]', 'test');

//     // Click input:has-text("S")
//     await Promise.all([
//         page.waitForNavigation(/*{ url: 'https://duckduckgo.com/?q=test&t=h_&ia=web' }*/),
//         page.click('input:has-text("S")')
//     ]);

//     // Click #links div div:has-text("Speedtest by Ookla - The Global Broadband Speed TestYour browser indicates if yo")
//     // await page.click('#links div div:has-text("Speedtest by Ookla - The Global Broadband Speed TestYour browser indicates if yo")');
//     // expect(page.url()).toBe('https://www.speedtest.net/');
//     const resultText = await page.textContent('#r1-0');
//     expect(resultText).toContain('test');
// });
//bonus tests
/*DUCK.COM -> Redirects to duckduck.com
Check that Search on “Lithuania” has sidebar that has information summary on Lithuania displayed
Check that Search on “Password 8” generates random password (generate same length twice and compare that strings don’t match)
Searching for “is twitter down” returns “twitter.com seems up” under search results
Search for “qr www.devbridge.com” – validate that generated QR image is decoded correctly by visiting https://zxing.org/
Search for “lowercase HEllO wORld” – check that duck made it to lowercase correctly
Search for “:heart:” check that duck recognizes emojis
Search for “calendar 21st March 1989” verify that the 21st was Tuesday
Search for “sadfkasdflkasdlkfasldkfjlaskjdflkasjdfkajsdfkjaskldfjaklsdjfa” make sure that images contains “No results found”*/
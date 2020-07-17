import { browser, logging, protractor } from 'protractor'
import { LoginPage } from '../../page-objects/login.po'
import { CommonFuncs } from '../../test-utils/common.functions'
import { MyHomePage } from '../../page-objects/my-home.po'
const pg = require('../../test-utils/postgres.db')

describe('Login Page', () => {
    let loginPage: LoginPage
    let homePage: MyHomePage
    // tslint:disable-next-line: prefer-const
    let commonFunctions: CommonFuncs
    // tslint:disable-next-line: prefer-const
    let pathOfImage: string

    beforeAll(() => {
        browser.driver
            .manage()
            .window()
            .maximize()
        loginPage = new LoginPage()
        homePage = new MyHomePage()
        commonFunctions = new CommonFuncs()
        pathOfImage = commonFunctions.getRootEvidenceFolderName() + '\\login'
        commonFunctions.initEvidenceFolder(pathOfImage)
        browser.sleep(2000)
    })

    // afterEach(async () => {
    //     // Assert that there are no errors emitted from the browser
    //     const logs = await browser
    //         .manage()
    //         .logs()
    //         .get(logging.Type.BROWSER)
    //     expect(logs).not.toContain(
    //         jasmine.objectContaining({
    //             level: logging.Level.SEVERE,
    //         } as logging.Entry)
    //     )
    // })

    afterAll(() => {
        // loginPage.navigateTo()
        // homePage.getButtonLogOut().click()
    })

    it('Should Show Error Message when username or password is Empty', async () => {
        const EC = protractor.ExpectedConditions
        const condition1 = EC.elementToBeClickable(loginPage.getUsername())
        const condition2 = EC.elementToBeClickable(loginPage.getPassword())
        const condition3 = EC.elementToBeClickable(loginPage.getButtonLogIn())
        const condition4 = EC.browser.isElementPresent(loginPage.getMessage())
        const errorMessage = `Username and password is required !`
        const condition5 = EC.textToBePresentInElement(loginPage.getMessage(), errorMessage)

        browser.wait(condition1, 10000)
        browser.wait(condition2, 10000)
        browser.wait(condition3, 10000)
        /** Username and password are empty  */
        commonFunctions.waitForASec()
        await loginPage.getUsername().click()
        await loginPage.getUsername().clear()
        await loginPage.getUsername().sendKeys('')

        commonFunctions.waitForASec()
        await loginPage.getPassword().click()
        await loginPage.getPassword().clear()
        await loginPage.getPassword().sendKeys('')

        await browser.takeScreenshot().then((png) => {
            commonFunctions.writeScreenShot(png, pathOfImage + '\\image1.png')
        })
        await loginPage.getButtonLogIn().click()
        await browser.sleep(500).then(() => {
            expect(loginPage.getMessage().getText()).toEqual(errorMessage)
            browser.takeScreenshot().then((png) => {
                commonFunctions.writeScreenShot(png, pathOfImage + '\\image2.png')
            })
        })
        // browser.wait(condition4, 10000)
        // browser.wait(condition5, 10000)
        // const result = loginPage.getMessage().getText()
        // expect(await loginPage.getMessage().getText()).toEqual(errorMessage)

        // /** Username has value but password is empty */
        // commonFunctions.waitForASec()
        // await loginPage.getUsername().clear()
        // await loginPage.getUsername().click()
        // await loginPage.getUsername().sendKeys(browser.params.userForTest)

        // commonFunctions.waitForASec()
        // await loginPage.getPassword().clear()
        // await loginPage.getPassword().click()
        // await loginPage.getPassword().sendKeys('')

        // await browser.takeScreenshot().then((png) => {
        //     commonFunctions.writeScreenShot(png, pathOfImage + '\\image3.png')
        // })
        // commonFunctions.waitForASec()
        // loginPage.getButtonLogIn().click()
        // browser.wait(condition4, 10000)
        // const result2 = await loginPage.getMessage().getText()
        // expect(result2).toEqual(errorMessage)
        // // browser.wait(condition5, 10000)
        // await browser.takeScreenshot().then((png) => {
        //     commonFunctions.writeScreenShot(png, pathOfImage + '\\image4.png')
        // })

        // /** Username is empty but password has value */
        // commonFunctions.waitForASec()
        // await loginPage.getUsername().click()
        // await loginPage.getUsername().sendKeys(protractor.Key.SHIFT, protractor.Key.END, protractor.Key.BACK_SPACE)
        // await loginPage.getUsername().clear()

        // commonFunctions.waitForASec()
        // await loginPage.getPassword().clear()
        // await loginPage.getPassword().click()
        // await loginPage.getPassword().sendKeys('123456')

        // await browser.takeScreenshot().then((png) => {
        //     commonFunctions.writeScreenShot(png, pathOfImage + '\\image5.png')
        // })
        // commonFunctions.waitForASec()
        // loginPage.getButtonLogIn().click()
        // browser.wait(condition4, 10000)
        // const result3 = await loginPage.getMessage().getText()
        // expect(result3).toEqual(errorMessage)
        // // browser.wait(condition5, 10000)
        // await browser.takeScreenshot().then((png) => {
        //     commonFunctions.writeScreenShot(png, pathOfImage + '\\image6.png')
        // })
    })

    // it('Should show error message when username or password is wrong', async () => {
    //     const EC = protractor.ExpectedConditions
    //     const condition1 = EC.elementToBeClickable(loginPage.getUsername())
    //     const condition2 = EC.elementToBeClickable(loginPage.getPassword())
    //     const condition3 = EC.elementToBeClickable(loginPage.getButtonLogIn())
    //     const condition4 = EC.browser.isElementPresent(loginPage.getMessage())
    //     // const errorMessage = `Username and password is required !`

    //     browser.wait(condition1, 10000)
    //     browser.wait(condition2, 10000)
    //     browser.wait(condition3, 10000)
    //     const errorMessage = `Username or password is incorrect or User doesn't exist`
    //     // console.log(loginPage.navigateTo())
    //     /** Username doesn't exists */
    //     commonFunctions.waitForASec()
    //     await loginPage.getUsername().click()
    //     await loginPage.getUsername().clear()
    //     await loginPage.getUsername().sendKeys('usertest123')

    //     commonFunctions.waitForASec()
    //     await loginPage.getPassword().click()
    //     await loginPage.getPassword().clear()
    //     await loginPage.getPassword().sendKeys(browser.params.passwordOfUserForTest)

    //     await browser.takeScreenshot().then((png) => {
    //         commonFunctions.writeScreenShot(png, pathOfImage + '\\image7.png')
    //     })
    //     // commonFunctions.waitForASec()
    //     await loginPage.getButtonLogIn().click()
    //     browser.wait(condition4, 10000)
    //     const result = await loginPage.getMessage().getText()
    //     expect(result).toEqual(errorMessage)
    //     await browser.takeScreenshot().then((png) => {
    //         commonFunctions.writeScreenShot(png, pathOfImage + '\\image8.png')
    //     })

    //     /** Username exists but incorrect password */
    //     commonFunctions.waitForASec()
    //     await loginPage.getUsername().clear()
    //     await loginPage.getUsername().click()
    //     await loginPage.getUsername().sendKeys(browser.params.userForTest)

    //     commonFunctions.waitForASec()
    //     await loginPage.getPassword().clear()
    //     await loginPage.getPassword().click()
    //     await loginPage.getPassword().sendKeys('1234567')

    //     await browser.takeScreenshot().then((png) => {
    //         commonFunctions.writeScreenShot(png, pathOfImage + '\\image9.png')
    //     })
    //     commonFunctions.waitForASec()
    //     loginPage.getButtonLogIn().click()
    //     browser.wait(condition4, 10000)
    //     // console.log(await browser.isElementPresent(loginPage.getMessage()))
    //     const result2 = await loginPage.getMessage().getText()
    //     expect(result2).toEqual(errorMessage)
    //     await browser.takeScreenshot().then((png) => {
    //         commonFunctions.writeScreenShot(png, pathOfImage + '\\image10.png')
    //     })
    // })

    it('Should Successfully Login', async () => {
        let EC = protractor.ExpectedConditions
        const condition4 = EC.browser.isElementPresent(homePage.getWelcomeMessage())

        commonFunctions.waitForASec()
        await loginPage.getUsername().clear()
        await loginPage.getUsername().click()
        await loginPage.getUsername().sendKeys(browser.params.userForTest)

        commonFunctions.waitForASec()
        await loginPage.getPassword().clear()
        await loginPage.getPassword().click()
        await loginPage.getPassword().sendKeys(browser.params.passwordOfUserForTest)

        await browser.takeScreenshot().then((png) => {
            commonFunctions.writeScreenShot(png, pathOfImage + '\\image11.png')
        })
        commonFunctions.waitForASec()
        loginPage.getButtonLogIn().click()
        browser.wait(condition4, 10000)
        // console.log(await browser.isElementPresent(loginPage.getMessage()))
        const result = await homePage.getWelcomeMessage().getText()
        expect(result).toEqual(`Welcome, Khang Nguyen`)
        await browser.takeScreenshot().then((png) => {
            commonFunctions.writeScreenShot(png, pathOfImage + '\\image12.png')
        })
        // commonFunctions.waitForASec()
        // loginPage.getUsername().click()
        // loginPage.getUsername().clear()
        // loginPage.getUsername().sendKeys(browser.params.userForTest)
        // commonFunctions.waitForASec()
        // browser.waitForAngular()
        // // loginPage.getUsername().sendKeys(protractor.Key.TAB);
        // loginPage.getPassword().click()
        // loginPage.getPassword().clear()
        // loginPage.getPassword().sendKeys(browser.params.passwordOfUserForTest)
        // commonFunctions.waitForASec()
        // browser.waitForAngular()

        // browser.takeScreenshot().then((png) => {
        //     commonFunctions.writeScreenShot(png, pathOfImage + '\\image11.png')
        // })
        // commonFunctions.waitForASec()
        // loginPage.getButtonLogIn().click()
        // browser.sleep(500)
        // const result = await homePage.getWelcomeMessage() // commonFunctions.getJsonDataFromJsonBodyOfResponsePromise(homePage.getWelcomeMessage())
        // expect(result).toEqual(`Welcome, Khang Nguyen`)
        // browser.takeScreenshot().then((png) => {
        //     commonFunctions.writeScreenShot(png, pathOfImage + '\\image12.png')
        // })
        homePage.getButtonLogOut().click()
    })
})

import { browser, by, element } from 'protractor';

export class LoginPage {
    constructor() { }

    navigateTo() {
        // return browser.get(`${browser.baseUrl}/dashboard/home`) as Promise<any>
        return `${browser.baseUrl}dashboard/home`
    }
    getTitle() {
        return element(by.xpath(`//*[@id="div-main-layout"]/app-login/div/div/h1`)).getText()
    }
    getUsername() {
        return element(by.xpath(`//*[@id="div-main-layout"]/app-login/div/div/div[1]/input`))
    }
    getPassword() {
        return element(by.xpath(`//*[@id="div-main-layout"]/app-login/div/div/div[2]/input`))
    }
    getButtonLogIn() {
        return element(by.xpath(`//*[@id="div-main-layout"]/app-login/div/div/button`))
    }
    getMessage() {
        return element(by.xpath(`//*[@id="cdk-overlay-0"]/nb-toastr-container/nb-toast/div[2]/div`))
    }
}

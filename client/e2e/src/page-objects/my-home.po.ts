import { browser, by, element } from 'protractor'

export class MyHomePage {
    constructor() {}

    getWelcomeMessage() {
        return element(by.xpath(`//*[@id="div-main-layout"]/app-dashboard/div/div[1]/app-home/div/div[1]/h4`))
    }

    getButtonLogOut() {
        return element(by.xpath(`//*[@id="div-main-layout"]/app-dashboard/div/div[2]/app-menu/nb-card/nb-menu/ul/li[5]/a/span`))
    }
}

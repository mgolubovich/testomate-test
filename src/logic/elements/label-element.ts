import webdriver, { By, WebElement } from "selenium-webdriver";
import { Browser } from "../../infra/driver-wrapper/browser";
import { ElementBase } from "../../infra/pages-infra/element-base";

class LabelElement extends ElementBase {

    constructor(seleniumElement: WebElement) {
        super(seleniumElement);
    }

    async text(): Promise<string> {
        return this.element.getText();
    }

    async waitUntilElementVisible(browser: Browser, timeout = 10000) {
        await (await browser.getDriver()).wait(webdriver.until.elementIsVisible(this.element), timeout);
    }
}

export { LabelElement }
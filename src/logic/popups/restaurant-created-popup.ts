import webdriver, { By } from 'selenium-webdriver';
import { Browser } from "../../infra/driver-wrapper/browser";
import { PageBase } from "../../infra/pages-infra/page-base";
import { ClickableElement } from "../elements/clickable-element";
import { LabelElement } from "../elements/label-element";

let okButtonElement: ClickableElement;

class RestaurantCreatedPopup extends PageBase {

    constructor(browser: Browser) {
        super(browser);
    }

    async init() {
        okButtonElement = await this.browser.findElement(ClickableElement, By.xpath("//button[text()='OK']"));
    }

    async clickOkButton() {
        await okButtonElement.waitUntilElementVisible(this.browser)
        await okButtonElement.click()
    }
}

export { RestaurantCreatedPopup }
import { By } from "selenium-webdriver";
import { ClickableElement } from "../elements/clickable-element";
import { Browser } from "../../infra/driver-wrapper/browser";
import { CreateNewRestaurantPopUp } from "../popups/create-new-restaurant-popup";
import { RestaurantCreatedPopup } from "../popups/restaurant-created-popup";
import { extend } from "lodash";
import { PageBase } from "../../infra/pages-infra/page-base";
import { LabelElement } from "../elements/label-element";
import { Restaurant } from "../REST/API-Response/get-restaurants-response";

class RestaurantPage extends PageBase {

    private createNewRestaurantButtonLocator = "//button[text()='Create new']";
    private titleLocator = "//div[not(@id)]/h2";
    private deleteButtonsLocator = "//table/tbody/tr/td/following-sibling::td/button[text()='X'][last()]";

    constructor(browser: Browser) {
        super(browser);
    }

    private deleteRestaurantButtonByIdLocator(id: string) {
        return `//table/tbody/tr/td[text()='${id}']/following-sibling::td/button[text()='X']`;
    }

    async getTitle() {
        const titleElement = await this.browser.findElement(LabelElement, By.xpath(this.titleLocator));
        return titleElement.text();
    }

    async openCreateRestaurantPopup() {
        const button = await this.browser.findElement(ClickableElement, By.xpath(this.createNewRestaurantButtonLocator));
        button.click();
        return new CreateNewRestaurantPopUp(this.browser);
    }

    async createRestaurant(restaurant: Restaurant) {
        const restaurantCountBefore = (await this.getRestaurants()).length
        const createRestaurantPopup = await this.openCreateRestaurantPopup();
        await createRestaurantPopup.init();
        await createRestaurantPopup.fillNewRestaurantData(restaurant);
        await createRestaurantPopup.clickSubmitButton();
        const restaurantCreatedPopup = new RestaurantCreatedPopup(this.browser);
        await restaurantCreatedPopup.init();
        await restaurantCreatedPopup.clickOkButton();
        const addedRow = (await this.browser.findElement(LabelElement, By.xpath(`//tbody/tr[${restaurantCountBefore + 1}]`)))
        await addedRow.waitUntilElementVisible(this.browser)
    }

    async deleteRestaurant(id: string) {
        const button = await this.browser.findElement(ClickableElement, By.xpath(this.deleteRestaurantButtonByIdLocator(id)));
        await button.click();
    }

    async getRestaurants() {
        const restaurants: Restaurant[] = [];
        const someDeleteButton = await this.browser.findElement(ClickableElement, By.xpath(this.deleteButtonsLocator));
        await someDeleteButton.waitUntilElementVisible(this.browser);
        const rows = await (await this.browser.getDriver()).findElements(By.xpath("//tbody/tr"))
        for (const tr of rows) {
            const id = await tr.findElement(By.xpath("./td[2]")).getText();
            const name = await tr.findElement(By.xpath("./td[3]")).getText();
            const address = await tr.findElement(By.xpath("./td[4]")).getText();
            const score = await tr.findElement(By.xpath("./td[5]")).getText();
            const restaurant = { id: +id, name: name, address: address, score: +score };
            restaurants.push(restaurant);
        }
        return restaurants
    }
}

export { RestaurantPage }
import { By } from "selenium-webdriver";
import { Browser } from "../../infra/driver-wrapper/browser";
import { PageBase } from "../../infra/pages-infra/page-base";
import { ClickableElement } from "../elements/clickable-element";
import { InputElement } from "../elements/input-element";
import { LabelElement } from "../elements/label-element";
import { Restaurant } from "../REST/API-Response/get-restaurants-response";


let idInputElement: InputElement;
let nameInputElement: InputElement;
let addressInputElement: InputElement;
let submitButtonElement: ClickableElement;
let scoreInputElement: InputElement;

class CreateNewRestaurantPopUp extends PageBase {

    constructor(browser: Browser) {
        super(browser);
    }

    async init() {
        submitButtonElement = await this.browser.findElement(ClickableElement, By.xpath("//button[text()='Submit']"));
        nameInputElement = await this.browser.findElement(InputElement, By.xpath("//label[text()='Name']/../input"));
        addressInputElement = await this.browser.findElement(InputElement, By.xpath("//label[text()='Address']/../input"));
        scoreInputElement = await this.browser.findElement(InputElement, By.xpath("//label[text()='Score']/../input"));
        idInputElement = await this.browser.findElement(InputElement, By.xpath("//label[text()='Id']/../input"));
    }

    async getTitle() {
        const titleElement = await this.browser.findElement(LabelElement, By.xpath("//div[@id='create-new-popup']/h2"));
        return titleElement.text();
    }

    async fillNewRestaurantData(restaurant: Restaurant) {
        await nameInputElement.clearSetText(restaurant.name);
        await addressInputElement.clearSetText(restaurant.address);
        await scoreInputElement.clearSetText(`${restaurant.score}`);
        await idInputElement.clearSetText(`${restaurant.id}`);
    }

    async clickSubmitButton() {
        await submitButtonElement.click();
    }
}

export { CreateNewRestaurantPopUp }
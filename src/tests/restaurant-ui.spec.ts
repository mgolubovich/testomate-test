import { expect } from 'chai';
import { Browser } from '../infra/driver-wrapper/browser';
import { By } from 'selenium-webdriver';
import { RestaurantPage } from '../logic/pages/restaurant-page';
import restarauntsApi from '../logic/REST/restaurants-api'
import { CreateNewRestaurantPopUp } from '../logic/popups/create-new-restaurant-popup';
import { PageBase } from '../infra/pages-infra/page-base';
import jsonConfig from '../../config.json';
import { ApiResponse } from '../infra/rest/api-response';
import restaurantsAPI from '../logic/REST/restaurants-api'
import { Restaurant } from '../logic/REST/API-Response/get-restaurants-response';
import { Logger } from 'selenium-webdriver/lib/logging';


describe('UI tests', () => {
    let browser: Browser;

    before('Start webdriver', async function () {
        browser = new Browser();
    })

    beforeEach('Reset server, navigate to the base UI url', async function () {
        await restarauntsApi.resetServer();
        await browser.navigateToUrl(jsonConfig.baseUiUrl);
    })

    after('Close browser', async function () {
        await browser.close();
    })

    it('Validate "Create new Restaurant Popup" opened', async function () {
        // Arrange
        const page = new RestaurantPage(browser);

        // Act
        const popup = await page.openCreateRestaurantPopup();
        await popup.init();
        const actualTitle = await popup.getTitle();
        const expectedTitle = "Create new restaurant";

        // Assert
        expect(actualTitle).to.equal(expectedTitle, 'Restaurants popup was not opened');
    })

    it('Create new Restaurant using UI verify using UI', async function () {
        // Arrange
        const page = new RestaurantPage(browser);
        const myNewRest = { address: "My Addess 1", id: 233, name: "My Restaurant", score: 2.3 };

        // Act
        await page.createRestaurant(myNewRest);
        const restaurants = await page.getRestaurants();

        // Assert
        expect(restaurants).to.deep.include.members([myNewRest]);
    })

    it('Create new Restaurant using UI verify using API', async function () {
        // Arrange
        const page = new RestaurantPage(browser);
        const myNewRest = { address: "Kochva st 10", id: 1233, name: "New Restaurant", score: 4.3 };

        // Act
        await page.createRestaurant(myNewRest);
        const getByIdResponse: ApiResponse<Restaurant> = await restaurantsAPI.getRestaurantById(myNewRest.id);

        // Assert
        expect(myNewRest).to.deep.equal(getByIdResponse.data);
        expect(getByIdResponse.status).to.equal(200);
        expect(getByIdResponse.success).to.be.true;
    })

    it('Create new Restaurant using API verify using UI', async function () {
        // Arrange
        const myNewRest = { address: "My street 1", id: 2313, name: "My Restaurant", score: 4 };
        const page = new RestaurantPage(browser);

        //Act
        const createResponse = await restaurantsAPI.createRestaurant(myNewRest);
        const restaurants = await page.getRestaurants();

        //Assert
        expect(createResponse.status).to.equal(201);
        expect(createResponse.success).to.be.true;
        expect(restaurants).to.deep.include.members([myNewRest]);
    })
})



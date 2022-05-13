import { ApiResponse } from '../infra/rest/api-response';
import { Restaurant } from '../logic/REST/API-Response/get-restaurants-response';
import { expect } from 'chai';
import restaurantsAPI from '../logic/REST/restaurants-api';


describe('Restaurants tests', () => {

    beforeEach('Reset restaurant server', async () => {
        //Arrange
        await restaurantsAPI.resetServer();
    })

    it('Validate the amount of restaurants', async () => {
        //Act
        const restaurants: ApiResponse<Restaurant[]> = await restaurantsAPI.getRestaurants();

        //Assert
        expect(restaurants.success).to.be.true;
        const actualAmount = restaurants.data?.length;
        expect(actualAmount).to.equal(3, 'Restaurants amount is not as expected');
    })

    it('Get restaurant by id', async () => {
        //Arrange
        const exisingRestaurantData = { address: "2nd Streed 2", id: 21, name: "2nd Street Pub", score: 3.2 };

        //Act
        const getByIdResponse = await restaurantsAPI.getRestaurantById(21);

        //Assert
        expect(getByIdResponse.status).to.equal(200);
        expect(getByIdResponse.success).to.be.true;
        expect(getByIdResponse.data).to.deep.equal(exisingRestaurantData);
    })

    it('Create new restaurant', async () => {
        //Arrange
        const myNewRest = { address: "My Addess 1", id: 233, name: "My Restaurant", score: 2.3 };

        //Act
        const createResponse = await restaurantsAPI.createRestaurant(myNewRest);
        const getByIdResponse = await restaurantsAPI.getRestaurantById(233);

        //Assert
        expect(createResponse.status).to.equal(201);
        expect(createResponse.success).to.be.true;

        expect(getByIdResponse.status).to.equal(200);
        expect(getByIdResponse.success).to.be.true;

        expect(getByIdResponse.data).to.deep.equal(myNewRest);
    })

    it('Get non exsisting restaurant', async () => {
        //Act
        const getByIdResponse = await restaurantsAPI.getRestaurantById(404);

        //Assert
        expect(getByIdResponse.error).to.equal("restaurant with given id not found");
        expect(getByIdResponse.success).to.be.false;
        expect(getByIdResponse.status).to.equal(404);
    })

    it('Delete existing restaurant by id', async () => {
        //Arrange
        const deletedRestaurantId = 59

        //Act
        const deleteResponse = await restaurantsAPI.deleteRestaurantById(deletedRestaurantId);
        const getByIdResponse = await restaurantsAPI.getRestaurantById(deletedRestaurantId);

        //Assert
        expect(deleteResponse.status).to.equal(200);
        expect(deleteResponse.success).to.be.true;
        expect(getByIdResponse.status).to.equal(404);
    })

    it('Delete newly created restaurant by id', async () => {
        //Arrange
        const newRestaurantToDelete = { address: "Address", id: 1000, name: "Kenny", score: 1.1 };
        const createResponse = await restaurantsAPI.createRestaurant(newRestaurantToDelete);

        //Act
        const deleteResponse = await restaurantsAPI.deleteRestaurantById(newRestaurantToDelete.id);
        const getByIdResponse = await restaurantsAPI.getRestaurantById(newRestaurantToDelete.id);

        //Assert
        expect(deleteResponse.status).to.equal(200);
        expect(deleteResponse.success).to.be.true;
        expect(getByIdResponse.status).to.equal(404);
    })

    it('Update restaurant', async () => {
        //Arrange
        const restaurantNewData = { address: "new address", id: 21, name: "New Name", score: 5.0 }

        //Act
        const patchResponse = await restaurantsAPI.updateRestaurantById(restaurantNewData.id, restaurantNewData)
        const getByIdResponse = await restaurantsAPI.getRestaurantById(restaurantNewData.id);

        //Assert
        expect(patchResponse.status).to.equal(200);
        expect(patchResponse.success).to.be.true;
        expect(getByIdResponse.status).to.equal(200);
        expect(getByIdResponse.success).to.be.true;
        expect(getByIdResponse.data).to.deep.equal(restaurantNewData);
    })

    it('Create restaurant with duplicate id', async () => {
        //Arrange
        const exisingRestaurant = { address: "2nd Streed 2", id: 21, name: "2nd Street Pub", score: 3.2 };

        //Act 
        const createResponse = await restaurantsAPI.createRestaurant(exisingRestaurant);

        //Assert
        expect(createResponse.status).to.equal(409);
        expect(createResponse.success).to.be.false;
    })

    it('Create restaurant with string id', async () => {
        //Arrange
        const restaurantWithStringId = { address: "My Addess 1", id: "text", name: "My Restaurant", score: 2.3 };

        //Act
        const createResponse = await restaurantsAPI.createRestaurantWithArbitraryBody(restaurantWithStringId);

        //Assert
        expect(createResponse.status).to.equal(400);
        expect(createResponse.success).to.be.false;
    })

    it('Create restaurant with string score', async () => {
        //Arrange
        const restaurantWithStringScore = { address: "My Addess 1", id: "text", name: "My Restaurant", score: "2.3" };

        //Act
        const createResponse = await restaurantsAPI.createRestaurantWithArbitraryBody(restaurantWithStringScore);

        //Assert
        expect(createResponse.status).to.equal(400);
        expect(createResponse.success).to.be.false;
    })
})
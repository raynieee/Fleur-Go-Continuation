import prismadb from "../lib/prismadb";
import supertest from "supertest";
import express from "express";
import { addBouquet, getAllBouquetsWithShopNames, getBouquetsByShopId, updateBouquet, deleteBouquet } from "../routes/manageBouquet"; // Adjust the path as necessary

// Initialize the Express app
const app = express();
addBouquet(app);
getAllBouquetsWithShopNames(app);
getBouquetsByShopId(app);
updateBouquet(app);
deleteBouquet(app);

describe("Bouquet Management", () => {
  let shopId: number | undefined;
  let bouquetId: number | undefined;

  beforeEach(async () => {
    // Setup: Create a shop and a bouquet for testing
    await prismadb.shops.create({
      data: {
        name: "Test Shop",
        userId: "yourUserIdHere", // Make sure to replace with actual user ID
        phoneNumber: "12345678901",
        address: "123 Test St",
        businessPermitUrl: "http://example.com/business-permit.jpg",
      },
    });    

    const bouquetResult = await prismadb.bouquets.create({
      data: {
        name: "Test Bouquet",
        description: "A beautiful bouquet",
        bouquetImgUrl: "http://example.com/test-bouquet.jpg",
        price: 50.00,
        quantity: 10,
        isMadeToOrder: false,
        shop: {
          connect: { id: shopId },
        },
      },
    });
    bouquetId = bouquetResult.id;
  });

  afterEach(async () => {
    // Teardown: Delete the shop and bouquet created during the test
    if (shopId) {
      await prismadb.shops.delete({ where: { id: shopId } });
    }
    if (bouquetId) {
      await prismadb.bouquets.delete({ where: { id: bouquetId } });
    }
  });

  describe("Add Bouquet", () => {
    it("should add a new bouquet and return its details", async () => {
      const response = await supertest(app)
     .post(`/bouquets/:shopId`)
     .send({
          name: "New Test Bouquet",
          description: "Another beautiful bouquet",
          bouquetImgUrl: "http://example.com/new-test-bouquet.jpg",
          price: 60.00,
          quantity: 15,
          isMadeToOrder: true,
        });

      expect(response.status).toBe(200);
      expect(response.body.bouquet.name).toBe("New Test Bouquet");
      expect(response.body.bouquet.description).toBe("Another beautiful bouquet");
      expect(response.body.bouquet.price).toBe(60.00);
      expect(response.body.bouquet.quantity).toBe(15);
      expect(response.body.bouquet.isMadeToOrder).toBe(true);
    });
  });

  describe("Get All Bouquets With Shop Names", () => {
    it("should return all bouquets along with their shop names", async () => {
      const response = await supertest(app).get("/bouquets");

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1); // Expecting one bouquet from setup
      expect(response.body[0].shopName).toBe("Test Shop");
    });
  });

  describe("Get Bouquets By Shop ID", () => {
    it("should return bouquets belonging to a specific shop", async () => {
      const response = await supertest(app).get(`/shops/:shopId/bouquets`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1); // Expecting one bouquet from setup
      expect(response.body[0].name).toBe("Test Bouquet");
    });
  });

  describe("Update Bouquet", () => {
    it("should update a bouquet's details and return the updated bouquet", async () => {
      const updatedDetails = {
        name: "Updated Test Bouquet",
        description: "An even more beautiful bouquet",
        bouquetImgUrl: "http://example.com/updated-test-bouquet.jpg",
        price: 70.00,
        quantity: 20,
        isMadeToOrder: false,
      };

      const response = await supertest(app)
     .patch(`/bouquets/:shopId/:bouquetId`)
     .send(updatedDetails);

      expect(response.status).toBe(200);
      expect(response.body.bouquet.name).toBe(updatedDetails.name);
      expect(response.body.bouquet.description).toBe(updatedDetails.description);
      expect(response.body.bouquet.price).toBe(updatedDetails.price);
      expect(response.body.bouquet.quantity).toBe(updatedDetails.quantity);
      expect(response.body.bouquet.isMadeToOrder).toBe(updatedDetails.isMadeToOrder);
    });
  });

  describe("Delete Bouquet", () => {
    it("should delete a bouquet and return a success message", async () => {
      const response = await supertest(app).delete(`/bouquets/:shopId/:bouquetId`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Bouquet deleted successfully");
    });
  });
});

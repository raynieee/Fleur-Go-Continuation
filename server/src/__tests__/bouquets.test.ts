import prismadb from "../lib/prismadb";
import createServer from "../routes/server";
import supertest from "supertest";

const app = createServer();

describe("Bouquet API Testing", () => {
  afterEach(async () => {
    await prismadb.users.deleteMany();
  });

  describe("Add Bouquet", () => {
    it("adds a bouquet successfully", async () => {
      const response = await supertest(app)
        .post("/bouquets/1")
        .send({
          name: "Test Bouquet",
          description: "A test bouquet",
          bouquetImgUrl: "http://example.com/bouquet.jpg",
          price: 10.99,
          quantity: 5,
          isMadeToOrder: false,
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Bouquet added successfully");
      expect(response.body.bouquet).toHaveProperty("id");
    });

    it("returns an error if required fields are missing", async () => {
      const response = await supertest(app)
        .post("/bouquets/1")
        .send({
          name: "Test Bouquet",
          description: "A test bouquet",
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("All fields are required");
    });
  });

  describe("Get All Bouquets with Shop Names", () => {
    it("returns all bouquets with their shop names", async () => {
      const response = await supertest(app).get("/bouquets").send();

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      response.body.forEach((bouquet: any) => {
        expect(bouquet).toHaveProperty("shopName");
      });
    });
  });

  describe("Get Bouquets by Shop ID", () => {
    it("returns bouquets for a specific shop", async () => {
      const response = await supertest(app).get("/shops/1/bouquets").send();

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      response.body.forEach((bouquet: any) => {
        expect(bouquet.shopId).toBe(1);
      });
    });

    it("returns an error if shop ID is not provided", async () => {
      const response = await supertest(app).get("/shops//bouquets").send();

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Shop ID is required");
    });
  });

  describe("Update Bouquet", () => {
    it("updates a bouquet successfully", async () => {
      const response = await supertest(app)
        .patch("/bouquets/1/1")
        .send({
          name: "Updated Bouquet",
          description: "Updated description",
          bouquetImgUrl: "http://example.com/updated.jpg",
          price: 12.99,
          quantity: 10,
          isMadeToOrder: true,
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Bouquet updated successfully.");
      expect(response.body.bouquet.name).toBe("Updated Bouquet");
    });

    it("returns an error if required fields are missing", async () => {
      const response = await supertest(app)
        .patch("/bouquets/1/1")
        .send({
          name: "Updated Bouquet",
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("All fields are required");
    });
  });

  describe("Delete Bouquet", () => {
    it("deletes a bouquet successfully", async () => {
      const response = await supertest(app).delete("/bouquets/1/1").send();

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Bouquet deleted successfully");
    });

    it("returns an error if bouquet ID is not provided", async () => {
      const response = await supertest(app).delete("/bouquets/1/").send();

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Bouquet ID is required");
    });
  });
});

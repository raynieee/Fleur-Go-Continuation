import prismadb from "../lib/prismadb";
import createServer from "../routes/server";
import supertest from "supertest";
import { auth } from "@clerk/nextjs/server";

const app = createServer();

describe("Shop Management", () => {
  let userId: string;
  let shopId: number | undefined;

  beforeEach(async () => {
    const authData = await auth(); 
    if (!authData.userId) {
      throw new Error('Failed to authenticate');
    }
    userId = authData.userId;

    shopId = (await prismadb.shops.create({
      data: {
        userId,
        name: "Test Shop",
        phoneNumber: "12345678901",
        address: "123 Test St",
        businessPermitUrl: "http://example.com/business-permit.jpg",
      },
    })).id;    
  });

  afterEach(async () => {
    if (shopId) {
      await prismadb.shops.delete({ where: { id: shopId } });
    }
  });

  describe("Create Shop", () => {
    it("should create a new shop and return its details", async () => {
      const response = await supertest(app)
       .post("/admin/shops")
       .send({
          name: "New Test Shop",
          phoneNumber: "09876543210",
          address: "456 Test Ave",
          businessPermitUrl: "http://example.com/new-business-permit.jpg",
        })
       .set("Authorization", `Bearer ${userId}`);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe("New Test Shop");
    });
  });

  describe("Get User Shop Details", () => {
    it("should return the shop details for a given user ID", async () => {
      const response = await supertest(app)
       .get(`/admin/shops/${userId}`)
       .set("Authorization", `Bearer ${userId}`);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe("Test Shop");
    });
  });

  describe("Update Shop", () => {
    it("should update the shop's details and return the updated shop", async () => {
      const updatedDetails = {
        name: "Updated Test Shop",
        phoneNumber: "1122334455",
        address: "789 Test Blvd",
        businessPermitUrl: "http://example.com/updated-business-permit.jpg",
      };

      const response = await supertest(app)
       .patch(`/admin/shops/${shopId}`)
       .send(updatedDetails)
       .set("Authorization", `Bearer ${userId}`);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updatedDetails.name);
    });
  });

  describe("Delete Shop", () => {
    it("should delete a shop and return a success message", async () => {
      const response = await supertest(app)
       .delete(`/admin/shops/${shopId}`)
       .set("Authorization", `Bearer ${userId}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Shop deleted successfully");
    });
  });
});

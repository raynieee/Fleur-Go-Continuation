import prismadb from "../../lib/prismadb";
import createServer from "../../routes/server";
import supertest from "supertest";
import { Express, Request } from "express";
import { NextResponse } from "next/server";

const app = createServer();

export function getInventory(app: Express) {
  app.get("/inventory/:bouquetId", async (req: Request) => {
    try {
      const { bouquetId } = req.params;
      const bouquet = await prismadb.bouquets.findUnique({
        where: { id: Number(bouquetId) },
      });

      if (!bouquet) {
        return NextResponse.json({ message: "Bouquet not found" }, { status: 404 });
      }

      return NextResponse.json({ bouquetId: bouquet.id, quantity: bouquet.quantity }, { status: 200 });
    } catch (error) {
      console.log("GET_INVENTORY_ERROR", error);
      return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
  });
}

describe("Bouquet Inventory Management", () => {
  let testBouquetId: number;

  beforeAll(async () => {
    await prismadb.$connect();
  });

  afterAll(async () => {
    await prismadb.$disconnect();
  });

  beforeEach(async () => {
    // Create a test bouquet before each test
    const testBouquet = await prismadb.bouquets.create({
      data: {
        name: "Test Bouquet",
        description: "A bouquet for testing",
        bouquetImgUrl: "https://example.com/test-bouquet.jpg",
        price: 9.99,
        quantity: 10,
        isMadeToOrder: false,
        shopId: 1,
      },
    });
    testBouquetId = testBouquet.id;
  });

  afterEach(async () => {
    // Delete the test bouquet after each test
    await prismadb.$transaction(async (tx) => {
      await tx.bouquets.delete({
        where: {
          id: testBouquetId,
        },
      });
    });
  });

  describe("Get Bouquet Inventory", () => {
    it("should return the quantity of a bouquet", async () => {
      // Invocation
      const response = await supertest(app).get(`/api/inventory/${testBouquetId}`);

      // Assessment
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ bouquetId: testBouquetId, quantity: 10 });
    });

    it("should return 404 for non-existent bouquet", async () => {
      // Invocation
      const response = await supertest(app).get("/api/inventory/999"); // Non-existent bouquet ID

      // Assessment
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Bouquet not found");
    });

    it("should return 500 for unexpected errors", async () => {
      // Mock the prismadb.bouquets.findUnique function to throw an error
      jest.spyOn(prismadb.bouquets, "findUnique").mockImplementationOnce(() => {
        throw new Error("Unexpected error");
      });

      // Invocation
      const response = await supertest(app).get(`/api/inventory/${testBouquetId}`);

      // Assessment
      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Internal Error");
    });
  });

  describe("Update Bouquet Inventory", () => {
    it("should update the quantity of a bouquet", async () => {
      // Invocation
      const response = await supertest(app)
        .patch(`/api/inventory/${testBouquetId}`)
        .send({ quantity: 20 });

      // Assessment
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Inventory stock updated successfully");
      expect(response.body.updatedBouquet.quantity).toBe(20);
    });

    it("should return 404 for missing bouquet ID or quantity", async () => {
      // Invocation
      const response = await supertest(app).patch("/api/inventory/999").send({ quantity: 20 }); // Non-existent bouquet ID

      // Assessment
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Bouquet ID and quantity are required");
    });

    it("should return 404 for non-existent bouquet", async () => {
      // Invocation
      const response = await supertest(app)
        .patch("/api/inventory/999") // Non-existent bouquet ID
        .send({ quantity: 20 });

      // Assessment
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Bouquet not found");
    });

    it("should return 500 for unexpected errors", async () => {
      // Mock the prismadb.bouquets.update function to throw an error
      jest.spyOn(prismadb.bouquets, "update").mockImplementationOnce(() => {
        throw new Error("Unexpected error");
      });

      // Invocation
      const response = await supertest(app)
        .patch(`/api/inventory/${testBouquetId}`)
        .send({ quantity: 20 });

      // Assessment
      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Internal Error");
    });
  });
});
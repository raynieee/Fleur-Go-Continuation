import prismadb from "../../lib/prismadb";
import createServer from "../../routes/server";
import supertest from "supertest";

const app = createServer();

describe("Browse and Search Products", () => {
  beforeEach(async () => {
    // Setup (seed products, categories, etc.)
  });

  afterEach(async () => {
    // Teardown (clear test data)
  });

  describe("Browse Products by Category", () => {
    it("should return a list of products in the specified category", async () => {
      // Invocation
      const response = await supertest(app)
        .get("/api/products/category/roses")
        .send();

      // Assessment
      expect(response.status).toBe(200);
      expect(response.body.products).toHaveLength(2); // Assuming 2 products in the "roses" category
      expect(response.body.products[0].category).toBe("roses");
    });
  });

  describe("Search Products", () => {
    it("should return search results based on keywords", async () => {
      // Invocation
      const response = await supertest(app)
        .get("/api/products/search?q=red%20rose")
        .send();

      // Assessment
      expect(response.status).toBe(200);
      expect(response.body.products).toHaveLength(3); // Assuming 3 products matching "red rose"
      expect(response.body.products[0].name).toContain("red rose");
    });
  });

});
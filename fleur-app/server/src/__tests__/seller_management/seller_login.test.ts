import prismadb from "../../lib/prismadb";
import createServer from "../../routes/server";
import supertest from "supertest";

const app = createServer();

describe("Seller Login", () => {
  afterEach(async () => {
    // Teardown
    await prisma.sellers.deleteMany();
  });

  describe("Valid Seller Login", () => {
    it("authenticates and returns a token", async () => {
      // Setup
      const seller = await prisma.sellers.create({
        data: {
          name: "John Doe",
          email: "john.doe@example.com",
          password: "secure123",
          // Additional fields as needed
        },
      });

      // Invocation
      const response = await supertest(app)
        .post("/api/sellers/login")
        .send({
          email: "john.doe@example.com",
          password: "secure123",
        });

      // Assessment
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
    });
  });

  describe("Invalid Seller Login", () => {
    it("returns an error for invalid credentials", async () => {
      // Invocation
      const response = await supertest(app)
        .post("/api/sellers/login")
        .send({
          email: "invalid@example.com",
          password: "wrongpassword",
        });

      // Assessment
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Invalid credentials.");
    });

    // Additional test cases for other scenarios (e.g., inactive account, locked account)
  });
});
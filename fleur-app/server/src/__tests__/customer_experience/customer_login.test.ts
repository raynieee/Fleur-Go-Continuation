import prismadb from "../../lib/prismadb";
import createServer from "../../routes/server";
import supertest from "supertest";

const app = createServer();

describe("Customer Login", () => {
  afterEach(async () => {
    // Teardown
    await prisma.customers.deleteMany();
  });

  describe("Valid Customer Login", () => {
    it("should authenticate and return a token", async () => {
      // Setup
      const customer = await prisma.customers.create({
        data: {
          email: "john.doe@example.com",
          firstName: "John",
          lastName: "Doe",
          password: "secure123",
        },
      });

      // Invocation
      const response = await supertest(app)
        .post("/api/customers/login")
        .send({
          email: "john.doe@example.com",
          password: "secure123",
        });

      // Assessment
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
    });
  });

  describe("Invalid Customer Login", () => {
    it("should return an error for invalid credentials", async () => {
      // Invocation
      const response = await supertest(app)
        .post("/api/customers/login")
        .send({
          email: "invalid@example.com",
          password: "wrongpassword",
        });

      // Assessment
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Invalid credentials.");
    });

  });
});
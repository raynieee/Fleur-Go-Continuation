import prismadb from "../../lib/prismadb";
import createServer from "../../routes/server";
import supertest from "supertest";

const app = createServer();

describe("Customer Registration", () => {
  afterEach(async () => {
    // Teardown
    await prisma.customers.deleteMany();
  });

  describe("Valid Customer Registration", () => {
    it("should create a new customer account", async () => {
      // Invocation
      const response = await supertest(app)
        .post("/api/customers/register")
        .send({
          email: "john.doe@example.com",
          firstName: "John",
          lastName: "Doe",
          password: "secure123",
        });

      // Assessment
      expect(response.status).toBe(201);
      expect(response.body.customer).toEqual(
        expect.objectContaining({
          email: "john.doe@example.com",
          firstName: "John",
          lastName: "Doe",
        })
      );
    });
  });

  describe("Invalid Customer Registration", () => {
    it("should return an error for invalid email", async () => {
      // Invocation
      const response = await supertest(app)
        .post("/api/customers/register")
        .send({
          email: "invalid-email",
          firstName: "John",
          lastName: "Doe",
          password: "secure123",
        });

      // Assessment
      expect(response.status).toBe(422);
      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Invalid email address.");
    });

  });
});
import prismadb from "../../lib/prismadb";
import createServer from "../../routes/server";
import supertest from "supertest";

const app = createServer();

describe("Seller Registration", () => {
  afterEach(async () => {
    // Teardown
    await prisma.sellers.deleteMany();
  });

  describe("Valid Seller Registration", () => {
    it("creates a new seller account", async () => {
      // Invocation
      const response = await supertest(app)
        .post("/api/sellers/register")
        .send({
          name: "John Doe",
          email: "john.doe@example.com",
          password: "secure123",
          // Additional fields as needed
        });

      // Assessment
      expect(response.status).toBe(201);
      expect(response.body.seller).toEqual(
        expect.objectContaining({
          name: "John Doe",
          email: "john.doe@example.com",
          // Additional fields as needed
        })
      );
    });
  });

  describe("Invalid Seller Registration", () => {
    it("returns an error for invalid email", async () => {
      // Invocation
      const response = await supertest(app)
        .post("/api/sellers/register")
        .send({
          name: "John Doe",
          email: "invalid-email",
          password: "secure123",
          // Additional fields as needed
        });

      // Assessment
      expect(response.status).toBe(422);
      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Invalid email address.");
    });

    // Additional test cases for other validation scenarios
  });
});
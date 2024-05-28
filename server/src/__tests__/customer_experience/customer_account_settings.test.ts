import { prismadb } from "../../lib/prismadb";
import createServer from "../../routes/server";
import supertest from "supertest";

const app = createServer();

describe("Customer Account Settings and Profile Management", () => {
  let customer;
  let token;

  beforeEach(async () => {
    // Setup
    customer = await prismadb.users.create({
      data: {
        email: "john.doe@example.com",
        firstName: "John",
        lastName: "Doe",
        password: "secure123",
        // Additional fields as needed
      },
    });

    // Generate a token for authenticated requests
    token = "your_token_generation_logic";
  });

  afterEach(async () => {
    // Teardown
    await prismadb.users.deleteMany();
  });

  describe("Update Customer Profile", () => {
    it("should update the customer's profile information", async () => {
      // Invocation
      const response = await supertest(app)
        .put(`/api/customers/${customer.id}/profile`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          firstName: "Updated First Name",
        });

      // Assessment
      expect(response.status).toBe(200);
      expect(response.body.customer.firstName).toBe("Updated First Name");
    });
  });

  describe("Change Customer Password", () => {
    it("should change the customer's password", async () => {
      // Invocation
      const response = await supertest(app)
        .put(`/api/customers/${customer.id}/password`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          currentPassword: "secure123",
          newPassword: "newpassword123",
        });

      // Assessment
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

});
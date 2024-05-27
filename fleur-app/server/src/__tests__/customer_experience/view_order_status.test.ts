import prismadb from "../../lib/prismadb";
import createServer from "../../routes/server";
import supertest from "supertest";

const app = createServer();

describe("View Order Status", () => {
  let customer;
  let token;

  beforeEach(async () => {
    // Setup
    customer = await prisma.customers.create({
      data: {
        email: "jane.doe@example.com",
        firstName: "Jane",
        lastName: "Doe",
        password: "secure456",
        // Additional fields as needed
      },
    });

    // Generate a token for authenticated requests
    token = "your_token_generation_logic"; // Replace with actual token generation logic
  });

  afterEach(async () => {
    // Teardown
    await prisma.customers.deleteMany();
    await prisma.orders.deleteMany();
  });

  describe("Get Order History", () => {
    it("should return a list of the customer's past orders", async () => {
      // Invocation
      const response = await supertest(app)
       .get("/api/orders/history")
       .set("Authorization", `Bearer ${token}`)
       .send();

      // Assessment
      expect(response.status).toBe(200);
      expect(response.body.orders).toHaveLength(2); // Adjust based on your setup
      expect(response.body.orders[0].status).toBe("delivered"); // Example assertion
      // Add more assertions as needed
    });
  });

  describe("Get Order Details", () => {
    it("should return detailed information about a specific order", async () => {
      // Setup
      const order = await prisma.orders.findFirst({
        where: {
          customerId: customer.id,
          status: "delivered",
        },
      });

      // Invocation
      const response = await supertest(app)
       .get(`/api/orders/${order.id}`)
       .set("Authorization", `Bearer ${token}`)
       .send();

      // Assessment
      expect(response.status).toBe(200);
      expect(response.body.order.id).toBe(order.id);
      expect(response.body.order.status).toBe("delivered");
      expect(response.body.order.items).toHaveLength(2); // Adjust based on your setup
      expect(response.body.order.items[0].productId).toBe(1); // Example assertion
      // Add more assertions as needed
    });
  });
});

import prismadb from "../../lib/prismadb";
import createServer from "../../routes/server";
import supertest from "supertest";

const app = createServer();

describe("Make Payments", () => {
  let customer;
  let token;

  beforeEach(async () => {
    // Setup
    customer = await prisma.customers.create({
      data: {
        email: "customer@example.com",
        firstName: "Customer",
        lastName: "Name",
        password: "password123",
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

  it("should process a credit card payment and confirm the order", async () => {
    // Invocation
    const response = await supertest(app)
     .post("/api/orders/payments")
     .set("Authorization", `Bearer ${token}`)
     .send({
        paymentMethod: "card",
        cardNumber: "4111111111111111",
        expiryDate: "12/25",
        cvv: "123",
      });

    // Assessment
    expect(response.status).toBe(200);
    expect(response.body.order.paymentMethod).toBe("card");
    expect(response.body.order.status).toBe("confirmed");
  });
});
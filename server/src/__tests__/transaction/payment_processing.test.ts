import prismadb from "../../lib/prismadb";
import createServer from "../../routes/server";
import supertest from "supertest";

const app = createServer();

describe("Payment Processing", () => {
  afterEach(async () => {
    // Teardown
    await prisma.orders.deleteMany();
  });

  describe("Cash on Delivery", () => {
    it("should create an order with cash on delivery payment method", async () => {
      // Invocation
      const cashOrder = await supertest(app)
        .post("/api/orders")
        .send({
          paymentMethod: "cash",
          items: [
            { productId: 1, quantity: 2 },
            { productId: 2, quantity: 1 },
          ],
          // Additional order details
        });

      // Assessment
      expect(cashOrder.status).toBe(201);
      expect(cashOrder.body.order.paymentMethod).toBe("cash");
      expect(cashOrder.body.order.status).toBe("pending");
    });
  });

  describe("Credit/Debit Card Payment", () => {
    it("should process a credit card payment and create an order", async () => {
      // Invocation
      const cardOrder = await supertest(app)
        .post("/api/orders/payments")
        .send({
          paymentMethod: "card",
          cardNumber: "4111111111111111",
          expiryDate: "12/25",
          cvv: "123",
          items: [
            { productId: 1, quantity: 1 },
            { productId: 3, quantity: 2 },
          ],
          // Additional order details
        });

      // Assessment
      expect(cardOrder.status).toBe(201);
      expect(cardOrder.body.order.paymentMethod).toBe("card");
      expect(cardOrder.body.order.status).toBe("processing");
    });
  });

  // Additional test cases for other payment methods (e.g., e-wallets)
});
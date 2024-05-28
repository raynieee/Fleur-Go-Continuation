import { Express, Request, Response } from "express";
import prismadb from "../lib/prismadb";

export function createTransaction(app: Express) {
  app.post("/transactions", async (req: Request, res: Response) => {
    try {
      const { userId, amount, status, shopId, cartItemId } = req.body;

      if (!userId || !amount || !status || !shopId || !cartItemId) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const cartItem = await prismadb.cartItems.findUnique({
        where: { id: Number(cartItemId) },
        include: { bouquet: true } //cartItems relating to bouquets
      });

      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }

      const newQuantity = cartItem.bouquet.quantity - cartItem.quantity;

      if (newQuantity < 0) {
        return res.status(400).json({ message: "Insufficient quantity available" });
      }

      await prismadb.bouquets.update({
        where: { id: cartItem.bouquet.id },
        data: { quantity: newQuantity }
      });

      const transaction = await prismadb.transactions.create({
        data: {
          userId,
          amount,
          status: "pending",
          shopId: Number(shopId),
          cartItemId: Number(cartItemId),
        },
      });

      return res.status(201).json(transaction);
    } catch (error) {
      console.error("CREATE_TRANSACTION_ERROR", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });
}

export function getAllTransactions(app: Express) {
  app.get("/transactions", async (req: Request, res: Response) => {
    try {
      const transactions = await prismadb.transactions.findMany();
      return res.status(200).json(transactions);
    } catch (error) {
      console.error("GET_ALL_TRANSACTIONS_ERROR", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });
}

export function updateTransactionStatus(app: Express) {
  app.put("/transactions/:id/status", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    try {
      const transaction = await prismadb.transactions.update({
        where: { id: Number(id) },
        data: { status },
      });

      return res.status(200).json(transaction);
    } catch (error) {
      console.error("UPDATE_TRANSACTION_STATUS_ERROR", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });
}

export function deleteTransactionById(app: Express) {
  app.delete("/transactions/:transactionId", async (req: Request, res: Response) => {
    try {
      const { transactionId } = req.params;

      if (!transactionId) {
        return res.status(400).json({ message: "Transaction ID is required" });
      }

      const transaction = await prismadb.transactions.delete({
        where: { id: Number(transactionId) },
      });

      return res.status(200).json(transaction);
    } catch (error) {
      console.error("DELETE_TRANSACTION_BY_ID_ERROR", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });
}

export function getTransactionsByUserId(app: Express) {
  app.get("/transactions/user/:userId", async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      const transactions = await prismadb.transactions.findMany({
        where: { userId },
      });

      return res.status(200).json(transactions);
    } catch (error) {
      console.error("GET_TRANSACTIONS_BY_USER_ID_ERROR", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });
}

export function getTransactionsByShopId(app: Express) {
  app.get("/transactions/shop/:shopId", async (req: Request, res: Response) => {
    try {
      const { shopId } = req.params;

      const transactions = await prismadb.transactions.findMany({
        where: { shopId: Number(shopId) },
      });

      return res.status(200).json(transactions);
    } catch (error) {
      console.error("GET_TRANSACTIONS_BY_SHOP_ID_ERROR", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });
}

export function getTransactionByIdUnderUserId(app: Express) {
  app.get("/transactions/user/:userId/:transactionId", async (req: Request, res: Response) => {
    try {
      const { userId, transactionId } = req.params;

      const transaction = await prismadb.transactions.findFirst({
        where: {
          id: Number(transactionId),
          userId,
        },
      });

      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }

      return res.status(200).json(transaction);
    } catch (error) {
      console.error("GET_TRANSACTION_BY_ID_UNDER_USER_ID_ERROR", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });
}

export function getTransactionByIdUnderShopId(app: Express) {
  app.get("/transactions/shop/:shopId/:transactionId", async (req: Request, res: Response) => {
    try {
      const { shopId, transactionId } = req.params;

      const transaction = await prismadb.transactions.findFirst({
        where: {
          id: Number(transactionId),
          shopId: Number(shopId),
        },
      });

      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }

      return res.status(200).json(transaction);
    } catch (error) {
      console.error("GET_TRANSACTION_BY_ID_UNDER_SHOP_ID_ERROR", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });
}

export function getTransactionsByUserIdAndStatus(app: Express) {
  app.get("/transactions/user/:userId/status/:status", async (req: Request, res: Response) => {
    try {
      const { userId, status } = req.params;

      const transactions = await prismadb.transactions.findMany({
        where: {
          userId,
          status,
        },
      });

      return res.status(200).json(transactions);
    } catch (error) {
      console.error("GET_TRANSACTIONS_BY_USER_ID_AND_STATUS_ERROR", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });
}

export function getTransactionsByShopIdAndStatus(app: Express) {
  app.get("/transactions/shop/:shopId/status/:status", async (req: Request, res: Response) => {
    try {
      const { shopId, status } = req.params;

      const transactions = await prismadb.transactions.findMany({
        where: {
          shopId: Number(shopId),
          status,
        },
      });

      return res.status(200).json(transactions);
    } catch (error) {
      console.error("GET_TRANSACTIONS_BY_SHOP_ID_AND_STATUS_ERROR", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });
}
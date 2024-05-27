import { Express, Request } from "express";
import { NextResponse } from "next/server";
import prismadb from "../lib/prismadb";

export function createTransaction(app: Express) {
  app.post("/transactions", async (req: Request) => {
    try {
      const { userId, amount, status, shopId, cartItemId } = req.body;

      if (!userId || !amount || !status || !shopId || !cartItemId) {
        return NextResponse.json({ message: "All fields are required" }, { status: 400 });
      }

      const transaction = await prismadb.transactions.create({
        data: {
          userId,
          amount,
          status,
          shopId: Number(shopId),
          cartItemId: Number(cartItemId),
        },
      });

      return NextResponse.json(transaction, { status: 201 });
    } catch (error) {
      console.error("CREATE_TRANSACTION_ERROR", error);
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
  });
}

export function getAllTransactions(app: Express) {
  app.get("/transactions", async () => {
    try {
      const transactions = await prismadb.transactions.findMany();
      return NextResponse.json(transactions, { status: 200 });
    } catch (error) {
      console.error("GET_ALL_TRANSACTIONS_ERROR", error);
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
  });
}

export function getTransactionById(app: Express) {
  app.get("/transactions/:transactionId", async (req: Request) => {
    try {
      const { transactionId } = req.params;

      if (!transactionId) {
        return NextResponse.json({ message: "Transaction ID is required" }, { status: 400 });
      }

      const transaction = await prismadb.transactions.findUnique({
        where: { id: Number(transactionId) },
      });

      if (!transaction) {
        return NextResponse.json({ message: "Transaction not found" }, { status: 404 });
      }

      return NextResponse.json(transaction, { status: 200 });
    } catch (error) {
      console.error("GET_TRANSACTION_BY_ID_ERROR", error);
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
  });
}

export function deleteTransactionById(app: Express) {
  app.delete("/transactions/:transactionId", async (req: Request) => {
    try {
      const { transactionId } = req.params;

      if (!transactionId) {
        return NextResponse.json({ message: "Transaction ID is required" }, { status: 400 });
      }

      const transaction = await prismadb.transactions.delete({
        where: { id: Number(transactionId) },
      });

      return NextResponse.json(transaction, { status: 200 });
    } catch (error) {
      console.error("DELETE_TRANSACTION_BY_ID_ERROR", error);
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
  });
}

export function getTransactionsByUserId(app: Express) {
  app.get("/transactions/user/:userId", async (req: Request) => {
    try {
      const { userId } = req.params;

      const transactions = await prismadb.transactions.findMany({
        where: { userId },
      });

      return NextResponse.json(transactions, { status: 200 });
    } catch (error) {
      console.error("GET_TRANSACTIONS_BY_USER_ID_ERROR", error);
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
  });
}

export function getTransactionsByShopId(app: Express) {
  app.get("/transactions/shop/:shopId", async (req: Request) => {
    try {
      const { shopId } = req.params;

      const transactions = await prismadb.transactions.findMany({
        where: { shopId: Number(shopId) },
      });

      return NextResponse.json(transactions, { status: 200 });
    } catch (error) {
      console.error("GET_TRANSACTIONS_BY_SHOP_ID_ERROR", error);
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
  });
}

export function getTransactionByIdUnderUserId(app: Express) {
  app.get("/transactions/user/:userId/:transactionId", async (req: Request) => {
    try {
      const { userId, transactionId } = req.params;

      const transaction = await prismadb.transactions.findFirst({
        where: {
          id: Number(transactionId),
          userId,
        },
      });

      if (!transaction) {
        return NextResponse.json({ message: "Transaction not found" }, { status: 404 });
      }

      return NextResponse.json(transaction, { status: 200 });
    } catch (error) {
      console.error("GET_TRANSACTION_BY_ID_UNDER_USER_ID_ERROR", error);
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
  });
}

export function getTransactionByIdUnderShopId(app: Express) {
  app.get("/transactions/shop/:shopId/:transactionId", async (req: Request) => {
    try {
      const { shopId, transactionId } = req.params;

      const transaction = await prismadb.transactions.findFirst({
        where: {
          id: Number(transactionId),
          shopId: Number(shopId),
        },
      });

      if (!transaction) {
        return NextResponse.json({ message: "Transaction not found" }, { status: 404 });
      }

      return NextResponse.json(transaction, { status: 200 });
    } catch (error) {
      console.error("GET_TRANSACTION_BY_ID_UNDER_SHOP_ID_ERROR", error);
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
  });
}

export function getTransactionsByUserIdAndStatus(app: Express) {
  app.get("/transactions/user/:userId/status/:status", async (req: Request) => {
    try {
      const { userId, status } = req.params;

      const transactions = await prismadb.transactions.findMany({
        where: {
          userId,
          status,
        },
      });

      return NextResponse.json(transactions, { status: 200 });
    } catch (error) {
      console.error("GET_TRANSACTIONS_BY_USER_ID_AND_STATUS_ERROR", error);
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
  });
}

export function getTransactionsByShopIdAndStatus(app: Express) {
  app.get("/transactions/shop/:shopId/status/:status", async (req: Request) => {
    try {
      const { shopId, status } = req.params;

      const transactions = await prismadb.transactions.findMany({
        where: {
          shopId: Number(shopId),
          status,
        },
      });

      return NextResponse.json(transactions, { status: 200 });
    } catch (error) {
      console.error("GET_TRANSACTIONS_BY_SHOP_ID_AND_STATUS_ERROR", error);
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
  });
}
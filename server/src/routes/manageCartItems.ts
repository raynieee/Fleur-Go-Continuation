import { Express, Request, Response } from "express";
import prismadb from "../lib/prismadb";

export function addCartItem(app: Express) {
  app.post("/cartItems/:userId", async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const { bouquetId, quantity } = req.body;

      if (!userId || !bouquetId || !quantity) {
        return res.status(400).json({ message: "User ID, bouquet ID, and quantity are required" });
      }

      const bouquet = await prismadb.bouquets.findUnique({
        where: { id: bouquetId },
      });

      if (!bouquet) {
        return res.status(404).json({ message: "Item not found" });
      }

      const cartItem = await prismadb.cartItems.create({
        data: {
          userId: userId,
          bouquetId: bouquetId,
          quantity: quantity,
        },
      });

      return res.status(201).json({ message: "Bouquet added to cart", cartItem });
    } catch (error) {
      console.log("ADD_CART_ITEM_ERROR", error);
      return res.status(500).json({ message: "Internal Error" });
    }
  });
}

export function getCartItems(app: Express) {
  app.get("/cartItems/:userId", async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const cartItems = await prismadb.cartItems.findMany({
        where: { userId: userId },
        include: {
          bouquet: true, // for getting bouquet details
        },
      });

      if (cartItems.length === 0) {
        return res.status(404).json({ message: "No cart items found" });
      }

      return res.status(200).json(cartItems);
    } catch (error) {
      console.log("GET_CART_ITEMS_ERROR", error);
      return res.status(500).json({ message: "Internal Error" });
    }
  });
}

export function updateCartItemQuantity(app: Express) {
  app.patch("/cartItems/:userId/:itemId", async (req: Request, res: Response) => {
    try {
      const { itemId } = req.params;
      const { quantity } = req.body;

      if (!itemId || !quantity) {
        return res.status(400).json({ message: "Item ID and quantity are required" });
      }

      const cartItem = await prismadb.cartItems.findUnique({
        where: { id: Number(itemId) },
      });

      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }

      const updatedCartItem = await prismadb.cartItems.update({
        where: { id: Number(itemId) },
        data: { quantity: quantity },
      });

      return res.status(200).json({ message: "Cart item quantity updated successfully", updatedCartItem });
    } catch (error) {
      console.log("UPDATE_CART_ITEM_QUANTITY_ERROR", error);
      return res.status(500).json({ message: "Internal Error" });
    }
  });
}

export function removeCartItem(app: Express) {
  app.delete("/cartItems/:userId/:itemId", async (req: Request, res: Response) => {
    try {
      const { userId, itemId } = req.params;

      const cartItem = await prismadb.cartItems.findUnique({
        where: { id: Number(itemId), userId: userId },
      });

      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }

      const removedCartItem = await prismadb.cartItems.delete({
        where: { id: Number(itemId) },
      });

      return res.status(200).json({ message: "Item removed successfully", removedCartItem });
    } catch (error) {
      console.log("REMOVE_CART_ITEM_ERROR", error);
      return res.status(500).json({ message: "Internal Error" });
    }
  });
}
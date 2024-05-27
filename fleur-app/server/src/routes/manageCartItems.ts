import { Express, Request } from "express";
import { NextResponse } from "next/server";
import prismadb from "../lib/prismadb";

export function addCartItem(app: Express) {
  app.post("/cartItems/:userId", async (req: Request) => {
    try {
      const { userId } = req.params;
      const { bouquetId, quantity } = req.body;

      if (!userId || !bouquetId || !quantity) {
        return NextResponse.json({ message: "User ID, bouquet ID, and quantity are required" }, { status: 400 });
      }

      const bouquet = await prismadb.bouquets.findUnique({
        where: { id: bouquetId },
      });

      if (!bouquet) {
        return NextResponse.json({ message: "Item not found" }, { status: 404 });
      }

      const cartItem = await prismadb.cartItems.create({
        data: {
          userId: userId,
          bouquetId: bouquetId,
          quantity: quantity,
        },
      });

      return NextResponse.json({ message: "Bouquet added to cart", cartItem }, { status: 201 });
    } catch (error) {
      console.log("ADD_CART_ITEM_ERROR", error);
      return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
  });
}

export function getCartItems(app: Express) {
  app.get("/cartItems/:userId", async (req: Request) => {
    try {
      const { userId } = req.params;

      if (!userId) {
        return NextResponse.json(
          { message: "User ID is required" },
          { status: 400 }
        );
      }

      const cartItems = await prismadb.cartItems.findMany({
        where: { userId: userId },
        include: {
          bouquet: true, // for getting bouquet details
        },
      });

      if (cartItems.length === 0) {
        return NextResponse.json(
          { message: "No cart items found" },
          { status: 404 }
        );
      }

      return NextResponse.json(cartItems, { status: 200 });
    } catch (error) {
      console.log("GET_CART_ITEMS_ERROR", error);
      return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
  });
}

export function updateCartItemQuantity(app: Express) {
  app.patch("/cartItems/:userId/:itemId", async (req: Request) => {
    try {
      const { itemId } = req.params;
      const { quantity } = req.body;

      if (!itemId || !quantity) {
        return NextResponse.json(
          { message: "Item ID and quantity are required" },
          { status: 400 }
        );
      }

      const cartItem = await prismadb.cartItems.findUnique({
        where: { id: Number(itemId) },
      });

      if (!cartItem) {
        return NextResponse.json(
          { message: "Cart item not found" },
          { status: 404 }
        );
      }

      const updatedCartItem = await prismadb.cartItems.update({
        where: { id: Number(itemId) },
        data: { quantity: quantity },
      });

      return NextResponse.json(
        { message: "Cart item quantity updated successfully", updatedCartItem },
        { status: 200 }
      );
    } catch (error) {
      console.log("UPDATE_CART_ITEM_QUANTITY_ERROR", error);
      return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
  });
}

export function removeCartItem(app: Express) {
  app.delete("/cartItems/:userId/:itemId", async (req: Request) => {
    try {
      const { userId, itemId } = req.params;

      const cartItem = await prismadb.cartItems.findUnique({
        where: { id: Number(itemId), userId: userId },
      });

      if (!cartItem) {
        return NextResponse.json(
          { message: "Cart item not found" },
          { status: 404 }
        );
      }

      const removedCartItem = await prismadb.cartItems.delete({
        where: { id: Number(itemId) },
      });

      return NextResponse.json(
        { message: "Item removed successfully", removedCartItem },
        { status: 200 }
      );
    } catch (error) {
      console.log("REMOVE_CART_ITEM_ERROR", error);
      return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
  });
}

import { Express, Request, Response } from "express";
import prismadb from "../lib/prismadb";
import { auth } from "@clerk/nextjs/server";

export function createShop(app: Express) {
  app.post("/admin/shops", async (req: Request, res: Response) => {
    const authData = await auth();
    const userId = String(authData.userId);

    try {
      const { name, phoneNumber, address, businessPermitUrl } = req.body;

      if (!name || !phoneNumber || !address) {
        return res.status(400).json({ message: "Name, phone number, and address are required" });
      }

      if (phoneNumber.length < 11) {
        return res.status(400).json({ message: "Phone number must be at least 11 digits" });
      }

      const shop = await prismadb.shops.create({
        data: {
          userId,
          name,
          phoneNumber,
          address,
          businessPermitUrl
        }
      });

      return res.status(201).json(shop);
    } catch (error) {
      console.log("CREATE_SHOP_ERROR", error);
      return res.status(500).json({ message: "Internal Error" });
    }
  });
}

export function getShopDetails(app: Express) {
  app.get("/admin/shops/:shopId", async (req: Request, res: Response) => {
    try {
      const { shopId } = req.params;

      if (!shopId) {
        return res.status(400).json({ message: "Shop ID is required" });
      }

      const shop = await prismadb.shops.findUnique({
        where: { id: Number(shopId) },
      });

      if (!shop) {
        return res.status(404).json({ message: "Shop not found" });
      }

      return res.status(200).json(shop);
    } catch (error) {
      console.log("GET_SHOP_DETAILS_ERROR", error);
      return res.status(500).json({ message: "Internal Error" });
    }
  });
}

export function updateShop(app: Express) {
  app.patch("/admin/shops/:shopId", async (req: Request, res: Response) => {
    const authData = await auth();
    const userId = String(authData.userId);

    try {
      const { shopId } = req.params;
      const { name, phoneNumber, address, businessPermitUrl } = req.body;

      if (!shopId) {
        return res.status(400).json({ message: "Shop ID is required" });
      }

      const shop = await prismadb.shops.findUnique({
        where: { id: Number(shopId) },
      });

      if (!shop) {
        return res.status(404).json({ message: "Shop not found" });
      }

      if (shop.userId !== userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const updatedShop = await prismadb.shops.update({
        where: { id: Number(shopId) },
        data: {
          name,
          phoneNumber,
          address,
          businessPermitUrl
        },
      });

      return res.status(200).json(updatedShop);
    } catch (error) {
      console.log("UPDATE_SHOP_ERROR", error);
      return res.status(500).json({ message: "Internal Error" });
    }
  });
}

export function deleteShop(app: Express) {
  app.delete("/admin/shops/:shopId", async (req: Request, res: Response) => {
    const authData = await auth();
    const userId = String(authData.userId);

    try {
      const { shopId } = req.params;

      if (!shopId) {
        return res.status(400).json({ message: "Shop ID is required" });
      }

      const shop = await prismadb.shops.findUnique({
        where: { id: Number(shopId) },
      });

      if (!shop) {
        return res.status(404).json({ message: "Shop not found" });
      }

      if (shop.userId !== userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const deletedShop = await prismadb.shops.delete({
        where: { id: Number(shopId) },
      });

      return res.status(200).json({
        message: "Shop deleted successfully",
        deletedShop,
      });
    } catch (error) {
      console.log("DELETE_SHOP_ERROR", error);
      return res.status(500).json({ message: "Internal Error" });
    }
  });
}
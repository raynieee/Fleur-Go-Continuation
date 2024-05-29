import { Express, Request, Response } from "express";
import prismadb from "../lib/prismadb";

export function addBouquet(app: Express) {
  app.post("/bouquets/:shopId", async (req: Request, res: Response) => {
    try {
      const { shopId } = req.params;
      const shop = await prismadb.shops.findUnique({
        where: { id: Number(shopId) },
      });

      if (!shop) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const {
        name,
        description,
        bouquetImgUrl,
        price,
        quantity,
        isMadeToOrder,
      } = req.body;

      if (!name || !description || !price || !quantity || !isMadeToOrder) {
        return res.status(400).json({ message: "All fields are required" });
      }

      if (description.length > 255) {
        return res.status(400).json({ message: "Description must be less than 255 characters" });
      }

      if (typeof quantity !== "number" || quantity < 0 || isNaN(quantity)) {
        return res.status(400).json({ message: "Quantity must be a positive integer" });
      }

      if (typeof price !== "number" || price <= 0 || isNaN(price)) {
        return res.status(400).json({ message: "Price must be a positive number" });
      }

      const addBouquet = await prismadb.bouquets.create({
        data: {
          name,
          description,
          bouquetImgUrl,
          quantity,
          isMadeToOrder,
          price,
          shop: {
            connect: { id: Number(shopId) },
          },
        },
      });

      return res.status(200).json({ message: "Bouquet added successfully", bouquet: addBouquet });
    } catch (error) {
      console.log("ADD_BOUQUET_ERROR", error);
      return res.status(500).json({ message: "Internal Error" });
    }
  });
}

export function getAllBouquetsWithShopNames(app: Express) {
  app.get("/bouquets", async (req: Request, res: Response) => {
    try {
      const bouquets = await prismadb.bouquets.findMany({
        include: {
          shop: { 
            select: {
              name: true, //get name of shop
            },
          },
        },
      });

      const bouquetsWithShopNames = bouquets.map(bouquet => ({
        ...bouquet,
        shopName: bouquet.shop.name,
      }));

      return res.status(200).json(bouquetsWithShopNames);
    } catch (error) {
      console.log("GET_ALL_BOUQUETS_ERROR", error);
      return res.status(500).json({ message: "Internal Error" });
    }
  });
}

export function getBouquetsByShopId(app: Express) {
  app.get("/shops/:shopId/bouquets", async (req: Request, res: Response) => {
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

      const bouquets = await prismadb.bouquets.findMany({
        where: { shopId: Number(shopId) },
      });

      return res.status(200).json(bouquets);
    } catch (error) {
      console.log("GET_BOUQUETS_BY_SHOP_ERROR", error);
      return res.status(500).json({ message: "Internal Error" });
    }
  });
}

export function updateBouquet(app: Express) {
  app.patch("/bouquets/:shopId/:bouquetId", async (req: Request, res: Response) => {
    try {
      const { shopId, bouquetId } = req.params;

      const shop = await prismadb.shops.findUnique({
        where: { id: Number(shopId) },
      });

      if (!shop) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const {
        name,
        description,
        bouquetImgUrl,
        price,
        quantity,
        isMadeToOrder,
      } = req.body;

      if (!name || !description || !price || !quantity || !isMadeToOrder) {
        return res.status(400).json({ message: "All fields are required" });
      }

      if (description.length > 255) {
        return res.status(400).json({ message: "Description must be less than 255 characters" });
      }

      if (typeof quantity !== "number" || quantity < 0 || isNaN(quantity)) {
        return res.status(400).json({ message: "Quantity must be a positive integer" });
      }

      if (typeof price !== "number" || price <= 0 || isNaN(price)) {
        return res.status(400).json({ message: "Price must be a positive number" });
      }

      const updatedBouquet = await prismadb.bouquets.update({
        where: { id: Number(bouquetId) },
        data: {
          name,
          description,
          bouquetImgUrl,
          quantity,
          isMadeToOrder,
          price,
        },
      });

      return res.status(200).json({ message: "Bouquet updated successfully.", bouquet: updatedBouquet });
    } catch (error) {
      console.log("UPDATE_BOUQUET_ERROR", error);
      return res.status(500).json({ message: "Internal Error" });
    }
  });
}

export function deleteBouquet(app: Express) {
  app.delete("/bouquets/:shopId/:bouquetId", async (req: Request, res: Response) => {
    try {
      const { shopId, bouquetId } = req.params;

      if (!bouquetId) {
        return res.status(400).json({ message: "Bouquet ID is required" });
      }

      const bouquet = await prismadb.bouquets.findUnique({
        where: { id: Number(bouquetId), shopId: Number(shopId) },
      });

      if (!bouquet) {
        return res.status(404).json({ message: "Bouquet not found" });
      }

      const deletedBouquet = await prismadb.bouquets.delete({
        where: { id: Number(bouquetId) }, 
      });

      return res.status(200).json({ message: "Bouquet deleted successfully", bouquet: deletedBouquet });
    } catch (error) {
      console.log("DELETE_BOUQUET_ERROR", error);
      return res.status(500).json({ message: "Internal Error" });
    }
  });
}
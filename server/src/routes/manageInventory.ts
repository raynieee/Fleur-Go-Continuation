import { Express, Request, Response } from "express";
import prismadb from "../lib/prismadb";

export function getInventory(app: Express) {
  app.get("/inventory/:bouquetId", async (req: Request, res: Response) => {
    try {
      const { bouquetId } = req.params;

      const bouquet = await prismadb.bouquets.findUnique({
        where: { id: Number(bouquetId) },
      });

      if (!bouquet) {
        return res.status(404).json({ message: "Bouquet not found" });
      }

      return res.status(200).json({ bouquetId: bouquet.id, quantity: bouquet.quantity });
    } catch (error) {
      console.log("GET_INVENTORY_ERROR", error);
      return res.status(500).json({ message: "Internal Error" });
    }
  });
}

export function updateInventory(app: Express) {
  app.patch("/inventory/:bouquetId", async (req: Request, res: Response) => {
    try {
      const { bouquetId } = req.params;
      const { quantity } = req.body;

      if (!bouquetId || quantity === undefined) {
        return res.status(400).json({ message: "Bouquet ID and quantity are required" });
      }

      const bouquet = await prismadb.bouquets.findUnique({
        where: { id: Number(bouquetId) },
      });

      if (!bouquet) {
        return res.status(404).json({ message: "Bouquet not found" });
      }

      const updatedBouquet = await prismadb.bouquets.update({
        where: { id: Number(bouquetId) },
        data: { quantity: quantity },
      });

      return res.status(200).json({ message: "Inventory stock updated successfully", updatedBouquet });
    } catch (error) {
      console.log("UPDATE_INVENTORY_ERROR", error);
      return res.status(500).json({ message: "Internal Error" });
    }
  });
}
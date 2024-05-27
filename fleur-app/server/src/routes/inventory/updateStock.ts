import { Express, Request } from "express";
import { NextResponse } from "next/server";
import prismadb from "../../lib/prismadb";

export function updateInventory(app: Express) {
  app.patch("/inventory/:bouquetId", async (req: Request) => {
    try {
      const { bouquetId } = req.params;
      const { quantity } = req.body;

      if (!bouquetId || !quantity) {
        return NextResponse.json({ message: "Bouquet ID and quantity are required" }, { status: 400 });
      }

      const bouquet = await prismadb.bouquets.findUnique({
        where: { id: Number(bouquetId) },
      });

      if (!bouquet) {
        return NextResponse.json({ message: "Bouquet not found" }, { status: 404 });
      }

      const updatedBouquet = await prismadb.bouquets.update({
        where: { id: Number(bouquetId) },
        data: { quantity: quantity },
      });

      return NextResponse.json({ message: "Inventory stock updated successfully", updatedBouquet }, { status: 200 });
    } catch (error) {
      console.log("UPDATE_INVENTORY_ERROR", error);
      return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
  });
}

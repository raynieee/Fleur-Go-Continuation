import { Express, Request } from "express";
import { NextResponse } from "next/server";
import prismadb from "../../lib/prismadb";

export function getInventory(app: Express) {
  app.get("/inventory/:bouquetId", async (req: Request) => {
    try {
      const { bouquetId } = req.params;

      const bouquet = await prismadb.bouquets.findUnique({
        where: { id: Number(bouquetId) },
      });

      if (!bouquet) {
        return NextResponse.json({ message: "Bouquet not found" }, { status: 404 });
      }

      return NextResponse.json({ bouquetId: bouquet.id, quantity: bouquet.quantity }, { status: 200 });
    } catch (error) {
      console.log("GET_INVENTORY_ERROR", error);
      return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
  });
}
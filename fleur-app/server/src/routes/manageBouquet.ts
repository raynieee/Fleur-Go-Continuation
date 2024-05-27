import { Express, Request } from "express";
import { NextResponse } from "next/server";
import prismadb from "../lib/prismadb";

export function addBouquet(app: Express) {
  app.post("/bouquets/:shopId", async (req: Request) => {
    try {
      const { shopId } = req.params;
      const shop = await prismadb.shops.findUnique({
        where: { id: Number(shopId) },
      });

      if (!shop) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
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
        return NextResponse.json(
          { message: "All fields are required" },
          { status: 400 }
        );
      }

      if (description.length > 255) {
        return NextResponse.json(
          { message: "Description must be less than 255 characters" },
          { status: 400 }
        );
      }

      if (typeof quantity !== "number" || quantity < 0 || isNaN(quantity)) {
        return NextResponse.json(
          { message: "Quantity must be a positive integer" },
          { status: 400 }
        );
      }

      if (typeof price !== "number" || price <= 0 || isNaN(price)) {
        return NextResponse.json(
          { message: "Price must be a positive number" },
          { status: 400 }
        );
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

      return NextResponse.json(
        { message: "Bouquet added successfully", bouquet: addBouquet },
        { status: 200 }
      );
    } catch (error) {
      console.log("ADD_BOUQUET_ERROR", error);
      return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
  });
}

export function getAllBouquets(app: Express) {
  app.get("/bouquets", async () => {
    try {
      const bouquets = await prismadb.bouquets.findMany();
      return NextResponse.json(bouquets, { status: 200 });
    } catch (error) {
      console.log("GET_ALL_BOUQUETS_ERROR", error);
      return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
  });
}

export function getBouquetsByShopId(app: Express) {
  app.get("/shops/:shopId/bouquets", async (req: Request) => {
    try {
      const { shopId } = req.params;

      if (!shopId) {
        return NextResponse.json({ message: "Shop ID is required" }, { status: 400 });
      }

      const shop = await prismadb.shops.findUnique({
        where: { id: Number(shopId) },
      });

      if (!shop) {
        return NextResponse.json({ message: "Shop not found" }, { status: 404 });
      }

      const bouquets = await prismadb.bouquets.findMany({
        where: { shopId: Number(shopId) },
      });

      return NextResponse.json(bouquets, { status: 200 });
    } catch (error) {
      console.log("GET_BOUQUETS_BY_SHOP_ERROR", error);
      return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
  });
}

export function updateBouquet(app: Express) {
  app.patch("/bouquets/:shopId/:bouquetId", async (req: Request) => {
    try {
      const { shopId, bouquetId } = req.params;

      const shop = await prismadb.shops.findUnique({
        where: { id: Number(shopId) },
      });

      if (!shop) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
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
        return NextResponse.json(
          { message: "All fields are required" },
          { status: 400 }
        );
      }

      if (description.length > 255) {
        return NextResponse.json(
          { message: "Description must be less than 255 characters" },
          { status: 400 }
        );
      }

      if (typeof quantity !== "number" || quantity < 0 || isNaN(quantity)) {
        return NextResponse.json(
          { message: "Quantity must be a positive integer" },
          { status: 400 }
        );
      }

      if (typeof price !== "number" || price <= 0 || isNaN(price)) {
        return NextResponse.json(
          { message: "Price must be a positive number" },
          { status: 400 }
        );
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

      return NextResponse.json(
        { message: "Bouquet updated successfully.", bouquet: updatedBouquet },
        { status: 200 }
      );
    } catch (error) {
      console.log("UPDATE_BOUQUET_ERROR", error);
      return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
  });
}

export function deleteBouquet(app: Express) {
  app.delete("/bouquets/:shopId/:bouquetId", async (req: Request) => {
    try {
      const { shopId, bouquetId } = req.params;

      if (!bouquetId) {
        return NextResponse.json(
          { message: "Bouquet ID is required" },
          { status: 400 }
        );
      }

      const bouquet = await prismadb.bouquets.findUnique({
        where: { id: Number(bouquetId), shopId: Number(shopId) },
      });

      if (!bouquet) {
        return NextResponse.json(
          { message: "Bouquet not found" },
          { status: 404 }
        );
      }

      const deletedBouquet = await prismadb.bouquets.delete({
        where: { id: Number(bouquetId) }, 

      });

      return NextResponse.json(
        { message: "Bouquet deleted successfully", bouquet: deletedBouquet },
        { status: 200 }
      );
    } catch (error) {
      console.log("DELETE_BOUQUET_ERROR", error);
      return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
  });
}
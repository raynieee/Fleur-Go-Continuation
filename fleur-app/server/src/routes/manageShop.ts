import { Express, Request } from "express";
import { NextResponse } from "next/server";
import prismadb from "../lib/prismadb";
import { auth } from "@clerk/nextjs/server";

export function createShop(app: Express) {
  app.post("/admin/shops", async (req: Request) => {
    const authData = await auth();
    const userId = String(authData.userId);

    try {
      const { name, phoneNumber, address, businessPermitUrl } = req.body;

      if (!name || !phoneNumber || !address) {
        return NextResponse.json({ message: "Name, phone number, and address are required" }, { status: 400 });
      }

      if (phoneNumber.length < 11) {
        return NextResponse.json({ message: "Phone number must be at least 11 digits" }, { status: 400 });
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

      return NextResponse.json(shop, { status: 201 });
    } catch (error) {
      console.log("CREATE_SHOP_ERROR", error);
      return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
  });
}

export function getShopDetails(app: Express) {
  app.get("/admin/shops/:shopId", async (req: Request) => {
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

      return NextResponse.json(shop, { status: 200 });
    } catch (error) {
      console.log("GET_SHOP_DETAILS_ERROR", error);
      return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
  });
}

export function updateShop(app: Express) {
  app.patch("/admin/shops/:shopId", async (req: Request) => {
    const authData = await auth();
    const userId = String(authData.userId);

    try {
      const { shopId } = req.params;
      const { name, phoneNumber, address, businessPermitUrl } = req.body;

      if (!shopId) {
        return NextResponse.json({ message: "Shop ID is required" }, { status: 400 });
      }

      const shop = await prismadb.shops.findUnique({
        where: { id: Number(shopId) },
      });

      if (!shop) {
        return NextResponse.json({ message: "Shop not found" }, { status: 404 });
      }

      if (shop.userId !== userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
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

      return NextResponse.json(updatedShop, { status: 200 });
    } catch (error) {
      console.log("UPDATE_SHOP_ERROR", error);
      return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
  });
}

export function deleteShop(app: Express) {
  app.delete("/admin/shops/:shopId", async (req: Request) => {
    const authData = await auth();
    const userId = String(authData.userId);

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

      if (shop.userId !== userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

      const deletedShop = await prismadb.shops.delete({
        where: { id: Number(shopId) },
      });

      return NextResponse.json({
        message: "Shop deleted successfully",
        deletedShop,
      }, { status: 200 });
    } catch (error) {
      console.log("DELETE_SHOP_ERROR", error);
      return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
  });
}

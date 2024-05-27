import { Express, Request } from "express";
import { NextResponse } from "next/server";
import prismadb from "../lib/prismadb";
import { auth } from "@clerk/nextjs/server";

export function createUser(app: Express) {
  app.post("/admin/users", async (req: Request) => {
    const userId = await auth();

    try {
      const { firstName, lastName, userName, email, hashedPassword, role, phoneNumber, address, birthday } = req.body;

      if (!firstName || !lastName || !userName || !email || !hashedPassword || !role || !phoneNumber || !address || !birthday) {
        return NextResponse.json({ message: "All fields are required" }, { status: 400 });
      }

      if (phoneNumber.length < 11) {
        return NextResponse.json({ message: "Phone number must be at least 11 digits" }, { status: 400 });
      }

      const user = await prismadb.users.create({
        data: {
          id: userId,
          firstName,
          lastName,
          userName,
          email,
          hashedPassword,
          role,
          phoneNumber,
          address,
          birthday
        },
      });

      return NextResponse.json(user, { status: 201 });
    } catch (error) {
      console.log("CREATE_USER_ERROR", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  });
}

export function getUserById(app: Express) {
  app.get("/admin/users/:userId", async (req: Request) => {
    try {
      const { userId } = req.params;

      if (!userId) {
        return NextResponse.json({ message: "User ID is required" }, { status: 400 });
      }

      const user = await prismadb.users.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }

      return NextResponse.json(user, { status: 200 });
    } catch (error) {
      console.log("GET_USER_BY_ID_ERROR", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  });
}

export function updateUserById(app: Express) {
  app.patch("/admin/users/:userId", async (req: Request) => {
    try {
      const { userId } = req.params;
      const { firstName, lastName, userName, email, phoneNumber, address, birthday } = req.body;

      if (!userId) {
        return NextResponse.json({ message: "User ID is required" }, { status: 400 });
      }

      const user = await prismadb.users.update({
        where: { id: userId },
        data: {
          firstName,
          lastName,
          userName,
          email,
          phoneNumber,
          address,
          birthday
        },
      });

      return NextResponse.json(user, { status: 200 });
    } catch (error) {
      console.log("UPDATE_USER_BY_ID_ERROR", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  });
}

export function deleteUserById(app: Express) {
  app.delete("/admin/users/:userId", async (req: Request) => {
    try {
      const { userId } = req.params;

      if (!userId) {
        return NextResponse.json({ message: "User ID is required" }, { status: 400 });
      }

      const user = await prismadb.users.delete({
        where: { id: userId },
      });

      return NextResponse.json(user, { status: 200 });
    } catch (error) {
      console.log("DELETE_USER_BY_ID_ERROR", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  });
}
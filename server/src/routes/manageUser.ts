import { Express, Request, Response } from "express";
import prismadb from "../lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import bcrypt from "bcrypt";

export function createUser(app: Express) {
  app.post("/admin/users", async (req: Request, res: Response) => {
    const authData = await auth();
    const userId = String(authData.userId);

    try {
      const { firstName, lastName, userName, email, password, role, phoneNumber, address, birthday } = req.body;

      if (!firstName || !lastName || !userName || !email || !password || !role || !phoneNumber || !address || !birthday) {
        return res.status(400).json({ message: "All fields are required" });
      }

      if (phoneNumber.length < 11) {
        return res.status(400).json({ message: "Phone number must be at least 11 digits" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

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

      return res.status(201).json(user);
    } catch (error) {
      console.log("CREATE_USER_ERROR", error);
      return res.status(500).json({ message: "Internal Error" });
    }
  });
}

export function getUserById(app: Express) {
  app.get("/admin/users/:userId", async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const user = await prismadb.users.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.log("GET_USER_BY_ID_ERROR", error);
      return res.status(500).json({ message: "Internal Error" });
    }
  });
}

export function updateUserById(app: Express) {
  app.patch("/admin/users/:userId", async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const { firstName, lastName, userName, email, phoneNumber, address, birthday } = req.body;

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
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

      return res.status(200).json(user);
    } catch (error) {
      console.log("UPDATE_USER_BY_ID_ERROR", error);
      return res.status(500).json({ message: "Internal Error" });
    }
  });
}

export function deleteUserById(app: Express) {
  app.delete("/admin/users/:userId", async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const user = await prismadb.users.delete({
        where: { id: userId },
      });

      return res.status(200).json(user);
    } catch (error) {
      console.log("DELETE_USER_BY_ID_ERROR", error);
      return res.status(500).json({ message: "Internal Error" });
    }
  });
}
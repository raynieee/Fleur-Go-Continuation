import express from "express";
import supertest from "supertest";
import prismadb from "../lib/prismadb";
import {
  createUser,
  getUserById,
  deleteUserById,
} from "../routes/manageUser"; // Adjust the path as necessary

const app = express();
app.use(express.json()); // Ensure body parsing middleware is used
createUser(app);
getUserById(app);
deleteUserById(app);

describe("User Management", () => {
  afterEach(async () => {
    // Teardown: Delete all users
    await prismadb.users.deleteMany({});
  });

  describe("Create User", () => {
    it("should create a new user and return the user data", async () => {
      // Setup
      const userData = {
        firstName: "John",
        lastName: "Doe",
        userName: "johndoe",
        email: "john.doe@example.com",
        password: "secure123",
        role: "customer",
        phoneNumber: "12345678901",
        address: "123 Main St",
        birthday: "1980-01-01",
      };

      // Mock auth function
      jest.mock("@clerk/nextjs/server", () => ({
        auth: jest.fn().mockResolvedValue({ userId: "test-user-id" }),
      }));

      // Invocation
      const response = await supertest(app).post("/admin/users").send(userData);

      // Assessment
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id", "test-user-id");
      expect(response.body).toHaveProperty("firstName", userData.firstName);
      expect(response.body).toHaveProperty("lastName", userData.lastName);
      expect(response.body).toHaveProperty("userName", userData.userName);
      expect(response.body).toHaveProperty("email", userData.email);
      expect(response.body).toHaveProperty("role", userData.role);
      expect(response.body).toHaveProperty("phoneNumber", userData.phoneNumber);
      expect(response.body).toHaveProperty("address", userData.address);
      expect(response.body).toHaveProperty("birthday", userData.birthday);
    });
  });

  describe("Get User By ID", () => {
    it("should fetch a user by ID", async () => {
      const newUser = await prismadb.users.create({
        data: {
          id: "unique-user-id",
          firstName: "Jane",
          lastName: "Doe",
          userName: "janedoe",
          email: "jane.doe@example.com",
          hashedPassword: "hashedpassword",
          role: "customer",
          phoneNumber: "23456789012",
          address: "456 Elm St",
          birthday: "1990-02-02",
        },
      });

      // Invocation
      const response = await supertest(app).get(`/admin/users/${newUser.id}`);

      // Assessment
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", newUser.id);
      expect(response.body).toHaveProperty("firstName", newUser.firstName);
      expect(response.body).toHaveProperty("lastName", newUser.lastName);
      expect(response.body).toHaveProperty("userName", newUser.userName);
      expect(response.body).toHaveProperty("email", newUser.email);
      expect(response.body).toHaveProperty("role", newUser.role);
      expect(response.body).toHaveProperty("phoneNumber", newUser.phoneNumber);
      expect(response.body).toHaveProperty("address", newUser.address);
      expect(response.body).toHaveProperty("birthday", newUser.birthday);
    });
  });

  describe("Delete User By ID", () => {
    it("should delete a user by ID", async () => {
      const newUser = await prismadb.users.create({
        data: {
          id: "unique-user-id-2",
          firstName: "Jake",
          lastName: "Smith",
          userName: "jakesmith",
          email: "jake.smith@example.com",
          hashedPassword: "hashedpassword",
          role: "customer",
          phoneNumber: "45678901234",
          address: "101 Pine St",
          birthday: "2000-04-04",
        },
      });

      // Invocation
      const response = await supertest(app).delete(`/admin/users/${newUser.id}`);

      // Assessment
      expect(response.status).toBe(200);
      const deletedUser = await prismadb.users.findUnique({
        where: { id: newUser.id },
      });
      expect(deletedUser).toBeNull();
    });
  });
});

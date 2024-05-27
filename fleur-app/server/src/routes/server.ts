import express from "express";
import cors from "cors";
import { getInventory } from "./inventory/getStock";
import { updateInventory } from "./inventory/updateStock";
import {
  addBouquet,
  getAllBouquets,
  getBouquetsByShopId,
  updateBouquet,
  deleteBouquet,
} from "./manageBouquet";
import {
  addCartItem,
  getCartItems,
  updateCartItemQuantity,
  removeCartItem,
} from "./manageCartItems";
import {
  createShop,
  getShopDetails,
  updateShop,
  deleteShop,
} from "./manageShop";
import {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  deleteTransactionById,
  getTransactionsByUserId,
  getTransactionsByShopId,
  getTransactionByIdUnderUserId,
  getTransactionByIdUnderShopId,
  getTransactionsByUserIdAndStatus,
  getTransactionsByShopIdAndStatus,
} from "./manageTransactions";
import {
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
} from "./manageUser";

function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  getInventory(app);
  updateInventory(app);

  addBouquet(app);
  getAllBouquets(app);
  getBouquetsByShopId(app);
  updateBouquet(app);
  deleteBouquet(app);

  addCartItem(app);
  getCartItems(app);
  updateCartItemQuantity(app);
  removeCartItem(app);

  createShop(app);
  getShopDetails(app);
  updateShop(app);
  deleteShop(app);

  createTransaction(app);
  getAllTransactions(app);
  getTransactionById(app);
  deleteTransactionById(app);
  getTransactionsByUserId(app);
  getTransactionsByShopId(app);
  getTransactionByIdUnderUserId(app);
  getTransactionByIdUnderShopId(app);
  getTransactionsByUserIdAndStatus(app);
  getTransactionsByShopIdAndStatus(app);

  createUser(app);
  getUserById(app);
  updateUserById(app);
  deleteUserById(app);

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  return app;
}

export default createServer;

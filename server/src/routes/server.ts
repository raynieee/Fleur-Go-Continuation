import express from "express";
import cors from "cors";
import {
  addBouquet,
  getAllBouquetsWithShopNames,
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
  getUserShopDetails,
  updateShop,
  deleteShop,
} from "./manageShop";
import {
  createTransaction,
  updateTransactionStatus,
  deleteTransactionByUserId,
  deleteTransactionByShopId,
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

  addBouquet(app);
  getAllBouquetsWithShopNames(app);
  getBouquetsByShopId(app);
  updateBouquet(app);
  deleteBouquet(app);

  addCartItem(app);
  getCartItems(app);
  updateCartItemQuantity(app);
  removeCartItem(app);

  createShop(app);
  getUserShopDetails(app);
  updateShop(app);
  deleteShop(app);

  createTransaction(app);
  updateTransactionStatus(app);
  deleteTransactionByUserId(app);
  deleteTransactionByShopId(app);
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

  return app;
}

export default createServer;

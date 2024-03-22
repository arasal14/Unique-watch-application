import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  createCategoryController,
  categoryController,
  updateCategoryController,
  singleCategoryController,
  deleteCategoryController,
} from "../controllers/categoryController.js";

const router = express.Router();

//Routes

//1. Create Category || Post
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  createCategoryController
);

//2. Update Category || Put
router.put(
  "/update-category/:id",
  requireSignIn,
  isAdmin,
  updateCategoryController
);

//3. Get All Category || Get
router.get("/get-all-category", categoryController);

//4. Get Single Category || Get
router.get("/get-single-category/:slug", singleCategoryController);

//5. Delete Category || Delete
router.delete(
  "/delete-category/:id",
  requireSignIn,
  isAdmin,
  deleteCategoryController
);

export default router;

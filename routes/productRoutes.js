import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productFilterController,
  productPhotoController,
  updateProductController,
  productCountController,
  productPerPageController,
  productSearchController,
  relatedProductController,
  productCategoryController,
  braintreeTokenController,
  braintreePaymentController,
} from "../controllers/productController.js";
import formidable from "express-formidable";

const router = express.Router();

//1. Create Product || Post
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

//2. Update Product || Put
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

//3. Get Prodcut || Get
router.get("/get-product", getProductController);

//4. Get Single Product || Get
router.get("/get-product/:slug", getSingleProductController);

//5. Get Photo || Get
router.get("/product-photo/:pid", productPhotoController);

//6. Delete Product || Delete
router.delete("/delete-product/:pid", deleteProductController);

//7. Product Filter || Post
router.post("/product-filters", productFilterController);

//8. Product Count/Pagination || Get
router.get("/product-count", productCountController);

//9.Product Per Page
router.get("/product-list/:page", productPerPageController);

//10.Serach Product
router.get("/search/:keyword", productSearchController);

//11.Similar Products
router.get("/related-product/:pid/:cid", relatedProductController);

//12.Category Wise Product
router.get("/product-category/:slug", productCategoryController);

//13.Payment Routes
//1.Token
router.get("/braintree/token", braintreeTokenController);

//2.Payments
router.post("/braintree/payment", requireSignIn, braintreePaymentController);

export default router;

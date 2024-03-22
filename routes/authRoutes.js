import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  orderStatusCOntroller,
} from "../controllers/authController.js";
import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";

//Router Object
const router = express.Router();

//Routing

//1. Register || Post
router.post("/register", registerController);

//2. Login || Post
router.post("/login", loginController);

//3. Forgot Password || Post
router.post("/forgot-password", forgotPasswordController);

//4. Test Router
router.get("/test", requireSignIn, isAdmin, testController);

//5. Protected User Auth Route
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

//6. Protected Admin Auth Route
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

//7. Update User Profile
router.put("/profile", requireSignIn, updateProfileController);

//8. User Orders
router.get("/orders", requireSignIn, getOrdersController);

//8. Get All Orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

//9. Order Status Update
router.put("/order-status/:orderId", requireSignIn, isAdmin, orderStatusCOntroller)

export default router;

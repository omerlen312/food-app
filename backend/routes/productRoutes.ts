import { Router } from "express";
import { getProducts, addProduct } from "../controllers/productcontroller.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getProducts);

router.post("/", authenticate, addProduct);

export default router;

import { Router } from "express";
import { getProducts, createProduct } from "../controllers/product.controller.js";
console.log("Product Routes file is loading..."); // <--- ADD THIS
// ... rest of code
const router = Router();

// This handles: /api/v1/products/list
router.route("/list").get(getProducts);

// This handles: /api/v1/products/create
router.route("/create").post(createProduct);

export default router;
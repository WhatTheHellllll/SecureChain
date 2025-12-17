import { Router } from "express";
import { getProducts,getProduct, createProduct, updateProduct, deleteProduct } from "../controllers/product.controller.js";
console.log("Product Routes file is loading..."); // <--- ADD THIS
// ... rest of code
const router = Router();

// This handles: /api/v1/products/list
router.route("/list").get(getProducts);

// This handles: /api/v1/products/create
router.route("/create").post(createProduct);

router.route("/get/:id").get(getProduct);          
router.route("/update/:id").put(updateProduct);    
router.route("/delete/:id").delete(deleteProduct);

export default router;
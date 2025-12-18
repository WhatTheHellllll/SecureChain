import { Router } from "express";
import { getProducts,getProduct, createProduct, updateProduct, deleteProduct } from "../controllers/product.controller.js";
import { protect } from "../middleware/auth.middleware.js";
console.log("Product Routes file is loading..."); // <--- ADD THIS
// ... rest of code
const router = Router();

// This handles: /api/v1/products/list
router.route("/list").get(getProducts);

// This handles: /api/v1/products/create
router.route("/create").post(protect,createProduct);

router.route("/get/:id").get(getProduct);          
router.route("/update/:id").put(protect,updateProduct);    
router.route("/delete/:id").delete(protect,deleteProduct);

export default router;
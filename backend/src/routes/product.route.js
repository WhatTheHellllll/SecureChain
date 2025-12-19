import { Router } from "express";
import { getProducts,getProduct, createProduct, updateProduct, deleteProduct } from "../controllers/product.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { checkPermission } from "../middleware/permission.middleware.js";

console.log("Product Routes file is loading..."); 

const router = Router();

router.route("/list").get(protect, checkPermission("product.read"), getProducts);

router.route("/create").post(protect, checkPermission("product.create"), createProduct);

router.route("/get/:id").get(protect,getProduct);          

router.route("/update/:id").put(protect, checkPermission("product.update"), updateProduct);  
  
router.route("/delete/:id").delete(protect, checkPermission("product.delete"), deleteProduct);
export default router;
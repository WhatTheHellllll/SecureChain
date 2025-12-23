import { Router } from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { checkPermission } from "../middleware/permission.middleware.js";
import { PERMISSION_GROUPS } from "../constants/permissions.js";
import validate from "../middleware/validation.middleware.js";
import productSchema from "../validators/product.schema.js";

const router = Router();

router
  .route("/list")
  .get(protect, checkPermission(PERMISSION_GROUPS.PRODUCT.READ), getProducts);
router
  .route("/get/:id")
  .get(protect, checkPermission(PERMISSION_GROUPS.PRODUCT.READ), getProduct);
router
  .route("/create")
  .post(
    protect,
    validate(productSchema.createProduct),
    checkPermission(PERMISSION_GROUPS.PRODUCT.CREATE),
    createProduct
  );
router
  .route("/update/:id")
  .put(
    protect,
    validate(productSchema.updateProduct),
    checkPermission(PERMISSION_GROUPS.PRODUCT.UPDATE),
    updateProduct
  );
router
  .route("/delete/:id")
  .delete(
    protect,
    checkPermission(PERMISSION_GROUPS.PRODUCT.DELETE),
    deleteProduct
  );
export default router;

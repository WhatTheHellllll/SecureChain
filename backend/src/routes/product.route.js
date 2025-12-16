import { Router } from "express";
import { getProducts, createProduct } from "../controllers/product.controller.js";

const router = Router();

router.route('/').get(getProducts);
router.route('/').post(createProduct);

export default router;
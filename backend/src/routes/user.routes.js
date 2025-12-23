import { Router } from "express";
import {
  getUsers,
  assignRolePermissions,
} from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { checkPermission } from "../middleware/permission.middleware.js";
import validate from "../middleware/validation.middleware.js";
import userSchema from "../validators/user.schema.js";
import { ROLES } from "../constants/roles.js";

const router = Router();

router
  .route("/update/:id")
  .put(protect, checkPermission(ROLES.SUB_ADMIN), assignRolePermissions);
router
  .route("/list")
  .get(
    protect,
    validate(userSchema.updateUser),
    checkPermission(ROLES.SUB_ADMIN),
    getUsers
  );

export default router;

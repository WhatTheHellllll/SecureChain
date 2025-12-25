import { Router } from "express";
import {
  getUsers,
  assignRolePermissions,
  deleteUser,
} from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { checkPermission } from "../middleware/permission.middleware.js";
import validate from "../middleware/validation.middleware.js";
import userSchema from "../validators/user.schema.js";
import { PERMISSION_GROUPS } from "../constants/permissions.js";

const router = Router();

router
  .route("/update/:id")
  .put(
    protect,
    validate(userSchema.updateUser),
    checkPermission(PERMISSION_GROUPS.ADMIN.SUB_ADMIN),
    assignRolePermissions
  );
router
  .route("/list")
  .get(protect, checkPermission(PERMISSION_GROUPS.ADMIN.SUB_ADMIN), getUsers);
router
  .route("/delete/:id")
  .delete(
    protect,
    checkPermission(PERMISSION_GROUPS.ADMIN.SUB_ADMIN),
    deleteUser
  );

export default router;

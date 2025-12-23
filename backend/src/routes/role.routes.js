import { Router } from "express";
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  getPermissions,
} from "../controllers/role.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { checkPermission } from "../middleware/permission.middleware.js";
import validate from "../middleware/validation.middleware.js";
import roleSchema from "../validators/role.schema.js";
import { PERMISSION_GROUPS } from "../constants/permissions.js";
const router = Router();

router
  .route("/permissions")
  .get(protect, checkPermission(PERMISSION_GROUPS.SUB_ADMIN), getPermissions);
router
  .route("/list")
  .get(protect, checkPermission(PERMISSION_GROUPS.SUB_ADMIN), getRoles);
router
  .route("/create")
  .post(
    protect,
    validate(roleSchema.createRoleSchema),
    checkPermission(PERMISSION_GROUPS.SUB_ADMIN),
    createRole
  );
router
  .route("/update/:id")
  .put(
    protect,
    validate(roleSchema.updateRoleSchema),
    checkPermission(PERMISSION_GROUPS.SUB_ADMIN),
    updateRole
  );
router
  .route("/delete/:id")
  .delete(protect, checkPermission(PERMISSION_GROUPS.SUB_ADMIN), deleteRole);

export default router;

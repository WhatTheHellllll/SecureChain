import { Router } from "express";
import { getUsers, assignRolePermissions } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { checkPermission } from "../middleware/permission.middleware.js";
import { PERMISSION_GROUPS } from "../constants/permissions.js";

const router = Router();

router.route("/update/:id").put(protect, checkPermission(PERMISSION_GROUPS.ADMIN.ALL), assignRolePermissions);
router.route("/list").get(protect, checkPermission(PERMISSION_GROUPS.ADMIN.ALL), getUsers);

export default router;
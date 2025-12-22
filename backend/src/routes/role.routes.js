import { Router } from "express";
import { getRoles, createRole, updateRole, deleteRole, getPermissions } from "../controllers/role.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { checkPermission } from "../middleware/permission.middleware.js";
import { PERMISSION_GROUPS } from "../constants/permissions.js";


const router = Router();

router.route("/permissions").get(protect, checkPermission(PERMISSION_GROUPS.ROLE.MANAGE), getPermissions);
router.route("/list").get(protect, checkPermission(PERMISSION_GROUPS.ROLE.MANAGE), getRoles);
router.route("/create").post(protect, checkPermission(PERMISSION_GROUPS.ROLE.MANAGE), createRole);
router.route("/update/:id").put(protect, checkPermission(PERMISSION_GROUPS.ROLE.MANAGE), updateRole);
router.route("/delete/:id").delete(protect, checkPermission(PERMISSION_GROUPS.ROLE.MANAGE), deleteRole);

export default router;
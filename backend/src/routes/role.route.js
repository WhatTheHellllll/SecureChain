import { Router } from "express";
import { getRoles, createRole, updateRole, deleteRole } from "../controllers/role.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { checkPermission } from "../middleware/permission.middleware.js";

const router = Router();

// Only someone with 'role.read' permission can see roles
router.get("/roles", protect, checkPermission("role.read"), getRoles);

// Only someone with 'role.manage' can create/edit roles
router.post("/create", protect, checkPermission("role.manage"), createRole);
router.put("/update/:id", protect, checkPermission("role.manage"), updateRole);
router.delete("/delete/:id", protect, checkPermission("role.manage"), deleteRole);

export default router;
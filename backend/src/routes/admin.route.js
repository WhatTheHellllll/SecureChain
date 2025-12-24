import { Router } from "express";
import {
  getAuditLogs,
  getSpecificEntityHistory,
} from "../controllers/audit.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { checkPermission } from "../middleware/permission.middleware.js";
import { PERMISSION_GROUPS } from "../constants/permissions.js";
const router = Router();

// 1. Get ALL logs
router
  .route("/audit-logs")
  .get(
    protect,
    checkPermission(PERMISSION_GROUPS.ADMIN.SUPER_ADMIN),
    getAuditLogs
  );

// 2. Get history for a SPECIFIC item (matches your frontend service)
router
  .route("/audit-logs/:type/:id")
  .get(
    protect,
    checkPermission(PERMISSION_GROUPS.ADMIN.SUPER_ADMIN),
    getSpecificEntityHistory
  );

export default router;

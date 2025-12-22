import { Router } from 'express';
import {
  getUsers,
  assignRolePermissions,
} from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { checkPermission } from '../middleware/permission.middleware.js';
import { PERMISSION_GROUPS } from '../constants/permissions.js';
import validate from '../middleware/validation.middleware.js';
import userSchema from '../validators/user.schema.js';

const router = Router();

router
  .route('/update/:id')
  .put(
    protect,
    checkPermission(PERMISSION_GROUPS.ROLE.MANAGE),
    assignRolePermissions
  );
router
  .route('/list')
  .get(
    protect,
    validate(userSchema.updateUser),
    checkPermission(PERMISSION_GROUPS.ROLE.MANAGE),
    getUsers
  );

export default router;

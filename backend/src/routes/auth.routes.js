import { Router } from 'express';
import { login, register } from '../controllers/auth.controller.js';
import validate from '../middleware/validation.middleware.js'; // 1. Import Middleware
import authSchema from '../validators/auth.schema.js'; // 2. Import Schema

const router = Router();

router.post('/login', validate(authSchema.login), login);
router.post('/register', validate(authSchema.register), register);

export default router;

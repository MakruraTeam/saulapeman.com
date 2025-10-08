import express from 'express';
import { registerController } from '../controllers/register.controller.js';
import { loginController } from '../controllers/login.controller.js';
import { userAuthorization } from '../middlewares/userAuth.middlewares.js';
import { logoutController } from '../controllers/logout.controller.js';

const router = express.Router();

router.post('/login', loginController);
router.post('/register', userAuthorization, registerController);
router.post('/logout', userAuthorization, logoutController);

export default router;

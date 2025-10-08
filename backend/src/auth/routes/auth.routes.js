import express from 'express';
import { registerController } from '../controllers/register.controller';
import { loginController } from '../controllers/login.controller.js';
import { userAuthorization } from '../middlewares/userAuth.middlewares';

const router = express.Router();

router.post('/login', loginController);
router.post('/register', userAuthorization, registerController);

export default router;

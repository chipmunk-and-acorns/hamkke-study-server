import express from 'express';

import * as memberController from '../controller/member.control';
import { memberValid } from '../middleware/validation';
import authenticateToken from '../middleware/authenticateToken';

const route = express.Router();

route.post('/register', memberValid.register, memberController.register);
route.post('/login', memberValid.login, memberController.login);
route.post('/logout', authenticateToken, memberController.logout);

export default route;

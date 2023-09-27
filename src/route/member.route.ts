import express from 'express';

import * as memberController from '../controller/member.control';
import { memberValid } from '../middleware/validation';
import authenticateToken, { requireTokenCheck } from '../middleware/authenticateToken';

const route = express.Router();

route.post('/register', memberValid.register, memberController.register);
route.post('/login', memberValid.login, memberController.login);
route.post('/logout', authenticateToken, memberController.logout);
route.post('/token', memberController.ReissueAccessUsingRefresh);
route.get('/me', authenticateToken, requireTokenCheck, memberController.me);
route.put('/', authenticateToken, requireTokenCheck, memberController.updateMember);
route.delete('/', authenticateToken, requireTokenCheck, memberController.deleteMember);

export default route;

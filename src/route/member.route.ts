import express from 'express';

import * as memberController from '../controller/member.control';
import { memberValid } from '../middleware/validation';

const route = express.Router();

route.post('/register', memberValid.register, memberController.register);
route.post('/login', memberValid.login, memberController.login);

export default route;

import express from 'express';

import * as memberController from '../controller/member.controller';

const route = express.Router();

route.post('/register', memberController.register);

export default route;

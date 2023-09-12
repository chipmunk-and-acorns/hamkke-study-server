import * as express from 'express';

import { getStackList } from '../controller/stack.controller';

const route = express.Router();

route.get('/', getStackList);

export default route;

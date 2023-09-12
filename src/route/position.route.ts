import * as express from 'express';

import { getPositionList } from '../controller/position.controller';

const route = express.Router();

route.get('/', getPositionList);

export default route;

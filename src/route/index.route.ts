import express from 'express';

import memberRoute from './member.route';
import imageRoute from './image.route';

const route = express.Router();

route.use('/members', memberRoute);
route.use('/images', imageRoute);

export default route;

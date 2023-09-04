import express from 'express';

import memberRoute from './member.route';
import imageRoute from './image.route';
import articleRoute from './image.route';

const route = express.Router();

route.use('/members', memberRoute);
route.use('/images', imageRoute);
route.use('/articles', articleRoute);

export default route;

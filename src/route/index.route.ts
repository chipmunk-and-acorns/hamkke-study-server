import express from 'express';

import memberRoute from './member.route';
import imageRoute from './image.route';
import articleRoute from './article.route';
import stackRoute from './stack.route';
import positionRoute from './position.route';
import commentRoute from './comment.route';

const route = express.Router();

route.use('/members', memberRoute);
route.use('/images', imageRoute);
route.use('/articles', articleRoute);
route.use('/comments', commentRoute);
route.use('/stacks', stackRoute);
route.use('/positions', positionRoute);

export default route;

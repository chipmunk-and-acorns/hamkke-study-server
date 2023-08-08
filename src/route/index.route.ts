import express from 'express';

import memberRoute from './member.route';

const route = express.Router();

route.use('/members', memberRoute);

export default route;

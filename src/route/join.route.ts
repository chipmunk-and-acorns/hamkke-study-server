import * as express from 'express';
import { getArticleJoinCount, acceptOrRejectJoin } from '../controller/join.controller';

const route = express.Router();

route.get('/:articleId', getArticleJoinCount);
route.patch('/:joinId/:status', acceptOrRejectJoin);

export default route;

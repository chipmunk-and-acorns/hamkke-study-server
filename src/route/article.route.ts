import * as express from 'express';

import {
  completeArticle,
  createArticle,
  deleteArticle,
  getArticle,
  getArticleList,
  joinArticle,
  likeArticle,
  updateArticle,
} from '../controller/article.controller';
import authenticateToken, { requireTokenCheck } from '../middleware/authenticateToken';

const route = express.Router();

route.post('/', authenticateToken, requireTokenCheck, createArticle);
route.get('/', getArticleList);
route.get('/:id', authenticateToken, getArticle);
route.put('/:id', authenticateToken, requireTokenCheck, updateArticle);
route.post('/join/:id', authenticateToken, requireTokenCheck, joinArticle);
route.patch('/complete/:id', authenticateToken, requireTokenCheck, completeArticle);
route.patch('/like/:id', authenticateToken, requireTokenCheck, likeArticle);
route.delete('/:id', authenticateToken, requireTokenCheck, deleteArticle);

export default route;

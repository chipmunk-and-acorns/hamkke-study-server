import * as express from 'express';

import {
  completeArticle,
  createArticle,
  deleteArticle,
  getArticle,
  getArticleList,
  updateArticle,
} from '../controller/article.controller';
import authenticateToken from '../middleware/authenticateToken';

const route = express.Router();

route.post('/', authenticateToken, createArticle);
route.get('/', getArticleList);
route.get('/:id', getArticle);
route.put('/:id', authenticateToken, updateArticle);
route.patch('/complete/:id', authenticateToken, completeArticle);
route.delete('/:id', authenticateToken, deleteArticle);

export default route;

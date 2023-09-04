import * as express from 'express';

import {
  completeArticle,
  createArticle,
  deleteArticle,
  getArticle,
  getArticleList,
  updateArticle,
} from '../controller/article.controller';

const route = express.Router();

route.post('/', createArticle);
route.get('/', getArticleList);
route.get('/:id', getArticle);
route.put('/:id', updateArticle);
route.patch('/complete/:id', completeArticle);
route.delete('/:id', deleteArticle);

export default route;

import * as express from 'express';
import {
  deleteComment,
  getCommentList,
  addComment,
  updateComment,
  getComment,
} from '../controller/comment.controller';
import authenticateToken, { requireTokenCheck } from '../middleware/authenticateToken';

const route = express.Router();

route.get('/:articleId', getCommentList);
route.get('/:articleId/:id', getComment);
route.post('/:articleId', authenticateToken, requireTokenCheck, addComment);
route.put('/:articleId/:id', authenticateToken, requireTokenCheck, updateComment);
route.delete('/:articleId/:id', authenticateToken, requireTokenCheck, deleteComment);

export default route;

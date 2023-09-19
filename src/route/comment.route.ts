import * as express from 'express';
import {
  deleteComment,
  getCommentList,
  addComment,
  updateComment,
} from '../controller/comment.controller';
import authenticateToken, { requireTokenCheck } from '../middleware/authenticateToken';

const route = express.Router();

route.get('/:articleId', getCommentList);
route.post('/:articleId', authenticateToken, requireTokenCheck, addComment);
route.put('/:id', authenticateToken, requireTokenCheck, updateComment);
route.delete('/:id', authenticateToken, requireTokenCheck, deleteComment);

export default route;

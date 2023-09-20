import { Request, Response } from 'express';
import {
  deleteCommentById,
  findCommentById,
  findCommentsList,
  saveComment,
  updateCommentById,
} from '../repository/comment.repo';
import { snakeToCamel } from '../mapper/changeCase.mapper';
import { isEmpty } from 'lodash';

export const addComment = async (request: Request, response: Response) => {
  const { articleId } = request.params;
  const { content, parentCommentId } = request.body;
  const { member } = response.locals;

  try {
    const comment = await saveComment({
      articleId: Number(articleId),
      memberId: member.memberId,
      content,
      parentCommentId: parentCommentId || null,
    });

    const camelCommentData = snakeToCamel(comment);
    return response.status(201).json(camelCommentData);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error });
  }
};

export const getCommentList = async (request: Request, response: Response) => {
  const { articleId } = request.params;

  try {
    const commentList = await findCommentsList(Number(articleId));

    return response.status(200).json(commentList);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error });
  }
};

export const getComment = async (request: Request, response: Response) => {
  const { articleId, id } = request.params;

  try {
    const comment = await findCommentById(Number(articleId), Number(id));
    return response.status(200).json(comment);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error });
  }
};

export const updateComment = async (request: Request, response: Response) => {
  const { articleId, id } = request.params;
  const { content } = request.body;
  const { member } = response.locals;

  try {
    const comment = await findCommentById(Number(articleId), Number(id));

    if (isEmpty(comment)) {
      return response.status(400).json({ message: '존재하지 않는 게시글 또는 댓글입니다.' });
    } else if (comment.member_id !== member.memberId) {
      return response.status(400).json({ message: '작성자만 수정할 수 있습니다.' });
    }

    const updateComment = await updateCommentById(Number(articleId), Number(id), content);

    return response.status(200).json(updateComment);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error });
  }
};

export const deleteComment = async (request: Request, response: Response) => {
  const { articleId, id } = request.params;
  const { member } = response.locals;

  try {
    const comment = await findCommentById(Number(articleId), Number(id));

    if (isEmpty(comment)) {
      return response.status(400).json({ message: '존재하지 않는 게시글 또는 댓글입니다.' });
    } else if (comment.member_id !== member.memberId) {
      return response.status(400).json({ message: '작성자만 수정할 수 있습니다.' });
    }

    const deleteComment = await deleteCommentById(Number(articleId), Number(id));
    return response.status(200).json({ commentId: deleteComment.id });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error });
  }
};

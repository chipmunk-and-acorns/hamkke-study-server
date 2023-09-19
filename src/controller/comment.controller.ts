import { Request, Response } from 'express';
import { findCommentsList, saveComment } from '../repository/comment.repo';
import { snakeToCamel } from '../mapper/changeCase.mapper';

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

export const updateComment = async (request: Request, response: Response) => {};

export const deleteComment = async (request: Request, response: Response) => {};

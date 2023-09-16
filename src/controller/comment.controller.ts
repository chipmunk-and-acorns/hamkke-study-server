import { Request, Response } from 'express';
import { findCommentsList } from '../repository/comment.repo';

export const saveComment = async (request: Request, response: Response) => {};

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

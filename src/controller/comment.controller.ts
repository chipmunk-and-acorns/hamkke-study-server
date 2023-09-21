import { Request, Response } from 'express';
import { isEmpty } from 'lodash';

import {
  deleteCommentById,
  findCommentById,
  findCommentsList,
  saveComment,
  updateCommentById,
} from '../repository/comment.repo';
import { ConvertKeysToCamel, snakeToCamel } from '../mapper/changeCase.mapper';
import { CommentJoinMember } from '../types/database';

interface CommentWithChildren extends CommentJoinMember {
  children: ConvertKeysToCamel<CommentWithChildren>[];
}

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
    const result = await findCommentsList(Number(articleId));
    const commentList = result.map((comment) => {
      const data: CommentWithChildren = {
        ...comment,
        children: [],
      };
      return snakeToCamel<CommentWithChildren>(data);
    });

    const tree: ConvertKeysToCamel<CommentWithChildren>[] = [];
    const map: { [key: string]: ConvertKeysToCamel<CommentWithChildren> } = {};

    commentList.forEach((comment) => {
      map[comment.commentId] = comment;
    });
    commentList.forEach((comment) => {
      if (comment.parentCommentId != null) {
        map[comment.parentCommentId].children.push(comment);
      } else {
        tree.push(comment);
      }
    });

    return response.status(200).json(tree);
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

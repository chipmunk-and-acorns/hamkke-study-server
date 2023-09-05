import { Request, Response } from 'express';

import {
  deleteArticleById,
  findArticleById,
  findArticles,
  saveArticle,
} from '../repository/article.repo';
import { articleDBToArticleResponseDto } from '../mapper/article.mapper';
import { ArticlePost } from '../types/article';
import { ArticleJoinMemberDB } from '../types/database';
import { isEmpty } from 'lodash';

export const createArticle = async (request: Request, response: Response) => {
  const { title, content, recruitmentType, recruitmentLimit, progressMode, duration, closingDate } =
    request.body;
  const {
    member: { memberId },
  } = response.locals;

  try {
    const articlePost: ArticlePost = {
      memberId,
      title,
      content,
      recruitmentType,
      recruitmentLimit,
      progressMode,
      duration,
      closingDate,
    };

    const [result] = await saveArticle<ArticleJoinMemberDB>(articlePost);
    const articleResponseDto = articleDBToArticleResponseDto(result);
    return response.status(201).json(articleResponseDto);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error });
  }
};

export const getArticleList = async (request: Request, response: Response) => {
  try {
    const result = await findArticles();
    const articles = result.map((article) => articleDBToArticleResponseDto(article));
    return response.status(200).json(articles);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error });
  }
};

export const getArticle = async (request: Request, response: Response) => {
  const { id } = request.params;
  try {
    const [result] = await findArticleById(parseInt(id));
    if (isEmpty(result)) {
      return response.status(400).json({ message: '존재하지 않는 게시글 아이디입니다.' });
    }
    const articleResponse = articleDBToArticleResponseDto(result);
    return response.status(200).json(articleResponse);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error });
  }
};

export const updateArticle = async (request: Request, response: Response) => {
  // 1. params에서 id 받아오기
  // 2. 데이터베이스 데이터 조회
  // 2.5 데이터가 없으면 에러
  // 3. 내가 작성한 게시글인지 확인
  // 3.5 내가 작성한 게시글이 아니라면 에러
  // 4. 데이터 업데이트
  // 5. 업데이트 데이터와 함께 리턴
  return response.sendStatus(200);
};

export const completeArticle = async (request: Request, response: Response) => {
  // 1. params에서 id 받아오기
  const { id } = request.params;
  const { member } = response.locals;

  try {
    const [result] = await findArticleById(parseInt(id));

    if (isEmpty(result)) {
      return response.status(400).json({ message: '존재하지 않는 게시글 아이디입니다.' });
    }

    if (result.member_id !== member.memberId) {
      return response.status(403).json({ message: '게시글 작성자가 아닙니다.' });
    }

    if (result.is_closed) {
      return response.status(409).json({ message: '이미 모집이 완료된 게시글입니다.' });
    }
    // 4. 성공 응답
    const articleDto = articleDBToArticleResponseDto(result);
    return response.status(200).json(articleDto);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error });
  }
};

export const deleteArticle = async (request: Request, response: Response) => {
  const { id } = request.params;
  const { member } = response.locals;
  try {
    const [result] = await findArticleById(parseInt(id));

    if (isEmpty(result)) {
      return response.status(400).json({ message: '존재하지 않은 게시글입니다.' });
    } else if (Number(result.member_id) !== Number(member.memberId)) {
      return response.status(403).json({ message: '글 작성자가 아닙니다.' });
    } else if (result.is_deleted) {
      return response.status(400).json({ message: '이미 삭제된 게시글입니다.' });
    }

    const { rowCount } = await deleteArticleById(parseInt(id));

    if (rowCount > 0) {
      return response.sendStatus(204);
    } else {
      throw new Error('알수 없는 이유로 게시글을 삭제하는데 실패했습니다.');
    }
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error });
  }
};

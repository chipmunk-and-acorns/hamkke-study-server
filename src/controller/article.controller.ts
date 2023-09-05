import { Request, Response } from 'express';

import { findArticleById, findArticles, saveArticle } from '../repository/article.repo';
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
  // 2. 데이터 베이스 조회
  // 2.5. 데이터 없음 or 이미 모집완료된 게시글 -> 에러
  // 3. 내가 작성한 게시글 체크
  // 4. 성공 응답
  return response.sendStatus(200);
};

export const deleteArticle = async (request: Request, response: Response) => {
  // 1. params에서 id 받아오기
  // 2. 게시글 조회
  // 3. 내가 작성한 게시글 체크
  // 4. 게시글 삭제 (soft delete 고려)
  // 5. 성공 응답
  return response.sendStatus(204);
};

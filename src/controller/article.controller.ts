import { Request, Response } from 'express';

export const createArticle = async (request: Request, response: Response) => {
  // 1. body에서 필요한 데이터 받아오기
  // 2. pool을 이용하여 생성
  // 3. 생성한 데이터와 함께 리턴
  return response.sendStatus(201);
};

export const getArticleList = async (request: Request, response: Response) => {
  // 1. pool을 이용하여 게시글 전체 조회
  // 2. 데이터와 함께 리턴
  return response.sendStatus(200);
};

export const getArticle = async (request: Request, response: Response) => {
  // 1. params에서 id 받아오기
  // 2. 데이터베이스 조회
  // 3-1. 데이터가 없으면 에러
  // 3-2. 데이터가 있으면 리턴
  return response.sendStatus(200);
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

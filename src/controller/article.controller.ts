import { Request, Response } from 'express';

export const createArticle = async (request: Request, response: Response) => {
  return response.sendStatus(201);
};

export const getArticleList = async (request: Request, response: Response) => {
  return response.sendStatus(200);
};

export const getArticle = async (request: Request, response: Response) => {
  return response.sendStatus(200);
};

export const updateArticle = async (request: Request, response: Response) => {
  return response.sendStatus(200);
};

export const completeArticle = async (request: Request, response: Response) => {
  return response.sendStatus(200);
};

export const deleteArticle = async (request: Request, response: Response) => {
  return response.sendStatus(204);
};

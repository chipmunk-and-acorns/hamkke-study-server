import { Request, Response } from 'express';
import {
  acceptOrRejectJoinByJoinId,
  findTotalJoinAndAcceptJoinByArticleId,
} from '../repository/join.repo';

export const getArticleJoinCount = async (request: Request, response: Response) => {
  const { articleId } = request.params;

  try {
    const [{ count: totalJoinCount }, { count: acceptJoinCount }] =
      await findTotalJoinAndAcceptJoinByArticleId(Number(articleId));
    return response.status(200).json({ totalJoinCount, acceptJoinCount });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error });
  }
};

export const acceptOrRejectJoin = async (request: Request, response: Response) => {
  const { joinId, status } = request.params;

  try {
    await acceptOrRejectJoinByJoinId(Number(joinId), status);

    return response.sendStatus(204);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error });
  }
};

import { Request, Response } from 'express';
import { isEmpty } from 'lodash';

import { getClientIp } from '../util/ip';
import { findData, saveData } from '../util/redis';
import { ArticlePost, PlusOrMinus } from '../types/article';
import { ArticleJoinMemberDB, PositionDB, StackDB } from '../types/database';
import { camelToSnake, snakeToCamel } from '../mapper/changeCase.mapper';
import { articleDBToArticleResponseDto } from '../mapper/article.mapper';
import { saveArticleStack } from '../repository/articleStack.repo';
import { findStackListByArticleId } from '../repository/stack.repo';
import { saveArticlePosition } from '../repository/articlePosition.repo';
import { findJoinByArticleIdAndMemberId, savaJoin } from '../repository/join.repo';
import { findPositionListByArticleId } from '../repository/position.repo';
import {
  saveLike,
  findLikeByArticleIdAndMemberId,
  deleteLikeByArticleIdAndMemberId,
} from '../repository/like.repo';
import {
  saveArticle,
  findArticles,
  findArticleById,
  deleteArticleById,
  updateArticleById,
  completeArticleById,
  increaseArticleLikeCount,
  increaseArticleViewCount,
} from '../repository/article.repo';

export const createArticle = async (request: Request, response: Response) => {
  const {
    title,
    content,
    recruitmentType,
    recruitmentLimit,
    progressMode,
    duration,
    closingDate,
    stackIds,
    positionIds,
  } = request.body;
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

    const [article] = await saveArticle<ArticleJoinMemberDB>(articlePost);

    await Promise.all([
      stackIds.forEach((stackId: number) => saveArticleStack(article.article_id, stackId)),
      positionIds.forEach((positionId: number) =>
        saveArticlePosition(article.article_id, positionId),
      ),
    ]);

    return response.status(201).json({
      articleId: article.article_id,
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error });
  }
};

export const getArticleList = async (_request: Request, response: Response) => {
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
  const { member } = response.locals;

  try {
    const [result] = await findArticleById(parseInt(id));
    if (isEmpty(result)) {
      return response.status(400).json({ message: '존재하지 않는 게시글 아이디입니다.' });
    }

    if (isEmpty(member)) {
      // 비회원일 경우 ip로 체크
      const ip = getClientIp(request);
      const viewIpInRedis = await findData(`article:${id}:viewIP:${ip}`);

      if (viewIpInRedis == null) {
        await saveData(`article:${id}:viewIP:${ip}`, ip, 60 * 60 * 2);
        await increaseArticleViewCount(parseInt(id), result.view_count + 1);
        result.view_count++;
      }
    } else {
      // 회원일 경우 member_id로 체크
      const viewMemberIdInRedis = await findData(`article:${id}:viewMemberId:${member.memberId}`);

      if (viewMemberIdInRedis == null) {
        await saveData(
          `article:${id}:viewMemberId:${member.memberId}`,
          member.memberId,
          60 * 60 * 24,
        );
        await increaseArticleViewCount(parseInt(id), result.view_count + 1);
        result.view_count++;
      }
    }

    const [stackResult, positionResult] = await Promise.all([
      findStackListByArticleId(parseInt(id)),
      findPositionListByArticleId(parseInt(id)),
    ]);

    const stacks = stackResult.rows.map((stack: StackDB) => snakeToCamel(stack));
    const positions = positionResult.rows.map((position: PositionDB) => snakeToCamel(position));

    const articleResponse = articleDBToArticleResponseDto(result);
    return response.status(200).json({ ...articleResponse, stacks, positions });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error });
  }
};

export const updateArticle = async (request: Request, response: Response) => {
  const { id } = request.params;
  const { title, content, recruitmentType, recruitmentLimit, progressMode, duration, closingDate } =
    request.body;
  const { member } = response.locals;

  try {
    const [findArticle] = await findArticleById(parseInt(id));

    if (isEmpty(findArticle)) {
      return response.status(400).json({ message: '존재하지 않는 게시글 아이디입니다.' });
    } else if (Number(findArticle.member_id) !== member.memberId) {
      return response.status(400).json({ message: '게시글 작성자가 아닙니다.' });
    }

    const updateData = {
      title,
      content,
      recruitmentType,
      recruitmentLimit,
      progressMode,
      duration,
      closingDate,
    };

    const snakeCaseUpdateData = camelToSnake(updateData);
    const { rows } = await updateArticleById(parseInt(id), snakeCaseUpdateData);

    return response.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error });
  }
};

export const completeArticle = async (request: Request, response: Response) => {
  const { id } = request.params;
  const { member } = response.locals;

  try {
    const [result] = await findArticleById(parseInt(id));

    if (isEmpty(result)) {
      return response.status(400).json({ message: '존재하지 않는 게시글 아이디입니다.' });
    }

    if (Number(result.member_id) !== member.memberId) {
      return response.status(403).json({ message: '게시글 작성자가 아닙니다.' });
    }

    if (result.is_closed) {
      return response.status(409).json({ message: '이미 모집이 완료된 게시글입니다.' });
    }
    await completeArticleById(parseInt(id));
    return response.sendStatus(204);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error });
  }
};

export const likeArticle = async (request: Request, response: Response) => {
  const { id } = request.params;
  const { member } = response.locals;

  try {
    const [result] = await findArticleById(parseInt(id));

    if (isEmpty(result)) {
      return response.status(400).json({ message: '존재하지 않는 게시글 아이디입니다.' });
    }

    if (Number(result.member_id) === member.memberId) {
      return response.status(403).json({ message: '게시글 작성자는 좋아요를 누를 수 없습니다.' });
    }

    const likeCheck = await findLikeByArticleIdAndMemberId(parseInt(id), Number(member.memberId));

    if (isEmpty(likeCheck)) {
      await saveLike(parseInt(id), Number(member.memberId));
      await increaseArticleLikeCount(parseInt(id), PlusOrMinus.PLUS);
      return response.sendStatus(204);
    }

    await deleteLikeByArticleIdAndMemberId(parseInt(id), Number(member.memberId));
    await increaseArticleLikeCount(parseInt(id), PlusOrMinus.MINUS);
    return response.sendStatus(204);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error });
  }
};

export const joinArticle = async (request: Request, response: Response) => {
  const { id } = request.params;
  const {
    member: { memberId },
  } = response.locals;

  try {
    const [findArticle] = await findArticleById(parseInt(id));

    if (isEmpty(findArticle)) {
      return response.status(400).json({ message: '존재하지 않는 게시글입니다.' });
    } else if (findArticle.is_closed) {
      return response.status(400).json({ message: '모집이 마감된 게시글입니다.' });
    } else if (+memberId === +findArticle.member_id) {
      return response.status(400).json({ message: '자신의 게시글에는 참여할 수 없습니다.' });
    }

    const isJoin = await findJoinByArticleIdAndMemberId(+id, +memberId);

    if (!isEmpty(isJoin)) {
      return response.status(400).json({ message: '이미 참여 신청한 게시글입니다.' });
    }

    const savedJoin = await savaJoin(+id, +memberId);

    return response.status(201).json(savedJoin);
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

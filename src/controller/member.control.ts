import { Request, Response } from 'express';
import { isEmpty } from 'lodash';

import { env } from '../util/env';
import { createToken, hashToPassword } from '../util/auth';
import * as redis from '../util/redis';
import { findByUsername, saveMember } from '../repository/member.repo';
import { PostMember } from '../types/member';

export const register = async (request: Request, response: Response) => {
  const { username, password, nickname, memberImage } = request.body;

  try {
    const [findMember] = await findByUsername(username);

    if (!isEmpty(findMember)) {
      return response.status(409).json({ message: '이미 가입된 이메일입니다.' });
    }

    const hashPassword = hashToPassword(password);
    const member: PostMember = {
      username,
      password: hashPassword,
      nickname,
      memberImage: memberImage || null,
    };

    const [result] = await saveMember(member);

    const { accessKey, refreshKey, accessExpire, refreshExpire } = env.auth.jwt;
    const tokenInfo = {
      memberId: result.member_id,
      role: result.role,
    };

    const accessToken = createToken(tokenInfo, accessKey, accessExpire);
    const refreshToken = createToken(tokenInfo, refreshKey, refreshExpire);

    const key = `refresh:${result.member_id}`;
    await redis.saveData(key, refreshToken, refreshExpire);

    return response.status(201).json({
      memberId: result.member_id,
      nickname: result.nickname,
      memberImage: result.member_image,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error });
  }
};

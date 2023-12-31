import { Request, Response } from 'express';
import { isEmpty } from 'lodash';

import * as redis from '../util/redis';
import { env } from '../util/env';
import { compareToPassword, createToken, hashToPassword, verifyToken } from '../util/auth';
import {
  deleteMemberById,
  findById,
  findByUsername,
  saveMember,
  updateMemberById,
} from '../repository/member.repo';
import { PostMember } from '../types/member';
import { MemberDB, Role } from '../types/database';

// 토큰 생성
const createAccessAndRefreshToken = (member: MemberDB) => {
  const { accessKey, refreshKey, accessExpire, refreshExpire } = env.auth.jwt;
  const tokenInfo = {
    memberId: member.member_id,
    role: member.role,
  };

  const accessToken = createToken(tokenInfo, accessKey, accessExpire);
  const refreshToken = createToken(tokenInfo, refreshKey, refreshExpire);

  return [accessToken, refreshToken];
};

// 레디스 저장
const storeRefreshTokenInRedis = async (member: MemberDB, token: string) => {
  const { refreshExpire } = env.auth.jwt;
  const key = `refresh:${member.member_id}`;
  await redis.saveData(key, token, refreshExpire);
};

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
    const [accessToken, refreshToken] = createAccessAndRefreshToken(result);
    await storeRefreshTokenInRedis(result, refreshToken);

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

export const login = async (request: Request, response: Response) => {
  const { username, password } = request.body;

  try {
    const [findMember] = await findByUsername(username);

    if (isEmpty(findMember)) {
      return response.status(400).json({ message: '존재하지 않는 아이디입니다.' });
    }

    const match = compareToPassword(password, findMember.password);

    if (isEmpty(findMember) || !match) {
      return response.status(400).json({ message: '이메일 또는 비밀번호가 일치하지 않습니다.' });
    }

    const [accessToken, refreshToken] = createAccessAndRefreshToken(findMember);
    await storeRefreshTokenInRedis(findMember, refreshToken);

    return response.status(200).json({
      memberId: findMember.member_id,
      nickname: findMember.nickname,
      memberImage: findMember.member_image,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error });
  }
};

export const logout = async (request: Request, response: Response) => {
  const member = response.locals.member;

  try {
    if (isEmpty(member)) {
      return response.sendStatus(204);
    }

    const result = await redis.deleteData(`refresh:${member.memberId}`);

    if (result > 0) {
      return response.sendStatus(204);
    } else {
      return response.status(400).json({ message: '로그인한 유저가 아닙니다.' });
    }
  } catch (error) {
    console.error(error);
    return response.status(500).json(error);
  }
};

export const ReissueAccessUsingRefresh = async (request: Request, response: Response) => {
  const { refreshToken } = request.body;

  if (refreshToken == null) {
    return response.sendStatus(401);
  }

  try {
    const data = verifyToken(refreshToken, env.auth.jwt.refreshKey) as {
      memberId: string;
      role: Role;
    };

    const accessToken = createToken(
      { memberId: Number(data.memberId), role: data.role },
      env.auth.jwt.accessKey,
      env.auth.jwt.accessExpire,
    );

    return response.status(201).json({ accessToken });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error });
  }
};

export const me = async (request: Request, response: Response) => {
  const member = response.locals.member;

  try {
    const [findMember] = await findById(parseInt(member.memberId));

    if (isEmpty(findMember)) {
      return response.status(400).json({ message: '존재하지 않는 회원입니다.' });
    }

    if (findMember.is_deleted) {
      return response.status(400).json({ message: '탈퇴한 회원입니다.' });
    }

    const responseDto = {
      memberId: findMember.member_id,
      username: findMember.username,
      nickname: findMember.nickname,
      memberImage: findMember.member_image,
      introduction: findMember.introduction,
      role: findMember.role,
      status: findMember.status,
      createdAt: findMember.created_at,
    };

    return response.status(200).json(responseDto);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error });
  }
};

export const updateMember = async (request: Request, response: Response) => {
  const { password, nickname, memberImage, introduce } = request.body;
  const { memberId } = response.locals.member;

  try {
    const [findMember] = await findById(parseInt(memberId));

    if (isEmpty(findMember)) {
      return response.status(400).json({ message: '존재하지 않는 회원입니다.' });
    } else if (findMember.is_deleted) {
      return response.status(400).json({ message: '탈퇴한 회원입니다.' });
    }

    findMember.password = password || findMember.password;
    findMember.nickname = nickname || findMember.nickname;
    findMember.member_image = memberImage || findMember.member_image;
    findMember.introduction = introduce || findMember.introduction;

    const [result] = await updateMemberById(findMember);
    const memberResponseDto = {
      memberId: result.member_id,
      username: result.username,
      nickname: result.nickname,
      memberImage: result.member_image,
      introduction: result.introduction,
      role: result.role,
      status: result.status,
      createdAt: result.created_at,
    };

    return response.status(200).json(memberResponseDto);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error });
  }
};

export const deleteMember = async (request: Request, response: Response) => {
  const { memberId } = response.locals.member;

  try {
    const [findMember] = await findById(parseInt(memberId));

    if (isEmpty(findMember)) {
      return response.status(400).json({ message: '존재하지 않는 회원입니다.' });
    } else if (findMember.is_deleted) {
      return response.status(400).json({ message: '탈퇴한 회원입니다.' });
    }

    await deleteMemberById(Number(memberId));

    return response.sendStatus(204);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error });
  }
};

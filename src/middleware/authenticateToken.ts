import { NextFunction, Request, Response } from 'express';

import { env } from '../util/env';
import { verifyToken } from '../util/auth';
import { Role } from '../types/database';

interface AuthMemberInfo {
  memberId: number;
  role: Role;
}

const checkVerifyToken = (data: any, key: string): data is AuthMemberInfo => {
  return typeof data === 'object' && key in data;
};

const authenticateToken = (request: Request, response: Response, next: NextFunction) => {
  const authHeader = request.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (token == null) {
    return next();
  }

  try {
    const decode = verifyToken(token, env.auth.jwt.accessKey);

    if (checkVerifyToken(decode, 'memberId')) {
      response.locals.member = {
        memberId: Number(decode.memberId),
        role: decode.role,
      };
    }

    next();
  } catch (error) {
    // token expire 체크
    if (
      error &&
      typeof error === 'object' &&
      'name' in error &&
      error.name === 'TokenExpiredError'
    ) {
      response.locals.tokenExpire = error;
      return next();
    }
    console.error(error);
    return response.status(500).json({ error });
  }
};

export const requireTokenCheck = (_request: Request, response: Response, next: NextFunction) => {
  if (response.locals.tokenExpire) {
    return response.status(401).json(response.locals.tokenExpire);
  }

  if (!response.locals.member) {
    return response.status(401).json({ message: '로그인이 필요합니다.' });
  }

  next();
};

export default authenticateToken;

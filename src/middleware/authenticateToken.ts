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
    return response.status(401).json({ message: '유효하지 않은 토큰입니다.' });
  }

  try {
    const decode = verifyToken(token, env.auth.jwt.accessKey);

    if (checkVerifyToken(decode, 'memberId')) {
      response.locals.member = {
        memberId: Number(decode.memberId),
        role: decode.role,
      };

      next();
    } else {
      return response.status(401).json({ message: '유효하지 않은 토큰입니다.' });
    }
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error });
  }
};

export default authenticateToken;

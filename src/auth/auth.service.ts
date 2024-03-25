import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  BCRYPT_HASH_ROUNDS_KEY,
  ENV_JWT_SECRET_KEY,
} from './../common/const/env-keys.const';
import { UsersModel } from './../users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async registerWithEmail(registerUserDto: RegisterUserDto) {
    const hash = await bcrypt.hash(
      registerUserDto.password,
      parseInt(BCRYPT_HASH_ROUNDS_KEY),
    );
    const newUser = await this.usersService.createUser({
      ...registerUserDto,
      password: hash,
    });

    return await this.generateToken(newUser);
  }

  async loginWithEmail(user: Pick<UsersModel, 'email' | 'password'>) {
    const findUser = await this.authenticateWithEmailAndPassword(user);

    return await this.generateToken(findUser);
  }

  async generateToken(user: Pick<UsersModel, 'id' | 'email'>) {
    const accessToken = this.signToken(user, false);
    const refreshToken = this.signToken(user, true);

    return { accessToken, refreshToken };
  }

  signToken(user: Pick<UsersModel, 'id' | 'email'>, isRefreshToken: boolean) {
    const payload = {
      email: user.email,
      sub: user.id,
      type: isRefreshToken ? 'refresh' : 'access',
    };

    return this.jwtService.sign(payload, {
      secret: ENV_JWT_SECRET_KEY,
      expiresIn: isRefreshToken ? 3600 : 600,
    });
  }

  async authenticateWithEmailAndPassword(
    user: Pick<UsersModel, 'email' | 'password'>,
  ) {
    const findUser = await this.usersService.getUserByEmail(user.email);

    if (!findUser) {
      throw new UnauthorizedException('잘못된 이메일입니다.');
    }

    const isMatch = await bcrypt.compare(user.password, findUser.password);

    if (!isMatch) {
      throw new UnauthorizedException('비밀번호가 틀렸습니다.');
    }

    return findUser;
  }

  // Token 재발급
  extractTokenFromHeader(header: string, isBearer: boolean) {
    const splitToken = header.split(' ');
    const prefix = isBearer ? 'Bearer' : 'Basic';

    if (splitToken.length !== 2 || splitToken[0] !== prefix) {
      throw new UnauthorizedException('잘못된 토큰입니다.');
    }

    const token = splitToken[1];

    return token;
  }

  decodeBasicToken(base64String: string) {
    const decoded = Buffer.from(base64String, 'base64').toString('utf-8');
    const split = decoded.split(':');

    if (split.length !== 2) {
      throw new UnauthorizedException('잘못된 유형의 토큰입니다.');
    }

    const [email, password] = split;

    return { email, password };
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: ENV_JWT_SECRET_KEY,
      });
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }

  rotateToken(token: string, isRefreshToken: boolean) {
    const decoded = this.jwtService.verify(token, {
      secret: ENV_JWT_SECRET_KEY,
    });

    if (decoded.type !== 'refresh') {
      throw new UnauthorizedException(
        '토큰 재발급은 Refresh Token으로 가능합니다!',
      );
    }

    return this.signToken({ ...decoded }, isRefreshToken);
  }
}

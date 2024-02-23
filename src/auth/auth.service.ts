import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  BCRYPT_HASH_ROUNDS_KEY,
  ENV_JWT_SECRET_KEY,
} from './../common/const/env-keys.const';
import { UsersModel } from './../users/entities/users.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async registerWithEmail(
    user: Pick<UsersModel, 'email' | 'password' | 'nickname'>,
  ) {
    const hash = await bcrypt.hash(user.password, BCRYPT_HASH_ROUNDS_KEY);
    const newUser = await this.usersService.createUser({
      ...user,
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
}

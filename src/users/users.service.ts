import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UsersModel } from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly usersRepository: Repository<UsersModel>,
  ) {}

  async createUser(user: Pick<UsersModel, 'email' | 'password' | 'nickname'>) {
    const { email, password, nickname } = user;

    const emailExists = await this.usersRepository.exists({
      where: { email },
    });

    if (emailExists) {
      throw new ConflictException('이미 가입한 이메일입니다.');
    }

    const nicknameExists = await this.usersRepository.exists({
      where: { nickname },
    });

    if (nicknameExists) {
      throw new ConflictException('사용중인 닉네임입니다.');
    }

    const userObj = this.usersRepository.create({ email, password, nickname });
    const newUser = await this.usersRepository.save(userObj);

    return newUser;
  }

  async getUserByEmail(email: string) {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async uploadImage(userId: number, image?: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    user.image = image || null;

    await this.usersRepository.save(user);

    return image;
  }
}

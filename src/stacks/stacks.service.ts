import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StacksModel } from './entities/stacks.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StacksService {
  constructor(
    @InjectRepository(StacksModel)
    private readonly stacksRepository: Repository<StacksModel>,
  ) {}

  async createStack(name: string) {
    const stack = this.stacksRepository.create({ name });

    return await this.stacksRepository.save(stack);
  }

  async getStacks() {
    return await this.stacksRepository.find();
  }

  async deleteStack(id: number) {
    return await this.stacksRepository.delete(id);
  }
}

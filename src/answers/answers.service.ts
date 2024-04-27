import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnswersModel } from './entities/answers.entity';

@Injectable()
export class AnswersService {
  constructor(
    @InjectRepository(AnswersModel)
    private answersRepository: Repository<AnswersModel>,
  ) {}

  async createAnswer(
    answer: string,
    questionId: number,
    userId: number,
  ): Promise<AnswersModel> {
    const newAnswer = this.answersRepository.create({
      answer,
      question: { id: questionId },
      user: { id: userId },
    });

    return this.answersRepository.save(newAnswer);
  }
}

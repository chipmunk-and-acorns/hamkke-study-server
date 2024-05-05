import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { QuestionsModel } from './entities/questions.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(QuestionsModel)
    private readonly questionsRepository: Repository<QuestionsModel>,
  ) {}

  async generateQuestions(postId: number, question: string) {
    const newQuestion = this.questionsRepository.create({
      question,
      post: {
        id: postId,
      },
    });

    return await this.questionsRepository.save(newQuestion);
  }

  async deleteQuestion(questionId: number) {
    const question = await this.questionsRepository.findOne({
      where: { id: questionId },
    });

    if (!question) {
      throw new BadRequestException(
        `존재하지 않는 질문입니다 id:"${questionId}"`,
      );
    }

    return await await this.questionsRepository.delete(question.id);
  }
}

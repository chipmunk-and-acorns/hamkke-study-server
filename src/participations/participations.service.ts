import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ParticipationsModel } from './entities/participations.entity';
import { Repository } from 'typeorm';
import { CreateAnswerDto } from 'src/answers/dto/create-answer.dto';
import { AnswersService } from 'src/answers/answers.service';
import { ParticipationsStatus } from './const/type.const';

@Injectable()
export class ParticipationsService {
  constructor(
    @InjectRepository(ParticipationsModel)
    private readonly participationsRepository: Repository<ParticipationsModel>,
    private readonly answersService: AnswersService,
  ) {}

  async instantJoin(userId: number, postId: number) {
    const participation = this.participationsRepository.create({
      status: ParticipationsStatus.ACCEPT,
      user: {
        id: userId,
      },
      post: {
        id: postId,
      },
    });

    return await this.participationsRepository.save(participation);
  }

  async requestJoin(
    userId: number,
    postId: number,
    answers: CreateAnswerDto[],
  ) {
    const participation = this.participationsRepository.create({
      status: ParticipationsStatus.APPLY,
      user: {
        id: userId,
      },
      post: {
        id: postId,
      },
    });
    const newJoin = await this.participationsRepository.save(participation);

    for (const answer of answers) {
      await this.answersService.createAnswer(
        answer.answer,
        answer.questionId,
        userId,
      );
    }

    return newJoin;
  }
}

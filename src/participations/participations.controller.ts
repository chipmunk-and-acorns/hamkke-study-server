import {
  Body,
  Controller,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ParticipationsService } from './participations.service';
import { User } from 'src/users/decorator/user.decorator';
import { CreateAnswerDto } from 'src/answers/dto/create-answer.dto';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';

@Controller('participations')
export class ParticipationsController {
  constructor(private readonly participationsService: ParticipationsService) {}

  @UseGuards(AccessTokenGuard)
  @Post('/instant')
  async postCreateInstantParticipation(
    @User('id') userId: number,
    @Body('postId', ParseIntPipe) postId: number,
  ) {
    return await this.participationsService.instantJoin(userId, postId);
  }

  @UseGuards(AccessTokenGuard)
  @Post('/request')
  async postCreateRequestParticipation(
    @User('id') userId: number,
    @Body('postId', ParseIntPipe) postId: number,
    @Body('answers') answers: CreateAnswerDto[],
  ) {
    return await this.participationsService.requestJoin(
      userId,
      postId,
      answers,
    );
  }
}
